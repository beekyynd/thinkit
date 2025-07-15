import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '@/context/AuthContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import axiosInstance from '@/config/axiosConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';

interface HistoryItem {
  id: number;
  generated_number: string;
  credits_used: number;
  created_at: string;
}


export default function History() {
  const { session } = useSession();
  const colors = useThemeColors();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/user/history', {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <ScrollView className="p-4">
        <Text className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>
          History
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={"#818CF8"} />
        ) : history.length === 0 ? (
          <Text className={`${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} italic`}>
            No history available.
          </Text>
        ) : (
          history.map((item) => (
            <View
              key={item.id}
              className={`mb-4 p-4 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl shadow`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className={`text-lg font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Purchase of +{item.generated_number}
                </Text>
                <Text className="text-red-500 text-base font-semibold">
                  –{item.credits_used.toFixed(1)} Credits
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons
                  name="access-time"
                  size={16}
                  color={'#818CF8'}
                  style={{ marginRight: 4 }}
                />
                <Text className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
