import { TextInput } from 'react-native';
import React, { useState } from 'react';

import { View, Text, TextInputProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface InputProps extends TextInputProps {

    error?: string;

}

const Input = ({

    value,
    onChangeText,
    error = '',
    placeholder,
    secureTextEntry,
    keyboardType,
}: InputProps) => {

    const [isFocused, setIsFocused] = useState(false);
    const { currentTheme } = useTheme();

    return (

        <View className="w-full mb-4">
            <TextInput
                className={`w-full h-12 p-3 mb-1 rounded-lg border 
                    ${currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                    
                    ${isFocused ? 'border-primary' : currentTheme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    ${error ? 'border-red-500' : ''}`}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={currentTheme === 'dark' ? 'gray' : '#CBD5E0'}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}

                />

                {!!error && (
                    <Text className="text-red-500 text-left justify-start mt-1">
                        {error} 
                    </Text>
                )}
                    </View>

    );

};

export default Input;


