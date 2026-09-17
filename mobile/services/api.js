import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const LAN_API_URL = 'http://192.168.0.110';

function resolveApiBase() {
  const candidates = [
    process.env.EXPO_PUBLIC_API_URL,
    Constants.expoConfig?.extra?.apiUrl,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim().replace(/\/$/, '');
    }
  }

  if (Platform.OS === 'android' && Constants.isDevice === false) {
    return 'http://10.0.2.2';
  }

  return LAN_API_URL;
}

export const API_BASE = resolveApiBase();

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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  try {
    return await fetch(`${API_BASE}${path}`, {
      ...rest,
      signal: controller.signal,
      headers,
    });
  } catch (error) {
    const reason = error?.name === 'AbortError'
      ? `Tempo esgotado ao conectar em ${API_BASE}`
      : `Falha de rede ao conectar em ${API_BASE}`;
    const wrapped = new Error(reason);
    wrapped.cause = error;
    throw wrapped;
  } finally {
    clearTimeout(timer);
  }
}
