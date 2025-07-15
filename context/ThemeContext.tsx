import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { useStorageState } from '../hooks/useStorageState';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  currentTheme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() as 'light' | 'dark';
  const [[, storedTheme], setStoredTheme] = useStorageState('theme');
  const [theme, setThemeState] = useState<ThemeType>('system');

  // Load stored theme on mount
  useEffect(() => {
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      setThemeState(storedTheme);
    }
  }, [storedTheme]);

  // Memoize currentTheme so it's always up to date
  const currentTheme: 'light' | 'dark' = useMemo(() => {
    if (theme === 'system') return systemColorScheme || 'dark';
    return theme;
  }, [theme, systemColorScheme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
  };

  const toggleTheme = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
