import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { tabs } from '@/data/navigation';
import type { MainTabsParamList } from '@/navigation/types';
import { HomeScreen } from '@/screens/HomeScreen';
import { ExploreScreen } from '@/screens/ExploreScreen';
import { useAppTheme } from '@/context/AppThemeContext';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabsNavigator() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        sceneContainerStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: tabs[0].title,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size ?? 24} name="house.fill" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: tabs[1].title,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size ?? 24} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}