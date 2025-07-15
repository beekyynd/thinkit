import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
    title?: string;
    className?: string;
    loading?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    title,
    className,
    loading = false,
    disabled = false,
    onPress,
    variant = 'primary',
    children,
}) => {
    const getVariantStyles = () => {

    const disabledGradient = ['#9CA3AF', '#6B7280'];

    // Define the gradient colors and text colors for each variant
    const variants = {
        primary: ['#192f5d', '#195f2d'],
        secondary: ['#6a11cb', '#2575fc'],
        danger: ['#ff416c', '#ff4b2b'],
        ghost: ['#ffffff', '#ffffff'],
    };
    // Define the text colors for each variant
    const textColors = {
        ghost: 'text-gray-800',
        primary: 'text-white',
        secondary: 'text-white',
        danger: 'text-white',
        // Default text color for other variants
        default: 'text-white',
    };
    return {
        gradient: disabled ? disabledGradient : variants[variant] ?? variants.primary,
        textColor: textColors[variant] ?? textColors.default,
    };
};


    const { gradient, textColor } = getVariantStyles();

    return (
        <TouchableOpacity
            className={`overflow-hidden rounded-2xl ${disabled ? 'opacity-50' : ''} ${className}`}
            style={{ elevation: 3 }}
            onPress={onPress}
            disabled={disabled || loading}
        >
            <LinearGradient
                colors={(disabled ? ['#9CA3AF','#6B7280']: gradient) as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-4 py-3.5"
            >
                <View className="flex-row items-center justify-center">

                {loading && (
                    <ActivityIndicator color="#fff" size="small" className='mr-2'/>
                )}

                {children ? (

                    children
                ) : (
                    <Text className={`text-base font-semibold ${textColor}`}>
                        {title}
                    </Text>
                )
            
            }
                
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default Button;