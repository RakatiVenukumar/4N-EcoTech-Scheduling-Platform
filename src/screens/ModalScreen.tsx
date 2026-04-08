import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { RootStackParamList } from '@/navigation/types';
import { useAppTheme } from '@/context/AppThemeContext';

export function ModalScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <ThemedView style={[styles.card, { backgroundColor: colors.surface }]}> 
        <ThemedText type="title">Quick action</ThemedText>
        <ThemedText>
          Use this modal for high-priority tasks such as approvals, schedule changes, or urgent
          notices.
        </ThemedText>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.secondaryAction,
            { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}>
          <ThemedText type="defaultSemiBold">Close</ThemedText>
        </Pressable>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  secondaryAction: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
});