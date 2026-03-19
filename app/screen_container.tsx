// app/screen_container.tsx
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./header";
import { useBP } from "./responsive";

const PAPER = "#f7f4f1ff";

export default function ScreenContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width, isPhone, topPad } = useBP();

  const CONTENT_W = Math.min(980, width - (isPhone ? 20 : 32));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PAPER }}>
      <Header />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: topPad,
          paddingHorizontal: isPhone ? 10 : 16,
          paddingBottom: isPhone ? 80 : 40, // room for the floating button
        }}
      >
        <View style={{ width: "100%", maxWidth: CONTENT_W }}>{children}</View>
      </View>
    </SafeAreaView>
  );
}
