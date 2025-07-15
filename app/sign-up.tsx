import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/core/Button';
import Input from '@/components/core/Input';
import { useTheme } from '@/context/ThemeContext';
import { Link } from 'expo-router';
import axiosInstance from '@/config/axiosConfig';
import axios from 'axios';

const Signup = () => {
  
  const { currentTheme } = useTheme();
  const [data, setData] = useState({

    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const [loading, setLoading] = useState(false);

const [successMessage, setSuccessMessage] = useState('');

const handleChange = (key: string, value: string) => {

  setData({ ...data, [key]: value });

};

const handleSignup = async () => {

  setLoading(true);
  setErrors({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  try {
    await axiosInstance.post('/api/register', data);
    resetForm();
    setSuccessMessage('Registration successful! You can now Login.');

  } catch (error) {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.errors) {
          setErrors(responseData.errors);
        }
        else if (responseData?.message) {
          Alert.alert('Error', responseData.message);
        }
    else {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  } 

  else {
    console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  }
  finally {
    setLoading(false);
  }
};

const resetForm = () => {

setData({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});
setErrors({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});
}

return (

  <View className={`flex-1 items-center justify-center p-4 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>

    <View className="items-center mb-4">
      <Text className={`text-[20px] mt-4 font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Create an Account
      </Text>
    </View>

    {!!successMessage &&
      <Text className="text-emerald-600 mb-4">
        {successMessage}
      </Text>}

      <Input
        value={data.name}
        onChangeText={(value) => handleChange('name', value)}
        placeholder="Name"
        error={errors.name}
        />

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

    <Input
      value={data.password_confirmation}
      onChangeText={(value) => handleChange('password_confirmation', value)}
      placeholder="Confirm Password"
      secureTextEntry
      error={errors.password_confirmation}
    />

    <Button
    className='w-full mt-4'
    onPress={handleSignup}
    disabled={loading}
    variant="secondary"
    loading={loading}
    >

      <View className="flex-row items-center justify-center">
      
        <Text className="text-base font-semibold text-white text-center">
          Sign Up
        </Text>
      </View>
    </Button>

    <Text className={`mt-4 text-md ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
      Already have an account?{' '}
      <Link href="/sign-in" className={`font-semibold ${currentTheme === 'dark' ? 'text-blue-500' : 'text-blue-700 font-semibold'}`}>
        Sign In
      </Link>
    </Text>

      </View>

);

}

export default Signup;