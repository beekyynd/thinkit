import { useSession } from "@/context/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ActivityIndicator, Text, View } from "react-native";
import { Stack, Redirect } from "expo-router";

const AppLayout = () => {

    const {session, isLoading} = useSession();
    const colors = useThemeColors();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
                <ActivityIndicator size="large" color={"#818cf8"} />
                <Text className="mt-4 text-gray-500 dark:text-gray-300">Loading...</Text>
            </View>
        );
    }  
    
    if (!session) {
        return <Redirect href="/sign-in" />;
    }

  return (
    <Stack screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
        animation: 'none',
    }}>

        <Stack.Screen
            name="(tabs)"
            options={{
                headerShown: false,
            }}
        />

        <Stack.Screen
            name="change-password"
            options={{
                headerShown: true,
                title: 'Change Password',
                headerShadowVisible: false,
            }}
        />

    </Stack>
  )
}

export default AppLayout;