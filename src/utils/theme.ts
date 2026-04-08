import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';

export type ThemeScheme = 'light' | 'dark';

export type AppTheme = {
  scheme: ThemeScheme;
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    text: string;
    mutedText: string;
    border: string;
    primary: string;
    primarySoft: string;
    success: string;
    warning: string;
  };
  navigationTheme: NavigationTheme;
};

const palette = {
  light: {
    background: '#F4F7FB',
    surface: '#FFFFFF',
    surfaceElevated: '#F9FBFD',
    text: '#102033',
    mutedText: '#5F6B7A',
    border: '#D8E0EA',
    primary: '#0F6EF2',
    primarySoft: '#E8F1FF',
    success: '#11865A',
    warning: '#B87310',
  },
  dark: {
    background: '#07111E',
    surface: '#0E1A2B',
    surfaceElevated: '#122138',
    text: '#F3F7FC',
    mutedText: '#95A3B8',
    border: '#23344A',
    primary: '#66A3FF',
    primarySoft: '#102B54',
    success: '#42C289',
    warning: '#E0A24A',
  },
} as const;

export function getAppTheme(colorScheme: string | null | undefined): AppTheme {
  const scheme: ThemeScheme = colorScheme === 'dark' ? 'dark' : 'light';

  return {
    scheme,
    colors: palette[scheme],
    navigationTheme: buildNavigationTheme(scheme),
  };
}

export function buildNavigationTheme(scheme: ThemeScheme): NavigationTheme {
  const colors = palette[scheme];
  const baseTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };
}

export function getThemeColors(colorScheme: string | null | undefined) {
  return palette[colorScheme === 'dark' ? 'dark' : 'light'];
}