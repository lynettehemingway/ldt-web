import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import ColorSwatchRow from "../app/colorswatchrow";
import Header, { HEADER_H } from "../app/header";

const PURPLE = "#6f00ff";
const PAPER = "#f7f4f1ff";

// ---- breakpoints ----
const BREAKPOINT = 900;     // desktop
const TABLET_BP  = 680;     // tablet-ish
const PHONE_BP   = 420;     // small phones

// ---------- utils ----------
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(n, hi));
}
function rsize(winW: number, pref: number, min: number, max: number, base = 1200) {
  return clamp(pref * (winW / base), min, max);
}

// ---------- svg chevrons ----------
const AnimatedPath = Animated.createAnimatedComponent(Path);
function ChevronsCue({
  color = PURPLE,
  visible = true,
  onPress,
  inline = false,
  bottom = 8,
  size = 60,
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
          <AnimatedPath d="M4 10 L14 20 L24 10" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={op1 as unknown as number} />
          <AnimatedPath d="M4 28 L14 38 L24 28" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={op2 as unknown as number} />
          <AnimatedPath d="M4 46 L14 56 L24 46" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={op3 as unknown as number} />
        </Svg>
      </Pressable>
    </Animated.View>
  );
}

// tiny star as text (no image dep)
function StarText({ size = 18, style }: { size?: number; style?: any }) {
  return <Text style={[{ fontSize: size, lineHeight: size, color: "#000" }, style]}>★</Text>;
}

