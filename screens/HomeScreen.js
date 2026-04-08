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
      <Text style={styles.title}>Service Providers</Text>
      <Text style={styles.subtitle}>
        {currentUser ? `Welcome, ${currentUser.name}.` : 'Discover the best providers for your needs.'}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No providers available</Text>
      <Text style={styles.emptySubtitle}>Please check back later for new service providers.</Text>
    </View>
  );

  const renderFooter = () => (
    <>
      <AppButton title="View Appointments" onPress={() => navigation.navigate('Appointments')} />
      <AppButton title="Logout" variant="secondary" onPress={handleLogout} style={styles.logoutButton} />
    </>
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
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  emptyContainer: {
    backgroundColor: Colors.infoSoft,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
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
});

export default HomeScreen;
