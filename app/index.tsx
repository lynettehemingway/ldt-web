import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import ColorSwatchRow from "../app/colorswatchrow";
import { SideTag, Star } from "../app/decor";
import Header, { HEADER_H } from "../app/header";

const PURPLE = "#6f00ff";
const PAPER = "#f6f1ea";
const HERO_MARGIN_TOP = 12;
const BREAKPOINT = 900;      // desktop breakpoint
const TABLET_BP  = 600;      // tablet-ish

// ---------- Utils ----------
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(n, hi));
}

/** scale a preferred size by window width, with min/max clamps */
function rsize(winW: number, pref: number, min: number, max: number, base = 1200) {
  return clamp(pref * (winW / base), min, max);
}

// ---------- SVG chevrons (click/tap to scroll) ----------
const AnimatedPath = Animated.createAnimatedComponent(Path);
function ChevronsCue({
  color = PURPLE,
  visible = true,
  onPress,
  inline = false,                  // inline: positions via containerStyle instead of bottom pin
  bottom = 8,                      // only used if inline=false
  size = 60,                       // overall height of SVG; width derived
  containerStyle,
}: {
  color?: string;
  visible?: boolean;
  onPress?: () => void;
  inline?: boolean;
  bottom?: number;
  size?: number;
  containerStyle?: any;
}) {
  if (!visible) return null;

  const op1 = useRef(new Animated.Value(0.25)).current;
  const op2 = useRef(new Animated.Value(0.25)).current;
  const op3 = useRef(new Animated.Value(0.25)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, { toValue: 1, duration: 320, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.25, duration: 420, useNativeDriver: true }),
        ])
      ).start();

    pulse(op1, 0);
    pulse(op2, 160);
    pulse(op3, 320);

    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -5, duration: 650, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0,  duration: 650, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, [op1, op2, op3, bob]);

  // Keep aspect ratio similar to 28x60
  const svgH = size;
  const svgW = Math.round(size * (28 / 60));

  const baseStyle = inline
    ? { alignItems: "center" as const }
    : { position: "absolute" as const, left: 0, right: 0, bottom, alignItems: "center" as const };

  return (
    <Animated.View
      style={[baseStyle, { transform: [{ translateY: bob }], zIndex: 20, elevation: 20 }, containerStyle]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Scroll down"
        onPress={onPress}
        hitSlop={{ top: 12, bottom: 12, left: 20, right: 20 }}
        style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
      >
        <Svg width={svgW} height={svgH} viewBox="0 0 28 60" pointerEvents="none">
          <AnimatedPath
            d="M4 10 L14 20 L24 10"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={op1 as unknown as number}
          />
          <AnimatedPath
            d="M4 28 L14 38 L24 28"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={op2 as unknown as number}
          />
          <AnimatedPath
            d="M4 46 L14 56 L24 46"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={op3 as unknown as number}
          />
        </Svg>
      </Pressable>
    </Animated.View>
  );
}

