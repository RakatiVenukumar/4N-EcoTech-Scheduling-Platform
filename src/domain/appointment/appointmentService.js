import { appointmentStorage } from '../../data/storage/appointmentStorage';

const normalizeEmail = (email) => (email ?? '').trim().toLowerCase();
const appointmentKey = (item) =>
  `${normalizeEmail(item.userEmail)}|${item.providerName}|${item.date}|${item.time}`;

const toComparableDate = (item) => {
  const fromDateTime = new Date(`${item.date} ${item.time}`);
  if (!Number.isNaN(fromDateTime.getTime())) {
    return fromDateTime;
  }

  const fromDateOnly = new Date(item.date);
  return fromDateOnly;
};

export const appointmentService = {
  async hydrateAppointments() {
    const allAppointments = await appointmentStorage.getAllAppointments();

    const sanitized = allAppointments.filter(
      (item) => item?.id && item?.providerName && item?.date && item?.time && item?.userEmail
    );

    const seen = new Set();
    const deduplicatedReversed = [];

    for (let index = sanitized.length - 1; index >= 0; index -= 1) {
      const item = sanitized[index];
      const key = appointmentKey(item);

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      deduplicatedReversed.push(item);
    }

    const deduplicated = deduplicatedReversed.reverse();

    // Keep only one active appointment per user per provider; extra active ones with same provider are auto-cancelled.
    const activeByUserProvider = new Set();
    const singleActivePerProvider = deduplicated.map((item) => {
      const userProviderKey = `${normalizeEmail(item.userEmail)}|${item.providerName}`;
      const isActive = item.status !== 'cancelled';

      if (!isActive) {
        return item;
      }

      if (!activeByUserProvider.has(userProviderKey)) {
        activeByUserProvider.add(userProviderKey);
        return item;
      }

      return {
        ...item,
        status: 'cancelled',
      };
    });

    // Persist only when hydration cleanup actually changed stored data.
    const hasChanged =
      singleActivePerProvider.length !== allAppointments.length ||
      JSON.stringify(singleActivePerProvider) !== JSON.stringify(allAppointments);

    if (hasChanged) {
      await appointmentStorage.saveAllAppointments(singleActivePerProvider);
    }

    return singleActivePerProvider;
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

    const hasActiveBookingWithProvider = allAppointments.some((item) => {
      const isSameUser = normalizeEmail(item.userEmail) === email;
      const isSameProvider = item.providerName === appointment.providerName;
      const isActive = item.status !== 'cancelled';
      return isSameUser && isSameProvider && isActive;
    });

    if (hasActiveBookingWithProvider) {
      throw new Error(`You already have an active appointment with ${appointment.providerName}. Cancel it before booking another.`);
    }

    // Check if the same user already booked this slot
    const hasDuplicateActiveBooking = allAppointments.some((item) => {
      const isSameUser = normalizeEmail(item.userEmail) === email;
      const isSameProvider = item.providerName === appointment.providerName;
      const isSameDate = item.date === appointment.date;
      const isSameTime = item.time === appointment.time;
      const isActive = item.status !== 'cancelled';

      return isSameUser && isSameProvider && isSameDate && isSameTime && isActive;
    });

    if (hasDuplicateActiveBooking) {
      throw new Error('You already booked this slot. Please choose a different time.');
    }

    // Check if ANY user already booked this slot (system-level prevention)
    const isSlotUnavailable = allAppointments.some((item) => {
      const isSameProvider = item.providerName === appointment.providerName;
      const isSameDate = item.date === appointment.date;
      const isSameTime = item.time === appointment.time;
      const isActive = item.status !== 'cancelled';

      return isSameProvider && isSameDate && isSameTime && isActive;
    });

    if (isSlotUnavailable) {
      throw new Error('This slot is no longer available. Please select a different time.');
    }

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

  async rescheduleAppointment(oldAppointmentId, newAppointment, currentUserEmail) {
    const email = normalizeEmail(currentUserEmail);

    if (!email) {
      throw new Error('User session is required to reschedule an appointment.');
    }

    if (!newAppointment?.providerName || !newAppointment?.time || !newAppointment?.date) {
      throw new Error('Incomplete appointment details.');
    }

    const allAppointments = await appointmentStorage.getAllAppointments();

    // Find the old appointment to ensure it exists and belongs to the user
    const oldAppointment = allAppointments.find(
      (item) => item.id === oldAppointmentId && normalizeEmail(item.userEmail) === email
    );

    if (!oldAppointment) {
      throw new Error('Appointment not found.');
    }

    // Check if the new slot is already booked by someone else (but not the current user's old slot)
    const isNewSlotTaken = allAppointments.some((item) => {
      const isSameProvider = item.providerName === newAppointment.providerName;
      const isSameDate = item.date === newAppointment.date;
      const isSameTime = item.time === newAppointment.time;
      const isActive = item.status !== 'cancelled';
      const isDifferentAppointment = item.id !== oldAppointmentId;

      return isSameProvider && isSameDate && isSameTime && isActive && isDifferentAppointment;
    });

    if (isNewSlotTaken) {
      throw new Error('This slot is no longer available. Please select a different time.');
    }

    // First pass: mark old appointment inactive so conflict checks remain accurate.
    const updatedAppointments = allAppointments.map((item) => {
      if (item.id === oldAppointmentId) {
        // Cancel the old appointment
        return {
          ...item,
          status: 'cancelled',
        };
      }
      return item;
    });

    // Second pass: replace the cancelled record with updated slot details.
    const finalAppointments = updatedAppointments.map((item) => {
      if (item.id === oldAppointmentId && item.status === 'cancelled') {
        // Keep the same id so UI references and future actions remain stable.
        return {
          ...newAppointment,
          id: oldAppointmentId,
          userEmail: email,
          status: 'pending',
        };
      }
      return item;
    });

    await appointmentStorage.saveAllAppointments(finalAppointments);
    return finalAppointments;
  },

  getAppointmentsByUser(allAppointments, currentUserEmail) {
    const email = normalizeEmail(currentUserEmail);

    if (!email) {
      return [];
    }

    return allAppointments
      .filter((appointment) => normalizeEmail(appointment.userEmail) === email)
      .sort((a, b) => toComparableDate(a).getTime() - toComparableDate(b).getTime());
  },
};
