import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@ecotech:auth:users';
const SESSION_KEY = '@ecotech:auth:session';

const parseOrFallback = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const authStorage = {
  async getUsers() {
    const rawUsers = await AsyncStorage.getItem(USERS_KEY);
    return parseOrFallback(rawUsers, []);
  },

  async saveUsers(users) {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  async getSessionUser() {
    const rawSession = await AsyncStorage.getItem(SESSION_KEY);
    return parseOrFallback(rawSession, null);
  },

  async saveSessionUser(user) {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  async clearSessionUser() {
    await AsyncStorage.removeItem(SESSION_KEY);
  },
};
