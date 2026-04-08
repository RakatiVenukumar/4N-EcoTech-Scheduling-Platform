import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type TabItem = {
  name: 'Home' | 'Explore';
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export const tabs: TabItem[] = [
  {
    name: 'Home',
    title: 'Dashboard',
    icon: 'space-dashboard',
  },
  {
    name: 'Explore',
    title: 'Explore',
    icon: 'explore',
  },
];