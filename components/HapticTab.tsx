import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export const HapticTab = ({ children, onPress, ...rest }: BottomTabBarButtonProps) => {
  const handlePress = (event: any) => {
    Haptics.selectionAsync();
    if (onPress) {
      onPress(event);
    }
  };

  // Remove props that are explicitly `null`
  const safeProps = Object.fromEntries(
    Object.entries(rest).filter(([_, value]) => value !== null)
  );

  return (
    <TouchableOpacity onPress={handlePress} {...safeProps}>
      {children}
    </TouchableOpacity>
  );
};
