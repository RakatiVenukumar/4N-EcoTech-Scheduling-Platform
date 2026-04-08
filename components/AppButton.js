import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../constants/colors';

const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        isDisabled ? styles.disabled : null,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? Colors.surface : Colors.primary}
          />
        ) : null}
        <Text
          style={[
            styles.label,
            variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
            loading ? styles.loadingLabelSpacing : null,
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 5,
  },
  secondary: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  disabled: {
    backgroundColor: Colors.primaryDisabled,
    borderColor: Colors.primaryDisabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  primaryLabel: {
    color: Colors.surface,
  },
  secondaryLabel: {
    color: Colors.textPrimary,
  },
  loadingLabelSpacing: {
    marginLeft: 8,
  },
});

export default AppButton;
