import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import AppButton from '../components/AppButton';
import { Colors } from '../constants/colors';
import { validateEmail, validatePassword } from '../src/utils/validation';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error: authBootstrapError } = useAuth();

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      setError('');
      navigation.replace('Home');
    } catch (authError) {
      setError(authError.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.orbLarge} />
        <View style={styles.orbSmall} />
        <Text style={styles.eyebrow}>EcoTech Scheduling</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue.</Text>

        <View style={styles.formCard}>
          {authBootstrapError ? <Text style={styles.errorText}>{authBootstrapError}</Text> : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (error) {
                setError('');
              }
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (error) {
                setError('');
              }
            }}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <AppButton title="Login" onPress={handleLogin} loading={isSubmitting} style={styles.buttonSpacing} />

          <AppButton
            title="Go to Register"
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
  },
  orbLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: Colors.infoSoft,
    top: 120,
    right: -90,
  },
  orbSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: Colors.accentSoft,
    bottom: 160,
    left: -30,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    gap: 4,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },
  label: {
    fontSize: 15,
    color: Colors.secondary,
    marginBottom: 8,
    fontWeight: '700',
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    fontSize: 17,
  },
  errorText: {
    color: Colors.danger,
    marginBottom: 10,
    fontSize: 13,
  },
  buttonSpacing: {
    marginBottom: 12,
  },
});

export default LoginScreen;
