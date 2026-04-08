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
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: Colors.surface,
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
