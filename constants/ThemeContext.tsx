// constants/ThemeContext.ts
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeType = 'light' | 'dark';

// 👉 Add this type for your color palette!
export type ThemePalette = {
  background: string;
  card: string;
  text: string;
  icon: string;
  accent: string;
  tint: string;
  border: string;
  cardGradient: readonly [string, string];
  shadow: string;
  overlay: string;
  primary: string;
  secondary: string;
  textLight: string;
  danger: string;
  success: string;
};

export const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}>({
  theme: 'light',
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use in your app
export const useAppTheme = () => useContext(ThemeContext);