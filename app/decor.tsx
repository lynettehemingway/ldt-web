// import React from "react";
// import {
//     Image,
//     ImageStyle,
//     StyleProp,
//     StyleSheet,
//     Text,
//     View,
//     ViewStyle,
// } from "react-native";

// export function SideTag({ style }: { style?: StyleProp<ViewStyle> }) {
//   return (
//     <View style={[styles.sideTag, style]} pointerEvents="none">
//       <Text style={styles.arrow}>◄</Text>
//       <Text style={styles.sideText}>múa lân</Text>
//       <Text style={styles.arrow}>►</Text>
//     </View>
//   );
// }

// /** Lantern image (right side of hero) */
// export function Lantern({ style }: { style?: StyleProp<ImageStyle> }) {
//   return (
//     <Image
//       source={require("../assets/images/lantern.png")}
//       style={[styles.lanternImg, style]}
//       resizeMode="contain"
//       accessible
//       accessibilityLabel="Lantern"
//     />
//   );
// }

// /** Small star/spark accent */
// export function Star({ style }: { style?: StyleProp<ImageStyle> }) {
//   return (
//     <Image
//       source={require("../assets/images/star.png")}
//       style={[styles.starImg, style]}
//       resizeMode="contain"
//       accessible
//       accessibilityLabel="Decorative star"
//     />
//   );
// }

// const styles = StyleSheet.create({
//   sideTag: {
//     position: "absolute",
//     left: -56,
//     top: "40%",
//     transform: [{ rotate: "-90deg" }],
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     zIndex: 3,
//   },
//   sideText: { fontWeight: "800", fontSize: 14, color: "#000", letterSpacing: 1 },
//   arrow: { fontSize: 14, color: "#000" },

//   lanternImg: { width: 40, height: 64 },
//   starImg: { width: 24, height: 24 },
// });
