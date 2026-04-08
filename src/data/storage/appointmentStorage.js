import { safeStorage } from './safeStorage';

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
    const rawAppointments = await safeStorage.getItem(APPOINTMENTS_KEY);
    return parseOrFallback(rawAppointments, []);
  },

  async saveAllAppointments(appointments) {
    await safeStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  },
};
