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
        <View style={styles.cardTopRow}>
          <Text style={styles.providerName}>{item.providerName}</Text>
          <Text style={styles.statusPill}>{item.status}</Text>
        </View>
        <Text style={styles.meta}>Date: {item.date}</Text>
        <Text style={styles.meta}>Time: {item.time}</Text>

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
            <Text style={styles.eyebrow}>Your Schedule</Text>
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
    paddingBottom: 28,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    gap: 2,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statusPill: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: Colors.success,
    backgroundColor: Colors.successSoft,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  meta: {
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  emptyContainer: {
    backgroundColor: Colors.infoSoft,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
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
