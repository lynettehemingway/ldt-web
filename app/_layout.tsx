// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ContactDock from "./contact_dock";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
      <Stack
        screenOptions={{
          headerShown: false,                 // we use our own header per screen
          contentStyle: { backgroundColor: "#f7f4f1ff" },
        }}
      />
      {/* floating chat / contact button that sits above all screens */}
      <ContactDock />
    </SafeAreaProvider>
  );
}
