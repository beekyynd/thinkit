import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  SafeAreaView,
} from 'react-native';
import { useSession } from '@/context/AuthContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import useToggleTheme from '@/hooks/useToggleTheme';

export default function Profile() {
  const { user, signOut } = useSession();
  const colors = useThemeColors();
  const { currentTheme } = useTheme();
  const toggleTheme = useToggleTheme();

  const [isDark, setIsDark] = useState(currentTheme === 'dark');

  useEffect(() => {
    setIsDark(currentTheme === 'dark');
  }, [currentTheme]);

  const handleToggle = () => {
    setIsDark(prev => !prev);
    toggleTheme();
  };

  const confirmLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? '#111827' : '#ffffff',
      }}
    >
      <ScrollView
    contentContainerStyle={{
      paddingHorizontal: 16,
      paddingTop: 45,
      paddingBottom: 16,
    }}
  >
    {/* Profile Info */}
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: isDark ? '#ffffff' : '#1f2937',
          marginBottom: 4,
        }}
      >
        {user?.name || 'User'}
      </Text>
      <Text style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
        {user?.email || 'No email'}
      </Text>
    </View>


        {/* Change Password */}
        <TouchableOpacity
          onPress={() => router.push('/change-password' as any)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: isDark ? '#374151' : '#e5e7eb',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons
              name="lock-outline"
              size={22}
              color="#818CF8"
              style={{ marginRight: 12 }}
            />
            <Text
              style={{
                fontSize: 16,
                color: isDark ? '#f3f4f6' : '#1f2937',
              }}
            >
              Change Password
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Theme Toggle */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: isDark ? '#374151' : '#e5e7eb',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons
              name="dark-mode"
              size={22}
              color="#818CF8"
              style={{ marginRight: 12 }}
            />
            <Text
              style={{
                fontSize: 16,
                color: isDark ? '#f3f4f6' : '#1f2937',
              }}
            >
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleToggle}
            thumbColor={isDark ? '#ffffff' : '#cccccc'}
            trackColor={{ false: '#cccccc', true: '#818CF8' }}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={confirmLogout}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: isDark ? '#374151' : '#e5e7eb',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons
              name="logout"
              size={22}
              color="#818CF8"
              style={{ marginRight: 12 }}
            />
            <Text
              style={{
                fontSize: 16,
                color: isDark ? '#f3f4f6' : '#1f2937',
              }}
            >
              Logout
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.text} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
