import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/core/Button';
import Input from '@/components/core/Input';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from '@/context/AuthContext';
import { Link, router } from 'expo-router';
import axiosInstance from '@/config/axiosConfig';
import axios from 'axios';

const Login = () => {

  const { signIn } = useSession();
  const { currentTheme } = useTheme();
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setData({ ...data, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  const handleLogin = async () => {
  setLoading(true);
  setErrors({
    email: '',
    password: '',
  });

  try {
    const response = await axiosInstance.post('/api/login', data);
    await signIn(response.data.token, response.data.user);
    // Delay redirect slightly to ensure the router is ready
setTimeout(() => {
  router.replace('/(app)/(tabs)');
}, 50);
  
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      if (responseData?.errors) {
        setErrors(responseData.errors);
      } else if (responseData?.message) {
        Alert.alert('Error', responseData.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } else {
      console.error('Error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  } finally {
    setLoading(false);
  }
};

  return (

    <View className={`flex-1 justify-center items-center p-4 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      
      <Text className={`text-[20px] mb-4 font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Sign in to your Account
      </Text>

      <Input
        value={data.email}
        onChangeText={(value) => handleChange('email', value)}
        placeholder="Email"
        keyboardType="email-address"
        error={errors.email}
      />
      <Input
        value={data.password}
        onChangeText={(value) => handleChange('password', value)}
        placeholder="Password"
        secureTextEntry
        error={errors.password}
      />
      <Button
    className='w-full mt-4'
    onPress={handleLogin}
    disabled={loading}
    variant="secondary"
    loading={loading}
    >

      <View className="flex-row items-center justify-center">
      
        <Text className="text-base font-semibold text-white text-center">
          Login
        </Text>
      </View>
    </Button>

     <Text className={`mt-4 text-md ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
      Don't have an account?{' '}
      <Link
  href="/sign-up"
  className={`font-semibold ${
    currentTheme === 'dark' ? 'text-blue-500' : 'text-blue-700'
  }`}
>
  Sign Up
</Link>

    </Text>

    </View>
  )
}

export default Login;