// File: app/(tabs)/index.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '@/context/AuthContext';
import { websiteDomains } from '@/constants/data';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import axiosInstance from '@/config/axiosConfig';
import { useThemeClasses } from '@/hooks/useThemeClasses';
import { useTheme } from '@/context/ThemeContext';

const countryFlags: Record<string, string> = {
  Nigeria: 'https://flagcdn.com/w40/ng.png',
  USA: 'https://flagcdn.com/w40/us.png',
};

export default function TabsIndex() {
  const { user, updateUser } = useSession();
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('Nigeria');
  const [websites, setWebsites] = useState<{ webID: number; website: string; price: number }[]>([]);
  const [selectedWebID, setSelectedWebID] = useState<number | null>(null);
  const [generatedNumber, setGeneratedNumber] = useState<string | null>(null);
  const [isLoadingWebsites, setIsLoadingWebsites] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const theme = useThemeClasses();
  const { currentTheme } = useTheme();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axiosInstance.get('/api/countries');
        setCountries(response.data.countries);

        if (response.data.countries.includes('Nigeria')) {
          await fetchWebsitesByCountry('Nigeria');
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const fetchWebsitesByCountry = async (country: string) => {
    setIsLoadingWebsites(true);
    try {
      const response = await axiosInstance.get('/api/countries/get', {
        params: { country },
      });
      setWebsites(response.data);
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setIsLoadingWebsites(false);
    }
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setSelectedWebID(null);
    setWebsites([]);
    setGeneratedNumber(null);
    fetchWebsitesByCountry(country);
  };

  const handleGenerateNumber = async () => {
    if (!selectedCountry || !selectedWebID) return;

    Alert.alert('Confirm', `Generate a number for ${selectedCountry}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const response = await axiosInstance.get('/api/countries/generate', {
              params: {
                country: selectedCountry,
                webid: selectedWebID,
              },
            });

            const newCredits = Math.round(parseFloat(response.data.user_balance) * 10) / 10;

            if (
              typeof user?.credits === 'number' &&
              Math.abs(user.credits - newCredits) >= 0.1
            ) {
              updateUser((prev) => ({
                ...prev,
                credits: newCredits,
              }));
            }

            setGeneratedNumber(response.data.number);
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to generate number');
          }
        },
      },
    ]);
  };

  const resetAll = () => {
    setSelectedCountry('Nigeria');
    setSelectedWebID(null);
    setGeneratedNumber(null);
    fetchWebsitesByCountry('Nigeria');
  };

  if (pageLoading) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${theme.bg}`}>
        <ActivityIndicator size="large" color="#818CF8" />
        <Text className={`mt-4 ${theme.textMuted}`}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${theme.bg}`}>
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className={`text-2xl font-bold ${theme.textPrimary} mb-4`}>
            Welcome, {user?.name || 'User'}!
          </Text>

          <TouchableOpacity onPress={() => router.push('/(tabs)/history' as any)} className="flex-row items-center mb-4">
            <MaterialIcons name="account-balance-wallet" size={24} color={'#818CF8'} style={{ marginRight: 8 }} />
            <Text className={theme.textMuted}>
              {(user?.credits ?? 0).toFixed(1)} {(user?.credits ?? 0) === 1 ? 'Credit' : 'Credits'}
            </Text>
          </TouchableOpacity>

          {!generatedNumber && (
            <>
              <Text className={`text-lg font-semibold mb-2 ${theme.textPrimary}`}>Select Country</Text>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country}
                  onPress={() => handleCountrySelect(country)}
                  className={`flex-row items-center py-4 border-b ${theme.border}`}
                >
                  <Image
                    source={{ uri: countryFlags[country] }}
                    style={{ width: 32, height: 24, marginRight: 12, borderRadius: 2 }}
                  />
                  <View className="flex-1">
                    <Text className={`text-lg ${theme.textPrimary}`}>{country}</Text>
                  </View>
                  <View
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedCountry === country ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'
                    }`}
                  />
                </TouchableOpacity>
              ))}

              {selectedCountry !== '' && (
                <>
                  <Text className={`text-lg font-semibold mt-6 mb-2 ${theme.textPrimary}`}>Select Website</Text>
                  {isLoadingWebsites && (
                    <View className="my-4 items-center justify-center">
                      <ActivityIndicator size="small" color="#818CF8" />
                    </View>
                  )}

                  {websites.map((site) => (
                    <TouchableOpacity
                      key={site.webID}
                      onPress={() => setSelectedWebID(site.webID)}
                      className={`flex-row items-center justify-between py-4 border-b ${theme.border}`}
                    >
                      <View className="flex-row items-center flex-1">
                        <Image
                          source={{ uri: `https://icon.horse/icon/${websiteDomains[site.website] || 'null'}` }}
                          style={{ width: 28, height: 28, borderRadius: 5 }}
                        />
                        <Text className={`ml-4 text-base ${theme.textPrimary}`}>{site.website}</Text>
                      </View>

                      <View className="flex-row items-center">
                        <View className="px-3 py-1 rounded-full bg-indigo-500 mr-3">
                          <Text className="text-white text-sm font-semibold">
                            {site.price.toFixed(1)} credits
                          </Text>
                        </View>

                        <View
                          className={`w-6 h-6 rounded-full border-2 ${
                            selectedWebID === site.webID ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'
                          }`}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {selectedWebID && (
                <TouchableOpacity onPress={handleGenerateNumber} className="bg-indigo-600 mt-6 px-4 py-3 rounded">
                  <Text className="text-white text-center font-semibold">Generate Number</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {generatedNumber && (
            <>
              <View className={`mt-6 p-6 rounded-xl border border-indigo-500 ${theme.box}`}>
                <Text className={`text-center italic text-xl font-semibold ${theme.textPrimary}`}>Your Number:</Text>
                <Text className="text-center italic text-2xl mt-2 text-indigo-600 dark:text-indigo-400">
                  {generatedNumber}
                </Text>
              </View>

              <TouchableOpacity onPress={resetAll} className={`mt-6 px-4 py-3 rounded ${theme.altBox}`}>
                <Text className={`text-center font-semibold ${theme.textPrimary}`}>Get New Number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