// ---------- Home ----------
export default function Home() {
  const scrollRef = useRef<ScrollView>(null);
  const pillarsAnchorY = useRef<number>(0);

  const { width: winW, height: winH } = useWindowDimensions();
  const isTablet = winW >= TABLET_BP && winW < BREAKPOINT;
  const isMobile = winW < TABLET_BP;

  // Responsive container max width
  const HERO_MAX_W = useMemo(() => clamp(winW - 32, 980, 1280), [winW]);

  // Top spacer so fixed navbar (web) doesn’t overlap content
  const TOP_SPACER = Platform.OS === "web" ? HEADER_H - 20 : 0;
  const HERO_MIN = Math.max(winH - TOP_SPACER, 560); // minimum hero height

  // Track hero size for proportional decor placement
  const [heroSize, setHeroSize] = useState({ w: 0, h: 0 });

  // Base width for scaling circle/lion (cap at hero max width)
  const base = Math.min(heroSize.w || winW, HERO_MAX_W);

  // ---------- Responsive tokens ----------
  const COL_GAP = isMobile ? 14 : isTablet ? 16 : 20;

  const H1 = Math.round(rsize(winW, 48, 34, 64));     // h1 font size
  const H1_LH = Math.round(H1 * 1.08);
  const H1_THIN = Math.round(rsize(winW, 32, 22, 40));
  const COPY_W = Math.round(rsize(winW, 360, 280, 460));
  const CHEVRON_SIZE = Math.round(rsize(winW, 56, 42, 72)); // indicator height

  // Circle & lion scale with container
  const CIRCLE = clamp(base * 0.36, 220, 480);
  const CIRCLE_LEFT = -CIRCLE * (isMobile ? 0.15 : 0.25);
  const LION_H = clamp(base * 0.55, 300, 660);
  const STAR = clamp(base * 0.05, 18, 50);

  // Image column aspect & behavior:
  const IMAGE_RESIZE_MODE: "contain" | "cover" = "contain"; // Change to "cover" for bolder crop

  // Smooth scroll to pillars
  const scrollToPillars = () => {
    const y = Math.max(pillarsAnchorY.current - 16, 0);
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: PAPER }}>
      <Header />

      {/* Scrollable page content; header stays fixed on web */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          flexGrow: 1,
          minHeight: winH - (Platform.OS === "web" ? 0 : HEADER_H),
          alignItems: "center",
          paddingBottom: 32,
        }}
      >
        {/* Spacer under fixed header (web only) */}
        {TOP_SPACER > 0 && <View style={{ height: TOP_SPACER }} />}

        <View
          style={[
            styles.heroCard,
            {
              marginTop: HERO_MARGIN_TOP,
              minHeight: HERO_MIN,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "center" : "stretch",
              justifyContent: "center",
              gap: COL_GAP,
              maxWidth: HERO_MAX_W,
              paddingHorizontal: isMobile ? 12 : 16,
              paddingVertical: isMobile ? 12 : 16,
            },
          ]}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setHeroSize({ w: width, h: height });
          }}
        >
          {/* LEFT: Image / lion */}
          <View
            style={[
              styles.leftCol,
              {
                flex: isMobile ? undefined : isTablet ? 1.05 : 1.15,
                width: isMobile ? "100%" : undefined,
                minHeight: Math.max(320, CIRCLE * (isMobile ? 1.0 : 0.85)),
              },
            ]}
          >
            {/* Circle behind lion */}
            <View
              style={{
                position: "absolute",
                width: CIRCLE,
                height: CIRCLE,
                borderRadius: CIRCLE / 2,
                backgroundColor: "#eadfce",
                left: isMobile ? "50%" : CIRCLE_LEFT,
                top: isMobile ? 0 : "50%",
                transform: isMobile
                  ? [{ translateX: -CIRCLE / 2 }]
                  : [{ translateY: -CIRCLE / 2 }],
                zIndex: 0,
              }}
            />

            {/* Lion image */}
            <Image
              source={require("../assets/images/lions.png")}
              style={{
                width: isMobile ? CIRCLE * 0.9 : "100%",
                height: isMobile ? CIRCLE * 0.9 : LION_H,
                zIndex: 1,
                resizeMode: IMAGE_RESIZE_MODE,
              }}
            />
          </View>

          {/* RIGHT: heading/copy */}
          <View
            style={[
              styles.rightCol,
              {
                flex: isMobile ? undefined : 1,
                width: isMobile ? "100%" : undefined,
                alignItems: isMobile ? "center" : "flex-start",
                position: "relative", // for inline chevrons placement
                paddingHorizontal: isMobile ? 4 : 8,
                gap: isMobile ? 8 : 10,
              },
            ]}
          >
            <View
              style={[
                styles.titleWrap,
                { alignItems: isMobile ? "center" : "flex-start" },
              ]}
            >
              <Text style={[styles.h1, { fontSize: H1, lineHeight: H1_LH }]}>
                LION DANCE{"\n"}TEAM
              </Text>

              <View style={styles.titleRow}>
                <Text style={[styles.h1Thin, { fontSize: H1_THIN }]}>| AT UF</Text>
                <Star
                  style={{
                    marginLeft: 8,
                    width: STAR,
                    height: STAR,
                    transform: [{ translateY: 2 }],
                    zIndex: 9,
                  }}
                />
              </View>
            </View>

            <Text
              style={[
                styles.copy,
                {
                  textAlign: isMobile ? "center" : "left",
                  maxWidth: COPY_W,
                  fontSize: Math.round(rsize(winW, 16, 14, 18)),
                  lineHeight: Math.round(rsize(winW, 22, 20, 26)),
                },
              ]}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              rhoncus in libero ut maximus.
            </Text>

            <View style={styles.carouselHint}>
              <Text style={styles.chev}>◄</Text>
              <Text style={styles.hanzi}>舞獅</Text>
              <Text style={styles.chev}>►</Text>
            </View>

            {/* Chevrons indicator: inline, higher & to the right (next to text) */}
            <ChevronsCue
              inline
              size={CHEVRON_SIZE}
              color={PURPLE}
              visible={!isMobile}               // hide on small phones; show tablet/desktop
              onPress={scrollToPillars}
              containerStyle={{
                alignSelf: "flex-end",          // push to the right edge of the text column
                marginTop: 10,                   // slightly lower than the body copy
                marginRight: 4,                  // a smidge in from the right edge
              }}
            />
          </View>

          {/* DECOR — placed last so it's on top */}
          {!isMobile && <SideTag style={styles.sideTagOverride} />}
        </View>

        {/* Invisible anchor to compute Y for smooth scroll */}
        <View
          onLayout={(e) => {
            pillarsAnchorY.current = e.nativeEvent.layout.y;
          }}
        />

        {/* Pillars section */}
        <ColorSwatchRow />

        {/* Extra space under pillars (responsive) */}
        <View style={{ height: isMobile ? 80 : isTablet ? 100 : 140 }} />
      </ScrollView>
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
    width: "100%",
    backgroundColor: PAPER,
    borderRadius: 10,
    position: "relative",
    overflow: "visible", // decor can hang outside
  },

  leftCol: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  rightCol: {
    justifyContent: "center",
  },

  h1: {
    color: PURPLE,
    fontWeight: "900",
    letterSpacing: 1,
  },
  h1Thin: { color: "#161616", fontWeight: "700" },
  copy: { color: "#1a1a1a" },

  carouselHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  hanzi: { fontWeight: "900", color: "#1a1a1a" },
  chev: { color: "#1a1a1a", marginHorizontal: 2 },

  // SideTag placement
  sideTagOverride: {
    position: "absolute",
    left: -48,
    top: "50%",
    transform: [{ rotate: "-90deg" }],
    zIndex: 5,
    elevation: 5, // Android stacking
  },

  titleWrap: { gap: 4 },
  titleRow: { flexDirection: "row", alignItems: "center" },
});
