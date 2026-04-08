import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import AppButton from './AppButton';
import { Colors } from '../constants/colors';

const ProviderCard = ({ provider, onViewDetails }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: provider.profileImage }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.category}>{provider.category}</Text>

        <AppButton title="View Details" onPress={onViewDetails} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 170,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 14,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
});

export default ProviderCard;
