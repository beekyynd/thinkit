import { Slot } from "expo-router";
import "../global.css";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AppContainer />
      </ThemeProvider>
    </SessionProvider>
  );
}

function AppContainer() {
  const { currentTheme } = useTheme();

  return (
    <>
      <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
      <Slot />
    </>
  );
}
