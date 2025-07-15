import { useTheme } from '@/context/ThemeContext';

const useToggleTheme = () => {
  const { theme, currentTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    const effectiveTheme = theme === 'system' ? currentTheme : theme;

    const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return toggleTheme;
};

export default useToggleTheme;
