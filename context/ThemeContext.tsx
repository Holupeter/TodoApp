// context/ThemeContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components/native';
import { lightTheme, darkTheme, Theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentTheme: Theme;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  currentTheme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const deviceTheme = Appearance.getColorScheme() || 'light';
  const [theme, setTheme] = useState<'light' | 'dark'>(deviceTheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem('theme')) as
          | 'light'
          | 'dark'
          | null;
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (e) {
        console.error('Failed to load theme from storage', e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme to storage', e);
    }
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      <StyledProvider theme={currentTheme}>{children}</StyledProvider>
    </ThemeContext.Provider>
  );
};