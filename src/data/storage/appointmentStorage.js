import AsyncStorage from '@react-native-async-storage/async-storage';

const APPOINTMENTS_KEY = '@ecotech:appointments';

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

export const appointmentStorage = {
  async getAllAppointments() {
    const rawAppointments = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    return parseOrFallback(rawAppointments, []);
  },

  async saveAllAppointments(appointments) {
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  },
};
