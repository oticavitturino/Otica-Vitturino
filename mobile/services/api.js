import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const PREFERRED_BASE_KEY = 'apiPreferredBase';

function splitOrigins(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }
  return value
    .split(',')
    .map((item) => item.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function unique(list) {
  return [...new Set(list)];
}

function isIpHost(hostname) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname === 'localhost' || hostname === '10.0.2.2';
}

function expandOrigin(origin) {
  try {
    const url = new URL(origin);
    const port = url.port;
    const candidates = [origin];

    if (url.protocol === 'http:') {
      if (!port) {
        candidates.push(`${url.protocol}//${url.hostname}:8081`);
        candidates.push(`${url.protocol}//${url.hostname}:8080`);
      } else if (port === '8080') {
        candidates.push(`${url.protocol}//${url.hostname}:8081`);
        candidates.push(`${url.protocol}//${url.hostname}`);
      } else if (port === '8081') {
        candidates.push(`${url.protocol}//${url.hostname}`);
        candidates.push(`${url.protocol}//${url.hostname}:8080`);
      }

      if (!isIpHost(url.hostname)) {
        candidates.push(`https://${url.hostname}`);
      }
    }

    return unique(candidates.map((item) => item.replace(/\/$/, '')));
  } catch {
    return [origin];
  }
}

function resolveApiBases() {
  const configured = unique([
    ...splitOrigins(process.env.EXPO_PUBLIC_API_URL),
    ...splitOrigins(Constants.expoConfig?.extra?.apiUrl),
  ]);

  const bases = unique(configured.flatMap(expandOrigin));

  if (bases.length === 0 && Platform.OS === 'android' && Constants.isDevice === false) {
    return ['http://10.0.2.2:8080', 'http://10.0.2.2:8081', 'http://10.0.2.2'];
  }

  return bases;
}

const API_BASES = resolveApiBases();
let preferredBase = API_BASES[0] || '';

export function getApiBase() {
  return preferredBase || API_BASES[0] || '';
}

export const API_BASE = getApiBase();

const TOKEN_KEY = 'userToken';
const USER_ID_KEY = 'userId';
const USER_NAME_KEY = 'userName';
const REFERRAL_CODE_KEY = 'referralCode';
const USER_PROFILE_KEY = 'userProfile';

export async function getToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setSession({ token, userId, name, referralCode, profile }) {
  const pairs = [];

  if (token) pairs.push([TOKEN_KEY, String(token)]);
  if (userId != null) pairs.push([USER_ID_KEY, String(userId)]);
  if (name) pairs.push([USER_NAME_KEY, String(name)]);
  if (referralCode) pairs.push([REFERRAL_CODE_KEY, String(referralCode)]);
  if (profile) pairs.push([USER_PROFILE_KEY, String(profile)]);

  if (pairs.length > 0) {
    await AsyncStorage.multiSet(pairs);
  }
}

export async function clearSession() {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    USER_ID_KEY,
    USER_NAME_KEY,
    REFERRAL_CODE_KEY,
    USER_PROFILE_KEY,
  ]);
}

export async function getUserId() {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch {
    return null;
  }
}

export async function getUserName() {
  try {
    return await AsyncStorage.getItem(USER_NAME_KEY);
  } catch {
    return null;
  }
}

async function loadPreferredBase() {
  try {
    const stored = await AsyncStorage.getItem(PREFERRED_BASE_KEY);
    if (stored && API_BASES.includes(stored)) {
      preferredBase = stored;
    }
  } catch {
    // ignore
  }
}

const preferredBaseReady = loadPreferredBase();

async function rememberPreferredBase(base) {
  preferredBase = base;
  try {
    await AsyncStorage.setItem(PREFERRED_BASE_KEY, base);
  } catch {
    // ignore
  }
}

function fetchWithTimeout(url, init, timeoutMs, externalSignal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

export async function apiFetch(path, options = {}) {
  const { auth = true, headers: customHeaders = {}, timeoutMs = 15000, signal, ...rest } = options;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (auth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  await preferredBaseReady;

  const orderedBases = unique([
    preferredBase,
    ...API_BASES,
  ]).filter(Boolean);

  if (orderedBases.length === 0) {
    throw new Error('Nenhuma URL da API configurada. Defina EXPO_PUBLIC_API_URL com o domínio e/ou o IP.');
  }

  const init = { ...rest, headers };
  const perAttemptTimeout = orderedBases.length > 1 ? Math.min(timeoutMs, 8000) : timeoutMs;

  const requestBase = (base) => fetchWithTimeout(`${base}${path}`, init, perAttemptTimeout, signal);

  try {
    if (preferredBase) {
      try {
        const response = await requestBase(preferredBase);
        await rememberPreferredBase(preferredBase);
        return response;
      } catch {
        // tenta as demais origens (domínio e IP)
      }
    }

    if (orderedBases.length === 1) {
      const response = await requestBase(orderedBases[0]);
      await rememberPreferredBase(orderedBases[0]);
      return response;
    }

    const { base, response } = await Promise.any(
      orderedBases.map(async (candidate) => {
        const result = await requestBase(candidate);
        return { base: candidate, response: result };
      })
    );
    await rememberPreferredBase(base);
    return response;
  } catch (error) {
    const failed = error?.errors?.[0] || error;
    const origin = getApiBase() || orderedBases.join(', ');
    const reason = failed?.name === 'AbortError'
      ? `Tempo esgotado ao conectar em ${origin}`
      : `Falha de rede ao conectar em ${origin}`;
    const wrapped = new Error(reason);
    wrapped.cause = failed;
    throw wrapped;
  }
}
