import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ModalScreen } from '@/screens/ModalScreen';
import { MainTabsNavigator } from '@/navigation/MainTabsNavigator';
import type { RootStackParamList } from '@/navigation/types';
import { useAppTheme } from '@/context/AppThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerShadowVisible: false,
        headerTintColor: colors.text,
      }}>
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="Modal"
        component={ModalScreen}
        options={{ presentation: 'modal', title: 'Quick action' }}
      />
    </Stack.Navigator>
  );
}