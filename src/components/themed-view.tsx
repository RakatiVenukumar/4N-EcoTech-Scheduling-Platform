import { View, type ViewProps } from 'react-native';

import { useAppTheme } from '@/context/AppThemeContext';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { scheme, colors } = useAppTheme();
  const backgroundColor = scheme === 'dark' ? darkColor : lightColor;

  return <View style={[{ backgroundColor: backgroundColor ?? colors.background }, style]} {...otherProps} />;
}