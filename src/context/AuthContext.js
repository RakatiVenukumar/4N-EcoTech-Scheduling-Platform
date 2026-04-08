import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authService } from '../domain/auth/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const initialState = await authService.hydrateAuthState();

        if (!isMounted) {
          return;
        }

        setUsers(initialState.users);
        setCurrentUser(initialState.currentUser);
        setError('');
      } catch (bootstrapError) {
        if (isMounted) {
          setError(bootstrapError.message || 'Unable to restore your session.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const register = useCallback(async (user) => {
    const state = await authService.register(user);
    setUsers(state.users);
    setCurrentUser(state.currentUser ?? null);
    return state.currentUser;
  }, []);

  const login = useCallback(async (email, password) => {
    const state = await authService.login(email, password);
    setUsers(state.users);
    setCurrentUser(state.currentUser);
    return state.currentUser;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      isLoading,
      error,
      isAuthenticated: Boolean(currentUser),
      register,
      login,
      logout,
    }),
    [users, currentUser, isLoading, error, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
