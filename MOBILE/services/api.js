import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_API_URL = 'http://192.168.0.8:8080';

export const API_BASE = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

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
  const { auth = true, headers: customHeaders = {}, ...rest } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (auth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
  });
}
