import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useAppointments } from '../src/context/AppointmentContext';

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
      await bookAppointment(appointment);
    } catch (error) {
      Alert.alert('Booking Failed', error.message || 'Unable to book appointment.');
      return;
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

        <TouchableOpacity
          style={[styles.confirmButton, !appointment ? styles.confirmButtonDisabled : null]}
          onPress={handleConfirmBooking}
          disabled={!appointment}>
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    color: '#475569',
    fontSize: 15,
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  slotButton: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  slotButtonSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0EA5E9',
  },
  slotText: {
    color: '#0F172A',
    fontWeight: '500',
  },
  slotTextSelected: {
    color: '#0369A1',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  summaryItem: {
    color: '#334155',
    marginBottom: 4,
  },
  confirmButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default BookAppointmentScreen;
