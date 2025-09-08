import * as Font from "expo-font";
import { Link, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Lantern } from "../app/decor";
const BRAND_SERIF =
  Platform.OS === "web"
    ? "'Merriweather', Georgia, serif"
    : "Merriweather_900Black"; 

const NAV = [
  { label: "HOME", href: "/" },
  { label: "BOARD", href: "/board" },
  { label: "MEDIA", href: "/media" },
  { label: "MERCH", href: "/merch" },
];

export const HEADER_H = 90;
const PAPER = "#f6f1ea";
const ACCENT = "#d9cdbb";
const PURPLE = "#6f00ff";
const BREAKPOINT = 900; // width where we switch to hamburger

export default function Header() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      "CaveatBrush-Regular": {
        uri:
          "https://fonts.gstatic.com/s/caveatbrush/v17/EYq0maZfwr9S9-ETZc3fKXt8Qn3D_Q.woff2",
        display: Font.FontDisplay.SWAP,
      },
    }).then(() => setFontLoaded(true));
  }, []);

  const isHome = pathname === "/" || pathname === "/index";
  const isMobile = width < BREAKPOINT;

  // --- Lantern sizing/placement attached to header bottom ---
  const LAN_W = clamp(width * 0.09, 44, 96);
  const LAN_H = Math.round(LAN_W * (64 / 40)); // preserves image aspect
  const LAN_RIGHT = clamp(width * 0.015, 8, 24);
  const LAN_OVERHANG = Math.round(LAN_H * 0.60); // how far it hangs below the header
  // ----------------------------------------------------------

  return (
    <View style={styles.fixed}>
      <View style={styles.bar}>
        {/* left logo + title */}
        <Link href="/" asChild>
          <Pressable style={styles.logoWrap} onPress={() => setMenuOpen(false)}>
            <Image source={require("../assets/images/logo.png")} style={styles.logo} />
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    fontFamily
                      : BRAND_SERIF,
                  },
                ]}
              >
                Lion Dance Team
              </Text>
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
                <Link key={n.href} href={n.href as any} asChild>
                  <Pressable>
                    <Text style={[styles.link, active && styles.linkActive]}>{n.label}</Text>
                  </Pressable>
                </Link>
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

      {/* Mobile dropdown (below the rule) */}
      {isMobile && menuOpen && (
        <View style={styles.mobileMenu}>
          {NAV.map((n) => {
            const active = (n.href === "/" && isHome) || pathname === n.href;
            return (
              <Link key={n.href} href={n.href as any} asChild>
                <Pressable
                  onPress={() => setMenuOpen(false)}
                  style={styles.mobileLinkWrap}
                >
                  <Text style={[styles.mobileLink, active && styles.linkActive]}>
                    {n.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      )}

      {/* Lantern hangs from header bottom — IMPORTANT: use only bottom, NOT top */}
      {(pathname === "/" || pathname === "/index") && (
        <Lantern
          style={{
            position: "absolute",
            right: LAN_RIGHT,
            bottom: -LAN_OVERHANG - 54,
            width: LAN_W,
            height: LAN_H,
            zIndex: 1001,
          }}
        />
      )}

    </View>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(v, hi));
}

const styles = StyleSheet.create({
  fixed: {
    position: Platform.OS === "web" ? "fixed" : "relative",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: PAPER,
    // allow the lantern to hang outside
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
  title: { fontSize: 28, color: "#000", lineHeight: 30, fontWeight: "900", fontFamily: BRAND_SERIF},
  subtitle: { fontSize: 14, color: "#000" },
  links: { flexDirection: "row", gap: 36, alignItems: "center" },
  link: { fontWeight: "500", fontSize: 18, letterSpacing: 1, color: "#000" },
  linkActive: { color: PURPLE },
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
  },
  mobileLinkWrap: { paddingVertical: 10, paddingHorizontal: 24 },
  mobileLink: { fontSize: 18, color: "#000", fontWeight: "700", fontFamily: BRAND_SERIF },
});
