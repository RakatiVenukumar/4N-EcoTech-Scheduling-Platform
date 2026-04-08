import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const ProviderDetailsScreen = ({ route }) => {
  const { provider } = route.params;

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
          {provider.availableSlots.map((slot) => (
            <Text key={slot} style={styles.slotItem}>
              {new Date(slot).toLocaleString()}
            </Text>
          ))}
        </View>
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
  },
  image: {
    width: '100%',
    height: 230,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: '#E2E8F0',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  category: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 6,
  },
  description: {
    color: '#334155',
    lineHeight: 22,
  },
  slotItem: {
    color: '#0F172A',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
});

export default ProviderDetailsScreen;
