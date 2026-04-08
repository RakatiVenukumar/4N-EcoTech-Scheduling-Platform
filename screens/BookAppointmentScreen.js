import React, { useMemo, useState } from 'react';
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

const BookAppointmentScreen = ({ route }) => {
  const { provider } = route.params;
  const { currentUser } = useAuth();
  const { bookAppointment } = useAppointments();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slotOptions = useMemo(() => provider?.availableSlots ?? [], [provider]);

  const handleSelectSlot = (slotValue) => {
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

    Alert.alert(
      'Booking Confirmed',
      `${appointment.providerName} on ${appointment.date} at ${appointment.time}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Book Appointment</Text>
        <Text style={styles.subtitle}>Choose a slot with {provider.name}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          {slotOptions.length === 0 ? <Text style={styles.emptyMessage}>No slots currently available.</Text> : null}

          {slotOptions.map((slot) => {
            const isSelected = selectedSlot === slot;

            return (
              <TouchableOpacity
                key={slot}
                style={[styles.slotButton, isSelected ? styles.slotButtonSelected : null]}
                onPress={() => handleSelectSlot(slot)}>
                <Text style={[styles.slotText, isSelected ? styles.slotTextSelected : null]}>
                  {new Date(slot).toLocaleString()}
                </Text>
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
          disabled={!appointment}
          loading={isSubmitting}
        />
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
  slotText: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  slotTextSelected: {
    color: Colors.primaryPressed,
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
});

export default BookAppointmentScreen;
