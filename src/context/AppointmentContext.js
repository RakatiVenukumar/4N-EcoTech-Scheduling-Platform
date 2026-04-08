import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from './AuthContext';
import { appointmentService } from '../domain/appointment/appointmentService';

const AppointmentContext = createContext(undefined);

export const AppointmentProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [allAppointments, setAllAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const bootstrapAppointments = async () => {
      try {
        const initialAppointments = await appointmentService.hydrateAppointments();
        if (isMounted) {
          setAllAppointments(initialAppointments);
          setError('');
        }
      } catch (bootstrapError) {
        if (isMounted) {
          setError(bootstrapError.message || 'Unable to load appointments.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrapAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentUserEmail = currentUser?.email ?? '';

  const getAppointments = useCallback(() => {
    return appointmentService.getAppointmentsByUser(allAppointments, currentUserEmail);
  }, [allAppointments, currentUserEmail]);

  const bookAppointment = useCallback(
    async (appointment) => {
      const nextAppointments = await appointmentService.bookAppointment(appointment, currentUserEmail);
      setAllAppointments(nextAppointments);
      return appointmentService.getAppointmentsByUser(nextAppointments, currentUserEmail);
    },
    [currentUserEmail]
  );

  const cancelAppointment = useCallback(
    async (appointmentId) => {
      const nextAppointments = await appointmentService.cancelAppointment(appointmentId, currentUserEmail);
      setAllAppointments(nextAppointments);
      return appointmentService.getAppointmentsByUser(nextAppointments, currentUserEmail);
    },
    [currentUserEmail]
  );

  const value = useMemo(
    () => ({
      appointments: getAppointments(),
      isLoading,
      error,
      bookAppointment,
      cancelAppointment,
      getAppointments,
    }),
    [getAppointments, isLoading, error, bookAppointment, cancelAppointment]
  );

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);

  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }

  return context;
};
