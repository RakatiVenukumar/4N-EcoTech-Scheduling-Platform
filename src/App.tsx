import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { AppThemeProvider } from '@/context/AppThemeContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useAppTheme } from '@/context/AppThemeContext';

function AppShell() {
  const { navigationTheme } = useAppTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <AppShell />
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}