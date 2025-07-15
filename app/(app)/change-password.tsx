import { View, Text, Alert} from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/core/Button';
import Input from '@/components/core/Input';
import { useTheme } from '@/context/ThemeContext';
import axiosInstance from '@/config/axiosConfig';
import axios from 'axios';

const ChangePassword = () => {

  const { currentTheme } = useTheme();

  const [data, setData] = useState({
    password: '',
  });

  const [errors, setErrors] = useState({
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (key: string, value: string) => {
    setData({ ...data, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    setErrors({
      password: '',
    });
    

    const resetForm = () => {

     setData({
       password: '',
    });
     setErrors({
       password: '',
    });
   }

    try {
      await axiosInstance.post('/api/user/update', data);
      resetForm();
      setSuccessMessage('Password changed successfully!');
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
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }

  else {
    console.error('Error:', error);
        Alert.alert('Error', 'Unable to connect to the server.');
      }
    }
    
    finally {
      setLoading(false);
    }
  };

  return (

    <View className={`flex-1 p-4 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      
      <Text className={`text-[20px] mb-4 font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Enter New Password
      </Text>

      {successMessage ? (
        <Text className="text-green-500 mb-4">{successMessage}</Text>
      ) : null}
      
      <Input
        value={data.password}
        onChangeText={(value) => handleChange('password', value)}
        placeholder="Password"
        secureTextEntry
        error={errors.password}
      />
      <Button
    className='w-full mt-4'
    onPress={handlePasswordChange}
    disabled={loading}
    variant="secondary"
    loading={loading}
    >

      <View className="flex-row items-center justify-center">
      
        <Text className="text-base font-semibold text-white text-center">
          Update
        </Text>
      </View>
    </Button>

    </View>
  )
}

export default ChangePassword;