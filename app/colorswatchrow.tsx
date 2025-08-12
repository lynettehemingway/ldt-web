import React from "react";
import { StyleSheet, View } from "react-native";

export default function ColorSwatchRow() {
  const colors = ["#6f00ff", "#cdc2b3", "#ffffff", "#8f8378", "#000000"];
  return (
    <View style={styles.row}>
      {colors.map((c) => (
        <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 28,
    flexDirection: "row",
    gap: 22,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1100,
    paddingHorizontal: 16,
  },
  swatch: {
    flex: 1,
    height: 120,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e8e2d9",
  },
});
