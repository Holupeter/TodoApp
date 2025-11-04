// constants/theme.ts

// Figma Colors
const palette = {
  primary: '#3F51B5',
  primaryLight: '#5C6BC0',

  white: '#FFFFFF',
  black: '#121212',

  // Light Mode
  lightBg: '#F4F5F7',
  lightSurface: '#FFFFFF',
  lightText: '#171717',
  lightTextSecondary: '#8A8A8A',

  // Dark Mode
  darkBg: '#121212',
  darkSurface: '#1E1E1E',
  darkText: '#E0E0E0',
  darkTextSecondary: '#757575',
};

export interface Theme {
  background: string;
  surface: string; // For cards, modals
  text: string;
  textSecondary: string;
  primary: string;
  buttonText: string;
  // We add the specific font weights we loaded
  fontRegular: string;
  fontMedium: string;
  fontSemiBold: string;
  fontBold: string;
}

// Define font names
const fonts = {
  fontRegular: 'Inter_400Regular',
  fontMedium: 'Inter_500Medium',
  fontSemiBold: 'Inter_600SemiBold',
  fontBold: 'Inter_700Bold',
};

// Light theme definition
export const lightTheme: Theme = {
  ...fonts,
  background: palette.lightBg,
  surface: palette.lightSurface,
  text: palette.lightText,
  textSecondary: palette.lightTextSecondary,
  primary: palette.primary,
  buttonText: palette.white,
};

// Dark theme definition
export const darkTheme: Theme = {
  ...fonts,
  background: palette.darkBg,
  surface: palette.darkSurface,
  text: palette.darkText,
  textSecondary: palette.darkTextSecondary,
  primary: palette.primaryLight,
  buttonText: palette.white,
};