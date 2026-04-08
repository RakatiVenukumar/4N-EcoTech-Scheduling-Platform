import React, { useMemo } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppointments } from '../src/context/AppointmentContext';

const AppointmentsScreen = () => {
  const { appointments, cancelAppointment } = useAppointments();

  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return appointments
      .filter((item) => {
        if (item.status === 'cancelled') {
          return false;
        }

        const appointmentDate = new Date(item.date);
        return appointmentDate >= startOfToday;
      })
      .sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return aDate.getTime() - bDate.getTime();
      });
  }, [appointments]);

  const handleCancel = async (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAppointment(appointmentId);
              Alert.alert('Appointment Cancelled', 'The appointment status was updated to cancelled.');
            } catch (error) {
              Alert.alert('Unable to Cancel', error.message || 'Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.providerName}>{item.providerName}</Text>
        <Text style={styles.meta}>Time: {item.time}</Text>
        <Text style={styles.meta}>Date: {item.date}</Text>
        <Text style={styles.meta}>Status: {item.status}</Text>

        <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.id)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={upcomingAppointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.title}>Upcoming Appointments</Text>}
        ListEmptyComponent={<Text style={styles.emptyState}>No upcoming appointments found.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
  cancelButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
  },
  cancelButtonText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  emptyState: {
    marginTop: 20,
    color: '#64748B',
    fontSize: 15,
  },
});

export default AppointmentsScreen;
