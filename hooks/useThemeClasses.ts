import { useTheme } from '@/context/ThemeContext';

export function useThemeClasses() {
  const { currentTheme } = useTheme();

  const isDark = currentTheme === 'dark';

  return {
    bg: isDark ? 'bg-gray-900' : 'bg-white',
    textPrimary: isDark ? 'text-white' : 'text-gray-800',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-500',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    border: isDark ? 'border-gray-800' : 'border-gray-200',
    box: isDark ? 'bg-gray-800' : 'bg-gray-100',
    altBox: isDark ? 'bg-indigo-500' : 'bg-gray-200',
    borderColor: isDark ? '#374151' : '#e5e7eb',
    isDark,
  };
}
