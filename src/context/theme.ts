import { createContext } from 'react';

export interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);
