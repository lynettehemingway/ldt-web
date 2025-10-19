import React, { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

const PURPLE = "#6f00ff";
const PAPER = "#f6f1ea";

// label + description (color forced to purple)
const PILLARS = [
  {
    label: "Culture",
    desc:
      "We teach and promote the art of lion dancing at UF and in the Gainesville community through traditional and modern shows.",
  },
  {
    label: "Community",
    desc:
      "Open practices, socials, workshops, and events — welcoming students of all skill levels and backgrounds.",
  },
  {
    label: "Growth",
    desc:
      "Opportunities to choreograph, join board, and handle logistics — fostering artistic and individual growth.",
  },
  {
    label: "Philanthropy",
    desc:
      "Fundraisers for Asian orgs & events; yearly funds support props with remaining donations to local charities.",
  },
  {
    label: "Performance",
    desc:
      "25+ shows last year across UF and Gainesville — restaurants, schools, temples, festivals, and weddings.",
  },
];

// layout constants
const MAX_COLS = 5;
const MIN_CARD_W = 170;
const GUTTER = 14;
const MAX_CONTAINER = 1100;

function getCardMinH(cols: number) {
  switch (cols) {
    case 1: return 360;
    case 2: return 320;
    case 3: return 300;
    default: return 260; // 4–5 cols
  }
}

export default function ColorSwatchRow() {
  const { width } = useWindowDimensions();
  const containerW = Math.min(width, MAX_CONTAINER);

  const colsFit = Math.floor((containerW + GUTTER) / (MIN_CARD_W + GUTTER));
  const columns = Math.max(1, Math.min(MAX_COLS, colsFit));
  const cardMinH = getCardMinH(columns);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <View style={[styles.wrap, { maxWidth: MAX_CONTAINER, paddingHorizontal: GUTTER / 2 }]}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        Our Pillars
      </Text>

      <View style={[styles.row, { marginHorizontal: -GUTTER / 2 }]}>
        {PILLARS.map((p, i) => {
          const itemStyle: ViewStyle = {
            width: `${100 / columns}%`,
            paddingHorizontal: GUTTER / 2,
            marginBottom: GUTTER,
          };

          return (
            <Pressable
              key={p.label}
              accessibilityRole="button"
              accessibilityLabel={`${p.label} pillar`}
              onPress={() => setActiveIdx((prev) => (prev === i ? null : i))}
              onHoverIn={Platform.OS === "web" ? () => setActiveIdx(i) : undefined}
              onHoverOut={Platform.OS === "web" ? () => setActiveIdx((prev) => (prev === i ? null : prev)) : undefined}
              onFocus={() => setActiveIdx(i)}
              onBlur={() => setActiveIdx((prev) => (prev === i ? null : prev))}
              style={({ pressed }) => [
                styles.item,
                itemStyle,
                { transform: [{ translateY: pressed ? 1 : 0 }] },
              ]}
            >
              <PillarCard label={p.label} desc={p.desc} isActive={activeIdx === i} minH={cardMinH} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const PillarCard = memo(function PillarCard({
  label,
  desc,
  isActive,
  minH,
}: {
  label: string;
  desc: string;
  isActive: boolean;
  minH: number;
}) {
  // fade/slide and slight scale on hover/tap
  const labelOp = useRef(new Animated.Value(1)).current;
  const labelTY = useRef(new Animated.Value(0)).current;
  const descOp = useRef(new Animated.Value(Platform.OS === "web" ? 0 : 1)).current;
  const descTY = useRef(new Animated.Value(6)).current;
  const scale  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);
    Animated.parallel([
      Animated.timing(labelOp, { toValue: isActive ? 0 : 1, duration: 220, easing: ease, useNativeDriver: true }),
      Animated.timing(labelTY, { toValue: isActive ? -6 : 0, duration: 220, easing: ease, useNativeDriver: true }),
      Animated.timing(descOp,  { toValue: isActive ? 1 : 0, duration: 220, easing: ease, useNativeDriver: true }),
      Animated.timing(descTY,  { toValue: isActive ? 0 : 6, duration: 220, easing: ease, useNativeDriver: true }),
      Animated.timing(scale,   { toValue: isActive ? 1.02 : 1, duration: 200, easing: ease, useNativeDriver: true }),
    ]).start();
  }, [isActive, labelOp, labelTY, descOp, descTY, scale]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          minHeight: minH,
          backgroundColor: PURPLE,
          transform: [{ scale }],
        },
      ]}
    >
      {/* decorative shine */}
      <View style={styles.glow} pointerEvents="none" />

      {/* default state: label */}
      <Animated.View
        pointerEvents="none"
        style={[styles.centerWrap, { opacity: labelOp, transform: [{ translateY: labelTY }] }]}
      >
        <Text style={styles.name} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>

      {/* active state: description */}
      <Animated.View
        pointerEvents="none"
        style={[styles.descWrap, { opacity: descOp, transform: [{ translateY: descTY }] }]}
      >
        <Text style={styles.desc}>{desc}</Text>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignSelf: "center",
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.4,
    color: "#161616",
    textAlign: "center",
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {},
  card: {
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 18,
    paddingHorizontal: 16,
    justifyContent: "center",
    // soft elevation
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    position: "relative",
  },
  glow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  centerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
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
    color: "#fff",
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "900",
    letterSpacing: 0.4,
    textAlign: "center",
    textTransform: "uppercase",
  },
  desc: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    textAlign: "center",
    flexShrink: 1,
  },
});
