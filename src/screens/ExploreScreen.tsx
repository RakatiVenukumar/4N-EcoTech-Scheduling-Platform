import { StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { operationalHighlights } from '@/data/dashboard';
import { useAppTheme } from '@/context/AppThemeContext';

export function ExploreScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <ThemedView style={[styles.header, { backgroundColor: colors.surface }]}> 
        <ThemedText type="subtitle" lightColor={colors.mutedText} darkColor={colors.mutedText}>
          Architecture overview
        </ThemedText>
        <ThemedText type="title">Built for growth</ThemedText>
        <ThemedText>
          The codebase now separates navigation, screens, shared UI, data, context, and utilities.
        </ThemedText>
      </ThemedView>

      <View style={styles.section}>
        {operationalHighlights.map((item) => (
          <Collapsible key={item.title} title={item.title}>
            <ThemedText>{item.detail}</ThemedText>
          </Collapsible>
        ))}
      </View>

      <ThemedView style={[styles.footer, { backgroundColor: colors.surface }]}> 
        <ThemedText type="defaultSemiBold">Next step</ThemedText>
        <ThemedText>
          Wire these screens to your real scheduling data, then expand the navigation stack as the
          product grows.
        </ThemedText>
        <ExternalLink href="https://reactnavigation.org/">
          <ThemedText type="link">React Navigation docs</ThemedText>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  header: {
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
  section: {
    gap: 12,
  },
  footer: {
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
});