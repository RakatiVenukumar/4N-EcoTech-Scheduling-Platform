import { appointmentStorage } from '../../data/storage/appointmentStorage';

const normalizeEmail = (email) => (email ?? '').trim().toLowerCase();

export const appointmentService = {
  async hydrateAppointments() {
    return appointmentStorage.getAllAppointments();
  },

  async bookAppointment(appointment, currentUserEmail) {
    const email = normalizeEmail(currentUserEmail);

    if (!email) {
      throw new Error('User session is required to book an appointment.');
    }

    if (!appointment?.providerName || !appointment?.time || !appointment?.date) {
      throw new Error('Incomplete appointment details.');
    }

    const allAppointments = await appointmentStorage.getAllAppointments();
    const newAppointment = {
      ...appointment,
      id: appointment.id || `apt-${Date.now()}`,
      userEmail: email,
      status: appointment.status || 'pending',
    };

    const nextAppointments = [...allAppointments, newAppointment];
    await appointmentStorage.saveAllAppointments(nextAppointments);

    return nextAppointments;
  },

  async cancelAppointment(appointmentId, currentUserEmail) {
    const email = normalizeEmail(currentUserEmail);

    if (!email) {
      throw new Error('User session is required to cancel an appointment.');
    }

    const allAppointments = await appointmentStorage.getAllAppointments();
    const nextAppointments = allAppointments.map((item) => {
      const isTarget = item.id === appointmentId && normalizeEmail(item.userEmail) === email;
      if (!isTarget) {
        return item;
      }

      return {
        ...item,
        status: 'cancelled',
      };
    });

    await appointmentStorage.saveAllAppointments(nextAppointments);
    return nextAppointments;
  },

  getAppointmentsByUser(allAppointments, currentUserEmail) {
    const email = normalizeEmail(currentUserEmail);

    if (!email) {
      return [];
    }

    return allAppointments.filter((appointment) => normalizeEmail(appointment.userEmail) === email);
  },
};
