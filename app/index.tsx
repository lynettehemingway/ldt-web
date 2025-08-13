import React, { useEffect, useRef, useState } from "react";
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
import ColorSwatchRow from "../app/colorswatchrow";
import { SideTag, Star } from "../app/decor";
import Header, { HEADER_H } from "../app/header";

const PURPLE = "#6f00ff";
const PAPER = "#f6f1ea";
const HERO_MARGIN_TOP = 12;
const BREAKPOINT = 900; // stack hero under this width


export default function Home() {
  const scrollRef = useRef<ScrollView>(null);
  const pillarsAnchorY = useRef<number>(0);

  const { width: winW, height: winH } = useWindowDimensions();
  const isMobile = winW < BREAKPOINT;

  // Track hero size for proportional decor placement
  const [heroSize, setHeroSize] = useState({ w: 0, h: 0 });

  // Base width for scaling circle/lion (cap at hero max width)
  const base = Math.min(heroSize.w || winW, 1100);

  // Responsive circle size (desktop peeks from left, mobile centered)
  const CIRCLE = clamp(base * 0.36, 240, 460);
  const CIRCLE_LEFT = -CIRCLE * (isMobile ? 0.15 : 0.25);

  // Responsive lion height
  const LION_H = clamp(base * 0.55, 320, 640);

  // Inline star next to “| AT UF”
  const STAR = clamp(base * 0.05, 20, 50);

  // Top spacer so fixed navbar (web) doesn’t overlap content
  const TOP_SPACER = Platform.OS === "web" ? HEADER_H - 20 : 0;
  const HERO_MIN = Math.max(winH - TOP_SPACER, 560); // 560 is a small safety floor

  const INDICATOR_OFFSET = isMobile ? 84 : 72; // higher number = farther from bottom


  // --- Floating scroll cue animation (fade + gentle bob) ---
  const fade = useRef(new Animated.Value(0)).current;
  const bob  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 1, duration: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bob,  { toValue: -6, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(bob,  { toValue: 0,  duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, [fade, bob]);

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
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "center" : "stretch",
              gap: isMobile ? 16 : 12,

              // 👇 ensure the hero occupies at least one viewport height
              minHeight: HERO_MIN,
              justifyContent: "center",
              paddingBottom: 56, // room for the floating scroll cue
            },
          ]}
          onLayout={(e) => {
            const { width } = e.nativeEvent.layout;
            setHeroSize({ w: width, h: heroSize.h });
          }}
        >
          {/* LEFT: lions */}
          <View
            style={[
              styles.leftCol,
              {
                // enough height for the circle on any width
                minHeight: Math.max(340, CIRCLE * (isMobile ? 1.0 : 0.85)),
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
                resizeMode: "contain",
              }}
            />
          </View>

          {/* RIGHT: heading/copy */}
          <View style={[styles.rightCol, { alignItems: isMobile ? "center" : "flex-start" }]}>
            <View style={[styles.titleWrap, { alignItems: isMobile ? "center" : "flex-start" }]}>
              <Text style={styles.h1}>LION DANCE{"\n"}TEAM</Text>

              <View style={styles.titleRow}>
                <Text style={styles.h1Thin}>| AT UF</Text>
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

            <Text style={[styles.copy, { textAlign: isMobile ? "center" : "left" }]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rhoncus
              in libero ut maximus.
            </Text>

            <View style={styles.carouselHint}>
              <Text style={styles.chev}>◄</Text>
              <Text style={styles.hanzi}>舞獅</Text>
              <Text style={styles.chev}>►</Text>
            </View>
          </View>

          {/* DECOR — placed last so it's on top */}
          {!isMobile && <SideTag style={styles.sideTagOverride} />}

          {/* Floating "Our Pillars" scroll cue near bottom of first screen */}
          <Animated.View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: INDICATOR_OFFSET,
              alignItems: "center",
              opacity: fade,
              transform: [{ translateY: bob }],
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Jump to Our Pillars section"
              onPress={() => {
                const y = Math.max(pillarsAnchorY.current - 16, 0);
                scrollRef.current?.scrollTo({ y, animated: true });
              }}
              style={({ pressed }) => ({
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 999,
                backgroundColor: "rgba(22,22,22,0.85)",
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Text style={{ color: "#fff", fontWeight: "900", letterSpacing: 0.5 }}>
                Our Pillars  ↓
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        {/* Invisible anchor to compute Y for smooth scroll */}
        <View
          onLayout={(e) => {
            pillarsAnchorY.current = e.nativeEvent.layout.y;
          }}
        />

        {/* Pillars section */}
        <ColorSwatchRow />
      </ScrollView>
    </View>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(v, hi));
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
    maxWidth: 1100,
    backgroundColor: PAPER,
    borderRadius: 10,
    padding: 16,
    gap: 12,
    position: "relative",
    overflow: "visible", // decor can hang outside
  },

  leftCol: {
    flex: 1.1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  rightCol: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    gap: 10,
    position: "relative",
  },

  h1: { color: PURPLE, fontSize: 48, lineHeight: 52, fontWeight: "900", letterSpacing: 1 },
  h1Thin: { color: "#161616", fontWeight: "700", fontSize: 32 },
  copy: { color: "#1a1a1a", maxWidth: 360 },

  carouselHint: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
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
