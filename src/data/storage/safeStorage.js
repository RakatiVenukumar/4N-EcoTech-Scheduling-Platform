import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback storage for Expo Go and environments without native AsyncStorage
const memoryStore = {};

const trySaveToAsyncStorage = async (key, value) => {
  try {
    if (!AsyncStorage || !AsyncStorage.setItem) {
      throw new Error('AsyncStorage not available');
    }
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    // Silently fall back to memory storage
    memoryStore[key] = value;
  }
};

const tryGetFromAsyncStorage = async (key) => {
  try {
    if (!AsyncStorage || !AsyncStorage.getItem) {
      throw new Error('AsyncStorage not available');
    }
    return await AsyncStorage.getItem(key);
  } catch (error) {
    // Return from memory storage if AsyncStorage fails
    return memoryStore[key] || null;
  }
};

export const safeStorage = {
  async getItem(key) {
    return tryGetFromAsyncStorage(key);
  },

  async setItem(key, value) {
    await trySaveToAsyncStorage(key, value);
  },

  async removeItem(key) {
    try {
      if (AsyncStorage && AsyncStorage.removeItem) {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      // Silently catch
    }
    delete memoryStore[key];
  },

  async clear() {
    try {
      if (AsyncStorage && AsyncStorage.clear) {
        await AsyncStorage.clear();
      }
    } catch (error) {
      // Silently catch
    }
    Object.keys(memoryStore).forEach((key) => {
      delete memoryStore[key];
    });
  },
};
