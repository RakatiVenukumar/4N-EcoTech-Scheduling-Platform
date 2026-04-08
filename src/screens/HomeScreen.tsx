import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { dashboardSummary, upcomingActions } from '@/data/dashboard';
import type { MainTabsParamList, RootStackParamList } from '@/navigation/types';
import { formatShortDate } from '@/utils/format-date';
import { useAppTheme } from '@/context/AppThemeContext';

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp<MainTabsParamList>>();
  const { colors } = useAppTheme();
  const parentNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={[styles.hero, { backgroundColor: colors.surface }]}> 
        <ThemedText type="subtitle" lightColor={colors.mutedText} darkColor={colors.mutedText}>
          {formatShortDate()}
        </ThemedText>
        <ThemedText type="title">Scheduling command center</ThemedText>
        <ThemedText>
          Track staffing, approvals, and field coordination from a single operational view.
        </ThemedText>
        <Pressable
          onPress={() => parentNavigation?.navigate('Modal')}
          style={({ pressed }) => [
            styles.primaryAction,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}>
          <ThemedText type="defaultSemiBold" style={styles.primaryActionText}>
            Open quick action
          </ThemedText>
        </Pressable>
      </ThemedView>

      <View style={styles.section}>
        <ThemedText type="subtitle">Operations snapshot</ThemedText>
        <View style={styles.summaryGrid}>
          {dashboardSummary.map((item) => (
            <ThemedView key={item.label} style={[styles.summaryCard, { backgroundColor: colors.surface }]}> 
              <ThemedText type="subtitle">{item.value}</ThemedText>
              <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
              <ThemedText>{item.detail}</ThemedText>
            </ThemedView>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Next actions</ThemedText>
        {upcomingActions.map((action) => (
          <ThemedView key={action.title} style={[styles.actionCard, { backgroundColor: colors.surface }]}> 
            <ThemedText type="defaultSemiBold">{action.title}</ThemedText>
            <ThemedText>{action.description}</ThemedText>
          </ThemedView>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  hero: {
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
  primaryAction: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryActionText: {
    color: '#FFFFFF',
  },
  section: {
    gap: 12,
  },
  summaryGrid: {
    gap: 12,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 18,
    gap: 6,
  },
  actionCard: {
    borderRadius: 20,
    padding: 18,
    gap: 6,
    marginBottom: 12,
  },
});