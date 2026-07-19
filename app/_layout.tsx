// app/_layout.tsx
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ContactDock from "./contact_dock";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Head>
        <title>UF Lion Dance Team</title>
        <meta
          name="description"
          content="University of Florida Lion Dance Team official website with performance info, board profiles, media, merch, and contact details."
        />
        <meta property="og:title" content="UF Lion Dance Team" />
        <meta
          property="og:description"
          content="University of Florida Lion Dance Team official website with performance info, board profiles, media, merch, and contact details."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UF Lion Dance Team" />
        <meta
          name="twitter:description"
          content="University of Florida Lion Dance Team official website with performance info, board profiles, media, merch, and contact details."
        />
      </Head>
      <Stack screenOptions={{ headerShown: false }} />
      <ContactDock />
      <StatusBar style={Platform.OS === "web" ? "dark" : "light"} />
    </SafeAreaProvider>
  );
}
