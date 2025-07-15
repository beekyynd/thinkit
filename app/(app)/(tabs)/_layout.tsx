import { Tabs } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useTheme } from "@/context/ThemeContext"; // 👈 make sure this is imported

export default function TabsLayout() {
  const colors = useThemeColors();
  const { currentTheme } = useTheme(); // 👈 get currentTheme from context

  return (
    <Tabs
      key={currentTheme} // 🔥 this forces re-render on theme switch
      screenOptions={{
        tabBarActiveTintColor: '#818CF8',
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <AntDesign name="profile" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
