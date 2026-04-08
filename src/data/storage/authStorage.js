import { safeStorage } from './safeStorage';

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
    const rawUsers = await safeStorage.getItem(USERS_KEY);
    return parseOrFallback(rawUsers, []);
  },

  async saveUsers(users) {
    await safeStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  async getSessionUser() {
    const rawSession = await safeStorage.getItem(SESSION_KEY);
    return parseOrFallback(rawSession, null);
  },

  async saveSessionUser(user) {
    await safeStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  async clearSessionUser() {
    await safeStorage.removeItem(SESSION_KEY);
  },
};
