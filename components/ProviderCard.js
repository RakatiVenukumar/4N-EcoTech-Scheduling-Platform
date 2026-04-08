import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import AppButton from './AppButton';
import { Colors } from '../constants/colors';

const ProviderCard = ({ provider, onViewDetails }) => {
  const [hasImageError, setHasImageError] = useState(false);
  const imageSource = useMemo(() => {
    if (!hasImageError && provider?.profileImage) {
      return { uri: provider.profileImage };
    }

    return require('../assets/images/icon.png');
  }, [hasImageError, provider?.profileImage]);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="contain" onError={() => setHasImageError(true)} />
      </View>

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <Text style={styles.categoryBadge}>{provider.category}</Text>
        </View>
        <Text style={styles.name}>{provider.name}</Text>
        <Text numberOfLines={2} style={styles.descriptionPreview}>{provider.description}</Text>

        <AppButton title="View Details" onPress={onViewDetails} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 184,
    backgroundColor: Colors.backgroundAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.infoSoft,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  descriptionPreview: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default ProviderCard;
