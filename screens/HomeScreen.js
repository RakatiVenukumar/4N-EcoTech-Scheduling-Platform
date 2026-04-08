import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import providers from '../data/providers';
import ProviderCard from '../components/ProviderCard';
import AppButton from '../components/AppButton';
import { Colors } from '../constants/colors';

const HomeScreen = ({ navigation }) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const handleViewDetails = (provider) => {
    navigation.navigate('ProviderDetails', { provider });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>EcoTech Network</Text>
        <Text style={styles.title}>Service Providers</Text>
        <Text style={styles.subtitle}>
          {currentUser ? `Welcome, ${currentUser.name}.` : 'Discover trusted providers for smart and sustainable homes.'}
        </Text>

        <View style={styles.statRow}>
          <View style={styles.statChip}>
            <Text style={styles.statValue}>{providers.length}</Text>
            <Text style={styles.statLabel}>Experts</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statValue}>24h</Text>
            <Text style={styles.statLabel}>Response</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Avg. Rating</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No providers available</Text>
      <Text style={styles.emptySubtitle}>Please check back later for new service providers.</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerActions}>
      <AppButton title="View Appointments" onPress={() => navigation.navigate('Appointments')} />
      <AppButton title="Logout" variant="secondary" onPress={handleLogout} style={styles.logoutButton} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={providers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProviderCard provider={item} onViewDetails={() => handleViewDetails(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
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
    paddingBottom: 34,
  },
  headerContainer: {
    marginBottom: 16,
  },
  heroCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    padding: 18,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  statRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flex: 1,
    backgroundColor: Colors.infoSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  emptyContainer: {
    backgroundColor: Colors.infoSoft,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutButton: {
    marginTop: 10,
  },
  footerActions: {
    marginTop: 8,
  },
});

export default HomeScreen;
