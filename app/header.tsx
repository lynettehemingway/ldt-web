import * as Font from "expo-font";
import { Link, usePathname } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const BRAND_SERIF =
  Platform.OS === "web" ? "'Merriweather', Georgia, serif" : "Merriweather_900Black";

export const HEADER_H = 90;

const PAPER  = "#f7f4f1ff";
const ACCENT = "#d9cdbb";
const PURPLE = "#6f00ff";
const INK    = "#161616";
const BREAKPOINT = 900; // switch to hamburger

const NAV = [
  { label: "HOME", href: "/" },
  { label: "BOARD", href: "/board" },
  { label: "MEDIA", href: "/media" },
  { label: "MERCH", href: "/merch" },
  { label: "CONTACT", href: "/contact" },
];

// ---- Small component to get a nice hover underline + color change ----
function NavLink({
  label,
  href,
  active,
  onNavigate,
}: {
  label: string;
  href: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const underline = useRef(new Animated.Value(active ? 1 : 0)).current;

  // animate underline on hover/active
  useEffect(() => {
    Animated.timing(underline, {
      toValue: hovered || active ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [hovered, active, underline]);

  return (
    <Link href={href as any} asChild>
      <Pressable
        onPress={onNavigate}
        onHoverIn={Platform.OS === "web" ? () => setHovered(true) : undefined}
        onHoverOut={Platform.OS === "web" ? () => setHovered(false) : undefined}
        style={({ pressed }) => [
          styles.navItem,
          {
            transform: [{ scale: pressed ? 0.96 : hovered ? 1.04 : 1 }],
            ...(Platform.OS === "web" ? { cursor: "pointer" } : null),
          },
        ]}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={[
              styles.link,
              { color: active || hovered ? PURPLE : INK, fontWeight: active ? "900" : "700" },
            ]}
          >
            {label}
          </Text>
          {/* underline that grows in using scaleX */}
          <Animated.View
            style={[
              styles.underline,
              {
                transform: [{ scaleX: underline }],
                opacity: hovered || active ? 1 : 0.5,
              },
            ]}
          />
        </View>
      </Pressable>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);

  // load display font (was in your original)
  useEffect(() => {
    Font.loadAsync({
      "CaveatBrush-Regular": {
        uri:
          "https://fonts.gstatic.com/s/caveatbrush/v17/EYq0maZfwr9S9-ETZc3fKXt8Qn3D_Q.woff2",
        display: Font.FontDisplay.SWAP,
      },
    }).catch(() => {});
  }, []);

  const isHome = pathname === "/" || pathname === "/index";
  const isMobile = width < BREAKPOINT;

  return (
    <View style={styles.fixed}>
      <View style={styles.bar}>
        {/* left: logo + title */}
        <Link href="/" asChild>
          <Pressable style={styles.logoWrap} onPress={() => setMenuOpen(false)}>
            <Image source={require("../assets/images/logo.png")} style={styles.logo} />
            <View>
              <Text style={[styles.title, { fontFamily: BRAND_SERIF }]}>Lion Dance Team</Text>
              <Text style={styles.subtitle}>at the University of Florida</Text>
            </View>
          </Pressable>
        </Link>

        {/* right: links OR hamburger */}
        {!isMobile ? (
          <View style={styles.links}>
            {NAV.map((n) => {
              const active = (n.href === "/" && isHome) || pathname === n.href;
              return (
                <NavLink
                  key={n.href}
                  label={n.label}
                  href={n.href}
                  active={active}
                  onNavigate={() => setMenuOpen(false)}
                />
              );
            })}
          </View>
        ) : (
          <Pressable onPress={() => setMenuOpen((v) => !v)} style={styles.burger}>
            <Text style={styles.burgerIcon}>☰</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.rule} />

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <View style={styles.mobileMenu}>
          {NAV.map((n) => {
            const active = (n.href === "/" && isHome) || pathname === n.href;
            return (
              <NavLink
                key={n.href}
                label={n.label}
                href={n.href}
                active={active}
                onNavigate={() => setMenuOpen(false)}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fixed: {
    position: Platform.OS === "web" ? "fixed" : "relative",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: PAPER,
    overflow: "visible",
  },
  bar: {
    height: HEADER_H,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoWrap: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 70, height: 70, resizeMode: "contain" },
  title: { fontSize: 28, color: "#000", lineHeight: 30, fontWeight: "900" },
  subtitle: { fontSize: 14, color: "#000" },

  // desktop nav
  links: { flexDirection: "row", gap: 28, alignItems: "center" },
  navItem: { paddingHorizontal: 8, paddingVertical: 6, alignItems: "center" },
  link: { fontSize: 18, letterSpacing: 1, textTransform: "uppercase" },
  underline: {
    height: 2,
    backgroundColor: PURPLE,
    width: "100%",
    marginTop: 4,
    borderRadius: 999,
    transform: [{ scaleX: 0 }],
  },

  // hairline rule
  rule: { height: 2, backgroundColor: ACCENT, width: "100%" },

  // hamburger
  burger: { padding: 10 },
  burgerIcon: { fontSize: 26, fontWeight: "900", color: "#000", lineHeight: 26 },

  // mobile dropdown
  mobileMenu: {
    backgroundColor: PAPER,
    borderTopWidth: 1,
    borderTopColor: ACCENT,
    paddingVertical: 8,
    alignItems: "center",
    gap: 6,
  },
});
