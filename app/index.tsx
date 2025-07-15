import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useSession } from '@/context/AuthContext';

export default function WelcomeScreen() {
  const { currentTheme } = useTheme();
  const { session, isLoading } = useSession();

  if (!isLoading && session) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  // Show welcome screen if not logged in
  return (
    <View className={`flex-1 justify-center items-center p-4 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>

      {/* Image container */}
      <View className="w-full max-w-[100%] h-80 overflow-hidden mb-8">
        <ImageBackground
          source={require('@/assets/images/mobile.png')}
          className="w-full h-full"
          imageStyle={{ borderRadius: 16 }}
          resizeMode="cover"
        />
      </View>

      {/* Header Text */}
      <View className="w-full max-w-sm mb-6">
        <Text className="text-4xl font-extrabold text-white">
          Get Virtual Numbers, {'\n'}From +160 Countries {'\n'} for <Text className="text-indigo-400">SMS Verification</Text>
        </Text>
        <Text className="text-slate-400 mt-3 text-base text-center">
          Get your verification codes from Whatsapp, Telegram and more, without revealing your real number.
        </Text>
      </View>

      {/* Buttons */}
      <View className="w-full max-w-sm">
        <TouchableOpacity
          className="h-[54px] rounded-xl border-[1.5px] justify-center items-center mb-4"
          style={{ borderColor: "#818CF8" }}
          onPress={() => router.push('/sign-in')}
        >
          <Text className="text-base font-semibold" style={{ color: "#818CF8" }}>
            Log In
          </Text>
        </TouchableOpacity>

        <LinearGradient
          colors={['#4F46E5', '#7B2CBF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 54,
            borderRadius: 12,
            marginBottom: 8,
          }}
        >
          <TouchableOpacity
            className="h-full justify-center items-center"
            onPress={() => router.push('/sign-up')}
          >
            <Text className="text-base font-semibold text-white">
              Create Account
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}
