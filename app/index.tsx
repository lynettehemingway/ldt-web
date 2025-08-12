import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import ColorSwatchRow from "../app/colorswatchrow";
import { Lantern, SideTag } from "../app/decor";
import Header, { HEADER_H } from "../app/header";

const PURPLE = "#6f00ff";
const PAPER = "#f6f1ea";

export default function Home() {
  const screenHeight = Dimensions.get("window").height;

  return (
    <View style={{ flex: 1, backgroundColor: PAPER }}>
      <Header />

      {/* PAGE */}
      <View style={[styles.page, { height: screenHeight - HEADER_H }]}>
        <View style={styles.heroCard}>
          <SideTag />

          {/* LEFT: lions */}
          <View style={styles.leftCol}>
  <View style={styles.circleBg} />
  <Image
    source={require("../assets/images/lions.png")}
    style={styles.lion}
    resizeMode="contain"
  />
</View>


          {/* RIGHT: heading/copy */}
          <View style={styles.rightCol}>
            <View style={styles.lanternWrap}><Lantern /></View>
            <Text style={styles.h1}>
              LION DANCE{"\n"}
              <Text style={styles.h1}>TEAM</Text>{" "}
              <Text style={styles.h1Thin}>| AT UF</Text>
            </Text>
            <Text style={styles.copy}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rhoncus
              in libero ut maximus.
            </Text>
            <View style={styles.carouselHint}>
              <Text style={styles.chev}>◄</Text>
              <Text style={styles.hanzi}>舞獅</Text>
              <Text style={styles.chev}>►</Text>
            </View>
          </View>
        </View>

        <ColorSwatchRow />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroCard: {
    marginTop: 32,
    width: "100%",
    maxWidth: 1100,
    backgroundColor: PAPER,
    borderRadius: 10,
    padding: 16,
    gap: 12,
    flexDirection: "row",
    position: "relative",
  },
  leftCol: { flex: 1.1, minHeight: 340, justifyContent: "center", alignItems: "center" },
  rightCol: { flex: 1, paddingHorizontal: 16, justifyContent: "center", gap: 10 },

  circleBg: {
    position: "absolute",
    width: 320, height: 320, borderRadius: 160, backgroundColor: "#eadfce", left: 40,
  },

  lion: { width: "100%", maxWidth: 600, height: 600 },

  h1: { color: PURPLE, fontSize: 48, lineHeight: 52, fontWeight: "900", letterSpacing: 1 },
  h1Thin: { color: "#161616", fontWeight: "700", fontSize: 32 },
  copy: { color: "#1a1a1a", maxWidth: 360 },
  carouselHint: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  hanzi: { fontWeight: "900", color: "#1a1a1a" },
  chev: { color: "#1a1a1a", marginHorizontal: 2 },

  lanternWrap: { position: "absolute", right: 8, top: -HEADER_H + 2 },
});