// ---------- Home ----------
export default function Home() {
  const scrollRef = useRef<ScrollView>(null);
  const pillarsAnchorY = useRef<number>(0);

  const { width: winW, height: winH } = useWindowDimensions();
  const isTablet = winW >= TABLET_BP && winW < BREAKPOINT;
  const isMobile = winW < TABLET_BP;
  const isPhone  = winW <= PHONE_BP;

  const MAX_W = isMobile ? Math.min(640, winW - 16) : Math.min(1280, winW - 32);
  const TOP_SPACER = Platform.OS === "web" ? HEADER_H : 0;
  const HERO_MIN_VIEW = Math.max(560, winH - TOP_SPACER);

  const [heroSize, setHeroSize] = useState({ w: 0, h: 0 });
  const base = Math.min(heroSize.w || winW, MAX_W);

  // spacing + type
  const CARD_PAD_H = isPhone ? 12 : isMobile ? 14 : 16;
  const CARD_PAD_V = isPhone ? 12 : isMobile ? 14 : 16;
  const COL_GAP = isPhone ? 10 : isMobile ? 14 : isTablet ? 18 : 20;

  const H1 = isPhone ? 28 : Math.round(rsize(winW, 48, 34, 64));
  const H1_LH = Math.round(H1 * 1.08);
  const H1_THIN = isPhone ? 16 : Math.round(rsize(winW, 32, 22, 40));
  const BODY = isPhone ? 14 : Math.round(rsize(winW, 16, 14, 18));
  const BODY_LH = isPhone ? 21 : Math.round(BODY * 1.35);
  const STAR = clamp(base * 0.045, 16, 28);
  const CHEVRON_SIZE = Math.round(rsize(winW, 56, 42, 72));

  // *** Bigger mobile hero ***

  const CIRCLE = clamp(base * (isPhone ? 0.95 : isMobile ? 0.70 : 0.40), 320, isPhone ? 560 : 560);
  const LION_H = clamp(base * (isPhone ? 1.10 : isMobile ? 0.80 : 0.80), 420, 880);

  const IMAGE_RESIZE_MODE: "contain" | "cover" = "contain";

  const scrollToPillars = () => {
    const y = Math.max(pillarsAnchorY.current - 12, 0);
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: PAPER,
        paddingTop: Platform.OS === "web" ? HEADER_H * 0.4 : 0,
        marginTop: isPhone ? 20 : isMobile ? -40 : -150, // push down on phone, normal on desktop
      }}
    >
      <Header />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          flexGrow: 1,
          minHeight: winH - (Platform.OS === "web" ? 0 : HEADER_H),
          alignItems: "center",
          paddingBottom: 32,
          paddingHorizontal: isPhone ? 8 : 12,
        }}
      >
        {TOP_SPACER > 0 && <View style={{ height: TOP_SPACER }} />}

        {/* hero card */}
        <View
          style={[
            styles.heroCard,
            {
              marginTop: isPhone ? 6 : 10,
              minHeight: HERO_MIN_VIEW,
              maxWidth: MAX_W,
              paddingHorizontal: CARD_PAD_H,
              paddingVertical: CARD_PAD_V,
              gap: COL_GAP,
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setHeroSize({ w: width, h: height });
          }}
        >
          {/* IMAGE COLUMN */}
          <View
            style={{
              width: isMobile ? "100%" : undefined,
              flex: isMobile ? undefined : isTablet ? 1.05 : 1.15,
              minHeight: Math.max(300, CIRCLE * (isMobile ? 1.2 : 0.85)),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* background circle */}
            <View
              style={{
                position: "absolute",
                width: CIRCLE,
                height: CIRCLE,
                borderRadius: CIRCLE / 2,
                backgroundColor: "#eee7ddff",
                left: "50%",
                top: isMobile ? (isPhone ? 8 : 0) : "50%",
                transform: isMobile
                  ? [{ translateX: -CIRCLE / 2 }]
                  : [{ translateX: -CIRCLE * 0.6 }, { translateY: -CIRCLE / 2 }],
                zIndex: 0,
              }}
            />
            {/* lion */}
            <Image
              source={require("../assets/images/lions.png")}
              style={{
                width: isMobile ? CIRCLE * 1.05 : "100%",
                height: isMobile ? CIRCLE * 1.05 : LION_H,
                resizeMode: IMAGE_RESIZE_MODE,
                zIndex: 1,
              }}
            />
          </View>

          {/* TEXT COLUMN */}
          <View
            style={{
              width: isMobile ? "100%" : undefined,
              flex: isMobile ? undefined : isTablet ? 1.2 : 1.35,
              alignItems: isMobile ? "center" : "flex-start",
              gap: isPhone ? 6 : 8,
              position: "relative",
            }}
          >
            <View style={{ alignItems: isMobile ? "center" : "flex-start", gap: 4 }}>
              <Text style={[styles.h1, { fontSize: H1, lineHeight: H1_LH, textAlign: isMobile ? "center" : "left" }]}>
                LION DANCE TEAM
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text
                  style={[
                    styles.h1Thin,
                    { fontSize: H1_THIN, textAlign: isMobile ? "center" : "left" },
                  ]}
                >
                  at the University of Florida
                </Text>
                {!isPhone && <StarText size={STAR} style={{ marginLeft: 4, transform: [{ translateY: 2 }] }} />}
              </View>
            </View>

            {/* body copy */}
            <Text
              style={{
                color: "#1a1a1a",
                maxWidth: isMobile ? "92%" as any : Math.round(rsize(winW, 620, 520, 760)),
                textAlign: isMobile ? "center" : "left",
                fontSize: BODY,
                lineHeight: BODY_LH,
              }}
            >
              Lion Dance Team (LDT) at the University of Florida is an organization open to students of all skill
              levels and backgrounds that aims to teach and promote the art of lion dancing.{"\n\n"}We perform
              traditional and modern lion dance shows at UF, as well as in the greater Gainesville area, in order to
              entertain and spread this culture to the community. As a team, our goal is to foster artistic and
              individual growth in our dancers.
            </Text>

            {/* chevrons — hide on the tiniest phones */}
            <ChevronsCue
              inline
              size={CHEVRON_SIZE}
              color={PURPLE}
              visible={!isMobile || (isMobile && !isPhone)}
              onPress={scrollToPillars}
              containerStyle={{ alignSelf: isMobile ? "center" : "flex-end", marginTop: 8, marginRight: 2 }}
            />
          </View>
        </View>

        {/* scroll target anchor */}
        <View onLayout={(e) => (pillarsAnchorY.current = e.nativeEvent.layout.y)} />
        <View
          style={{
            width: "90%",
            maxWidth: 1200,
            alignSelf: "center",
            height: 2,
            backgroundColor: "rgba(0,0,0,0.1)", // light neutral line
            marginTop: 32,
            marginBottom: 24,
            borderRadius: 999,
          }}
        />


        {/* pillars */}
        <ColorSwatchRow />

        <View style={{ height: isMobile ? 60 : 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    width: "100%",
    backgroundColor: PAPER,
    borderRadius: 12,
    overflow: "visible",
  },

  h1: {
    color: PURPLE,
    fontWeight: "900",
    letterSpacing: 1,
  },

  h1Thin: {
    color: "#161616",
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});

