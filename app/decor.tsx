import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export function SideTag() {
  return (
    <View style={styles.sideTag}>
      <Text style={styles.arrow}>◄</Text>
      <Text style={styles.sideText}>múa lân</Text>
      <Text style={styles.arrow}>►</Text>
    </View>
  );
}

/** Lantern image (right side of hero) */
export function Lantern() {
  return (
    <Image
      source={require("../assets/images/lantern.png")}
      style={styles.lanternImg}
      resizeMode="contain"
      accessible
      accessibilityLabel="Lantern"
    />
  );
}

/** Small star/spark accent */
export function Star() {
  return (
    <Image
      source={require("../assets/images/star.png")}
      style={styles.starImg}
      resizeMode="contain"
      accessible
      accessibilityLabel="Decorative star"
    />
  );
}

const styles = StyleSheet.create({
  sideTag: {
    position: "absolute",
    left: -56,
    top: "40%",
    transform: [{ rotate: "-90deg" }],
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sideText: { fontWeight: "800", fontSize: 14, color: "#000", letterSpacing: 1 },
  arrow: { fontSize: 14, color: "#000" },

  // sorry alice i have no idea how to put the icons in yet
  lanternImg: { width: 40, height: 64 }, 
  starImg: { width: 24, height: 24 },
});
