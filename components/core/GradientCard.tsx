import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../hooks/useThemeColors';

interface GradientCardProps {
    children: ReactNode;
    title?: string;
    style?: ViewStyle;
    badgeText?: string;
    badgeVisible?: boolean;
    gradientColors?: readonly [string, string, ...string[]];
    onPress?: () => void;
    disabled?: boolean;
    shadowColor?: string;
}

const GradientCard: React.FC<GradientCardProps> = ({
    children,
    title,
    style,
    badgeText = 'Popular',
    badgeVisible = false,
    gradientColors = ['#4c669f', '#3b5998', '#192f6a'],
    onPress,
    disabled = false,
    shadowColor = '#000',
}) => {
    const colors = useThemeColors();

    const defaultColors: readonly [string, string, ...string[]] = [colors.card, colors.surface];

    const cardGradient = gradientColors || defaultColors;

    const cardShadowColor = shadowColor || colors.primary;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[styles.container, 
                { 
                shadowColor: cardShadowColor, opacity: disabled ? 0.7 : 1 
            }, 
                style,
            ]}
        >
            <LinearGradient
                colors={cardGradient}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className='p-6 bg-gray-200 dark:bg-gray-800'
            >
                {badgeVisible && (
                    <View className='absolute top-0 right-0 px-3 py-1 rounded-bl-2xl'
                        style={{ backgroundColor: colors.primary, zIndex: 1 }}>
                        <Text className='text-white text-sm font-semibold'>{badgeText}</Text>
                    </View>
                )}
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );

};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    gradient: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    
});

export default GradientCard;