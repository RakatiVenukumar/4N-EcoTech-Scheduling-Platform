import React, { useMemo } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useAppointments } from '../src/context/AppointmentContext';
import AppButton from '../components/AppButton';
import { Colors } from '../constants/colors';

const AppointmentsScreen = () => {
  const { appointments, cancelAppointment, isLoading, error } = useAppointments();

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
    const executeCancel = async () => {
      try {
        await cancelAppointment(appointmentId);
        Alert.alert('Appointment Cancelled', 'The appointment status was updated to cancelled.');
      } catch (error) {
        Alert.alert('Unable to Cancel', error.message || 'Please try again.');
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = globalThis.confirm('Are you sure you want to cancel this appointment?');
      if (!confirmed) {
        return;
      }

      await executeCancel();
      return;
    }

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
          onPress: executeCancel,
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

        <AppButton title="Cancel" variant="secondary" onPress={() => handleCancel(item.id)} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loaderText}>Loading appointments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={upcomingAppointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Upcoming Appointments</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No upcoming appointments</Text>
            <Text style={styles.emptyState}>You have no bookings right now. Book one from a provider profile.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 2,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  emptyContainer: {
    backgroundColor: Colors.infoSoft,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptyState: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loaderText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    marginBottom: 10,
  },
});

export default AppointmentsScreen;
