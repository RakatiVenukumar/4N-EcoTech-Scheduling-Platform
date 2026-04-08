import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import { Colors } from '../constants/colors';

const ProviderDetailsScreen = ({ route, navigation }) => {
  const { provider } = route.params;

  const handleBookAppointment = () => {
    navigation.navigate('BookAppointment', { provider });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: provider.profileImage }} style={styles.image} />

        <View style={styles.card}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.category}>{provider.category}</Text>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{provider.description}</Text>

          <Text style={styles.sectionTitle}>Available Slots</Text>
          {provider.availableSlots.length === 0 ? (
            <Text style={styles.emptySlots}>No available slots right now.</Text>
          ) : null}
          {provider.availableSlots.map((slot) => (
            <Text key={slot} style={styles.slotItem}>
              {new Date(slot).toLocaleString()}
            </Text>
          ))}

          <AppButton title="Book Appointment" onPress={handleBookAppointment} style={styles.bookButton} />
        </View>
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
  },
  image: {
    width: '100%',
    height: 230,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: Colors.border,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 6,
  },
  description: {
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  slotItem: {
    color: Colors.textPrimary,
    backgroundColor: Colors.infoSoft,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  emptySlots: {
    color: Colors.textSecondary,
    backgroundColor: Colors.infoSoft,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  bookButton: {
    marginTop: 10,
  },
});

export default ProviderDetailsScreen;
