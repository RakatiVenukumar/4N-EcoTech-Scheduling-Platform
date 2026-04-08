import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import { Colors } from '../constants/colors';

const ProviderDetailsScreen = ({ route, navigation }) => {
  const { provider } = route.params;
  const [hasImageError, setHasImageError] = useState(false);
  const imageSource = useMemo(() => {
    if (!hasImageError && provider?.profileImage) {
      return { uri: provider.profileImage };
    }

    return require('../assets/images/icon.png');
  }, [hasImageError, provider?.profileImage]);

  const handleBookAppointment = () => {
    navigation.navigate('BookAppointment', { provider });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroMetaRow}>
          <Text style={styles.eyebrow}>Provider Profile</Text>
          <Text style={styles.tag}>{provider.category}</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} resizeMode="contain" onError={() => setHasImageError(true)} />
        </View>

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
    paddingBottom: 24,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  tag: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    backgroundColor: Colors.infoSoft,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: Colors.backgroundAccent,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.26,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    padding: 18,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },
  name: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 8,
  },
  description: {
    color: Colors.textMuted,
    lineHeight: 24,
    fontSize: 15,
  },
  slotItem: {
    color: Colors.textPrimary,
    backgroundColor: Colors.infoSoft,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: Colors.border,
    fontWeight: '600',
  },
  emptySlots: {
    color: Colors.textMuted,
    backgroundColor: Colors.infoSoft,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bookButton: {
    marginTop: 12,
  },
});

export default ProviderDetailsScreen;
