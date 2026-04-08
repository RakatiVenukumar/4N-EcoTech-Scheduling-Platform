import React, { useEffect, useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useAppointments } from '../src/context/AppointmentContext';
import AppButton from '../components/AppButton';
import { Colors } from '../constants/colors';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (date) => {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const BookAppointmentScreen = ({ route, navigation }) => {
  const { provider } = route.params;
  const { currentUser } = useAuth();
  const { appointments, bookAppointment, rescheduleAppointment } = useAppointments();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [rescheduleSlot, setRescheduleSlot] = useState(null);

  const slotOptions = useMemo(() => provider?.availableSlots ?? [], [provider]);
  const hasActiveAppointmentWithProvider = useMemo(
    () => appointments.some((item) => item.providerName === provider.name && item.status !== 'cancelled'),
    [appointments, provider.name]
  );

  const bookedSlotKeys = useMemo(() => {
    // Build quick lookup for occupied slots to disable unavailable options in UI.
    return new Set(
      appointments
        .filter((item) => item.providerName === provider.name && item.status !== 'cancelled')
        .map((item) => `${item.date}|${item.time}`)
    );
  }, [appointments, provider.name]);

  useEffect(() => {
    if (!currentUser?.email) {
      setError('Please log in again to continue booking.');
      return;
    }

    if (hasActiveAppointmentWithProvider) {
      setError(`You already have an active appointment with ${provider.name}. Cancel it before booking another one.`);
      // Automatically show the reschedule UI if user has an active appointment
      const existingAppointment = appointments.find(
        (item) => item.providerName === provider.name && item.status !== 'cancelled'
      );
      if (existingAppointment) {
        setBookedAppointment(existingAppointment);
      }
    } else {
      // Clear the booked appointment UI if no active appointment
      setBookedAppointment(null);
    }
  }, [currentUser, hasActiveAppointmentWithProvider, provider.name, appointments]);

  const handleSelectSlot = (slotValue) => {
    if (hasActiveAppointmentWithProvider) {
      return;
    }

    const slotDate = new Date(slotValue);
    const nextAppointment = {
      id: `apt-${Date.now()}`,
      providerName: provider.name,
      time: formatTime(slotDate),
      date: formatDate(slotDate),
      userEmail: currentUser?.email ?? '',
      status: 'pending',
    };

    setSelectedSlot(slotValue);
    setAppointment(nextAppointment);
  };

  const handleConfirmBooking = async () => {
    if (!appointment) {
      setError('Please select an available slot.');
      return;
    }

    if (!currentUser?.email) {
      setError('Please log in again to continue booking.');
      return;
    }

    if (hasActiveAppointmentWithProvider) {
      setError(`You already have an active appointment with ${provider.name}. Cancel it before booking another one.`);
      return;
    }

    try {
      setIsSubmitting(true);
      await bookAppointment(appointment);
      setError('');
    } catch (error) {
      setError(error.message || 'Unable to book appointment.');
      return;
    } finally {
      setIsSubmitting(false);
    }

    // Show booked confirmation instead of alert - allow user to reschedule
    setBookedAppointment(appointment);
    setSelectedSlot(null);
    setAppointment(null);
    setRescheduleSlot(null);
  };

  const handleReschedule = async () => {
    if (!rescheduleSlot) {
      setError('Please select a new slot to reschedule.');
      return;
    }

    if (!currentUser?.email) {
      setError('Please log in again to continue.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newAppointment = {
        providerName: provider.name,
        time: formatTime(new Date(rescheduleSlot)),
        date: formatDate(new Date(rescheduleSlot)),
        userEmail: currentUser?.email ?? '',
        status: 'pending',
      };

      await rescheduleAppointment(bookedAppointment.id, newAppointment);
      setError('');
      setBookedAppointment({...newAppointment, id: bookedAppointment.id});
      setRescheduleSlot(null);
    } catch (error) {
      setError(error.message || 'Unable to reschedule appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setBookedAppointment(null);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Screen works in two modes: initial booking mode and post-booking reschedule mode. */}
        {!bookedAppointment ? (
          <>
            <Text style={styles.title}>Book Appointment</Text>
            <Text style={styles.subtitle}>Choose a slot with {provider.name}</Text>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Available Slots</Text>
              {slotOptions.length === 0 ? <Text style={styles.emptyMessage}>No slots currently available.</Text> : null}

              {slotOptions.map((slot) => {
                const isSelected = selectedSlot === slot;
                const slotDate = new Date(slot);
                const slotKey = `${formatDate(slotDate)}|${formatTime(slotDate)}`;
                const isAlreadyBooked = bookedSlotKeys.has(slotKey);

                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotButton,
                      isSelected ? styles.slotButtonSelected : null,
                      isAlreadyBooked || hasActiveAppointmentWithProvider ? styles.slotButtonDisabled : null,
                    ]}
                    onPress={() => handleSelectSlot(slot)}
                    disabled={isAlreadyBooked || hasActiveAppointmentWithProvider}>
                    <Text
                      style={[
                        styles.slotText,
                        isSelected ? styles.slotTextSelected : null,
                        isAlreadyBooked ? styles.slotTextDisabled : null,
                      ]}>
                      {new Date(slot).toLocaleString()}
                    </Text>
                    {isAlreadyBooked ? <Text style={styles.bookedTag}>Already booked</Text> : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            {appointment ? (
              <View style={styles.summaryCard}>
                <Text style={styles.sectionTitle}>Appointment Preview</Text>
                <Text style={styles.summaryItem}>id: {appointment.id}</Text>
                <Text style={styles.summaryItem}>providerName: {appointment.providerName}</Text>
                <Text style={styles.summaryItem}>time: {appointment.time}</Text>
                <Text style={styles.summaryItem}>date: {appointment.date}</Text>
                <Text style={styles.summaryItem}>userEmail: {appointment.userEmail || 'guest@example.com'}</Text>
                <Text style={styles.summaryItem}>status: {appointment.status}</Text>
              </View>
            ) : null}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AppButton
              title="Confirm Booking"
              onPress={handleConfirmBooking}
              disabled={!appointment || hasActiveAppointmentWithProvider}
              loading={isSubmitting}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>Booking Confirmed! ✓</Text>
            <Text style={styles.subtitle}>{bookedAppointment.providerName}</Text>

            <View style={styles.successCard}>
              <Text style={styles.sectionTitle}>Your Appointment</Text>
              <Text style={styles.successItem}>📅 Date: {bookedAppointment.date}</Text>
              <Text style={styles.successItem}>🕐 Time: {bookedAppointment.time}</Text>
              <Text style={styles.successItem}>👤 Provider: {bookedAppointment.providerName}</Text>
            </View>

            <View style={styles.separatorCard}>
              <Text style={styles.sectionTitle}>Change to a Different Slot</Text>
              {slotOptions.length === 0 ? <Text style={styles.emptyMessage}>No other slots available.</Text> : null}

              {slotOptions.map((slot) => {
                const slotDate = new Date(slot);
                const slotKey = `${formatDate(slotDate)}|${formatTime(slotDate)}`;
                const isCurrentSlot = slotKey === `${bookedAppointment.date}|${bookedAppointment.time}`;
                const isRescheduleSelected = rescheduleSlot === slot;
                const isAlreadyBooked = bookedSlotKeys.has(slotKey) && !isCurrentSlot;

                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotButton,
                      isRescheduleSelected ? styles.slotButtonSelected : null,
                      isCurrentSlot ? styles.slotButtonDisabled : null,
                      isAlreadyBooked ? styles.slotButtonDisabled : null,
                    ]}
                    onPress={() => !isCurrentSlot && !isAlreadyBooked && setRescheduleSlot(slot)}
                    disabled={isCurrentSlot || isAlreadyBooked}>
                    <Text
                      style={[
                        styles.slotText,
                        isRescheduleSelected ? styles.slotTextSelected : null,
                        isCurrentSlot || isAlreadyBooked ? styles.slotTextDisabled : null,
                      ]}>
                      {new Date(slot).toLocaleString()}
                    </Text>
                    {isCurrentSlot ? <Text style={styles.currentTag}>Current Slot</Text> : null}
                    {isAlreadyBooked && !isCurrentSlot ? <Text style={styles.bookedTag}>Already booked</Text> : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AppButton
              title={rescheduleSlot ? 'Confirm Reschedule' : 'Skip'}
              onPress={rescheduleSlot ? handleReschedule : handleDone}
              variant={rescheduleSlot ? 'primary' : 'secondary'}
              loading={isSubmitting}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 15,
    marginBottom: 14,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  slotButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: Colors.surface,
  },
  slotButtonSelected: {
    backgroundColor: Colors.slotSelected,
    borderColor: Colors.primary,
  },
  slotButtonDisabled: {
    backgroundColor: Colors.infoSoft,
    borderColor: Colors.border,
    opacity: 0.75,
  },
  slotText: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  slotTextSelected: {
    color: Colors.primaryPressed,
  },
  slotTextDisabled: {
    color: Colors.textSecondary,
  },
  bookedTag: {
    marginTop: 4,
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 14,
  },
  summaryItem: {
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  emptyMessage: {
    color: Colors.textSecondary,
    fontSize: 14,
    backgroundColor: Colors.infoSoft,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: Colors.danger,
    marginBottom: 10,
    fontSize: 13,
  },
  successCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4CAF50',
    padding: 14,
    marginBottom: 14,
  },
  successItem: {
    color: '#2E7D32',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  separatorCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 14,
  },
  currentTag: {
    marginTop: 4,
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default BookAppointmentScreen;
