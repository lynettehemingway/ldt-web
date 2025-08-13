import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

// --- Pillars (label, color, description) ---
const PILLARS = [
  {
    label: "Culture",
    hex: "#6f00ff",
    desc:
      "We are dedicated to teaching and promoting the art of lion dancing to the University of Florida, as well as the greater Gainesville community, through traditional and modern lion dance shows.",
  },
  {
    label: "Community",
    hex: "#f6f1ea",
    desc:
      "Our performances, practices, socials, workshops, and events are open to students of all skill-levels and backgrounds. We strive to foster a welcoming community of lion dancers.",
  },
  {
    label: "Growth",
    hex: "#d9cdbb",
    desc:
      "We provide the opportunity for our members to serve on our board as well as choreograph and handle logistics for performances, fostering artistic and individual growth within our team.",
  },
  {
    label: "Philanthropy",
    hex: "#161616",
    desc:
      "We plan to host fundraisers to raise money for Asian organizations and events in Gainesville. Our yearly funds will be used to supply our team with new props, with remaining funds donated to local charities.",
  },
  {
    label: "Performance",
    hex: "#eadfce",
    desc:
      "In the past year, members of our team have performed 25+ lion dance shows for restaurants, schools, businesses, temples, community events, the University of Florida, festivals, and weddings.",
  },
];

// layout constants
const MAX_COLS = 5;
const MIN_CARD_W = 160;
const GUTTER = 14; // more breathing room
const MAX_CONTAINER = 1400;

// scale height based on column count
function getCardMinH(cols: number) {
  switch (cols) {
    case 1: return 380;
    case 2: return 340;
    case 3: return 300;
    default: return 280; // 4–5 cols
  }
}

export default function ColorSwatchRow() {
  const { width } = useWindowDimensions();
  const containerW = Math.min(width, MAX_CONTAINER);

  // Compute how many columns fit: min width + gutter, clamp to 1..5
  const colsFit = Math.floor((containerW + GUTTER) / (MIN_CARD_W + GUTTER));
  const columns = Math.max(1, Math.min(MAX_COLS, colsFit));
  const cardMinH = Math.max(getCardMinH(columns), 320);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <View style={[styles.wrap, { maxWidth: MAX_CONTAINER, paddingHorizontal: GUTTER / 2 }]}>
      {/* Section title */}
      <Text style={styles.sectionTitle} accessibilityRole="header">
        Our Pillars
      </Text>

      <View style={[styles.row, { marginHorizontal: -GUTTER / 2 }]}>
        {PILLARS.map((p, i) => {
          const isActive = activeIdx === i;

          const itemStyle: ViewStyle = {
            width: `${100 / columns}%`,
            paddingHorizontal: GUTTER / 2,
            marginBottom: GUTTER,
          };

          return (
            <Pressable
              key={p.label}
              style={[styles.item, itemStyle]}
              accessibilityRole="button"
              accessibilityLabel={`${p.label} pillar`}
              onPress={() => setActiveIdx((prev) => (prev === i ? null : i))}
              onHoverIn={Platform.OS === "web" ? () => setActiveIdx(i) : undefined}
              onHoverOut={
                Platform.OS === "web" ? () => setActiveIdx((prev) => (prev === i ? null : prev)) : undefined
              }
              onFocus={() => setActiveIdx(i)}
              onBlur={() => setActiveIdx((prev) => (prev === i ? null : prev))}
            >
              <View style={[styles.card, { backgroundColor: p.hex, minHeight: cardMinH }]}>
                {!isActive ? (
                  <View style={styles.centerWrap} pointerEvents="none">
                    <Text style={[styles.name, getReadableTextStyle(p.hex)]} numberOfLines={1}>
                      {p.label}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.descWrap} pointerEvents="none">
                    <Text style={[styles.desc, getReadableTextStyle(p.hex)]}>
                      {p.desc}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Simple luminance check to pick dark/light text for contrast */
function getReadableTextStyle(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const darkBg = lum < 140; // heuristic threshold
  return darkBg ? styles.textOnDark : styles.textOnLight;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignSelf: "center",
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.4,
    color: "#161616",
    textAlign: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    // width & spacing applied inline
  },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
    paddingVertical: 18,  // more vertical space
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  centerWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  descWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "900",
    letterSpacing: 0.4,
    textAlign: "center",
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    textAlign: "center",
    flexShrink: 1,
  },
  textOnDark: { color: "#ffffff" },
  textOnLight: { color: "#161616" },
});
