// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ContactDock from "./contact_dock";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <ContactDock />
      <StatusBar style={Platform.OS === "web" ? "dark" : "light"} />
    </SafeAreaProvider>
  );
}
