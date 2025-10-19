import React from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import Header, { HEADER_H } from "./header";

const PAPER = "#f7f4f1ff";
const ACCENT = "#d9cdbb";
const INK = "#161616";
const PURPLE = "#6f00ff";

const IG_URL   = "https://www.instagram.com/uf.ldt/"; 
const EMAIL_TO = "ufliondanceteam@gmail.com";                

export default function Contact() {
  const { width, height } = useWindowDimensions();
  const topPad = Platform.OS === "web" ? HEADER_H : 0;

  // responsive sizing
  const H1 = clamp(scale(width, 48, 34, 64), 34, 64);
  const H1_LH = Math.round(H1 * 1.08);
  const P = clamp(scale(width, 16, 14, 18), 14, 18);
  const P_LH = Math.round(P * 1.5);
  const CARD_W = Math.min(980, width - 32);

  return (
    <View style={{ flex: 1, backgroundColor: PAPER }}>
      <Header />

      <View style={[styles.wrap, { paddingTop: topPad }]}>
        <View style={[styles.card, { maxWidth: CARD_W }]}>
          <Text style={[styles.h1, { fontSize: H1, lineHeight: H1_LH }]}>CONTACT</Text>
          <Text style={[styles.copy, { fontSize: P, lineHeight: P_LH }]}>
            Reach out for{" "}
            <Text style={styles.bold}>performances, collaborations, or sponsorship opportunities</Text>.
          </Text>

          {/* CTA Buttons */}
          <View style={styles.btnRow}>
            <CTA
              label="Instagram"
              onPress={() => openURL(IG_URL)}
              hint="@uf.ldt"
            />
            <CTA
              label="Email Us"
              onPress={() => email(EMAIL_TO)}
              hint={EMAIL_TO}
            />
            <CTA
              label="Sponsor Us"
              onPress={() =>
                email(
                  EMAIL_TO,
                  "Sponsorship Opportunity – UF Lion Dance Team",
                  [
                    "Hi UF Lion Dance Team,",
                    "",
                    "I’m interested in sponsoring the team. Could you share your deck and available packages?",
                    "",
                    "Best,",
                    "",
                  ].join("%0D%0A")
                )
              }
              hint="Packages / Deck"
            />
          </View>

          {/* Fast facts / secondary info */}
          <View style={styles.infoGrid}>
            <Info title="Response Time">
              typically within 24–48 hours during the semester!
            </Info>
            <Info title="Performance Requests">
              include date, venue, audience size, indoor/outdoor, and budget
            </Info>
            <Info title="Location">
              Gainesville, FL — available for UF + local area events
            </Info>
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------- small building blocks ----------
function CTA({ label, hint, onPress }: { label: string; hint?: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { borderColor: pressed ? PURPLE : ACCENT, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.btnLabel}>{label}</Text>
      {hint ? <Text style={styles.btnHint}>{hint}</Text> : null}
    </Pressable>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoBody}>{children}</Text>
    </View>
  );
}

// ---------- helpers ----------
function openURL(url: string) {
  // dynamic import to avoid SSR issues on web
  import("react-native").then(({ Linking }) => Linking.openURL(url));
}
function email(to: string, subject?: string, body?: string) {
  const s = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  const b = body ? `${subject ? "&" : "?"}body=${body}` : "";
  openURL(`mailto:${to}${s}${b}`);
}
function scale(winW: number, pref: number, min: number, max: number, base = 1200) {
  return clamp(pref * (winW / base), min, max);
}
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(n, hi));
}

// ---------- styles ----------
const styles = StyleSheet.create({
  wrap: {
    minHeight: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    width: "100%",
    marginTop: 16,
    backgroundColor: PAPER,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ACCENT,
    padding: 20,
    gap: 14,
  },
  h1: { color: PURPLE, fontWeight: "900", letterSpacing: 1, textAlign: "left" },
  copy: { color: INK, opacity: 0.9 },
  bold: { fontWeight: "900" },

  btnRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 6,
  },
  btn: {
    backgroundColor: PAPER,
    borderWidth: 2,
    borderColor: ACCENT,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999,
  },
  btnLabel: { color: INK, fontWeight: "900", letterSpacing: 0.3 },
  btnHint: { color: INK, opacity: 0.8, marginTop: 2, fontSize: 12 },

  infoGrid: {
    marginTop: 8,
    gap: 12,
  },
  infoItem: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: ACCENT,
    borderRadius: 12,
    padding: 12,
  },
  infoTitle: { color: INK, fontWeight: "900", marginBottom: 4, letterSpacing: 0.3 },
  infoBody: { color: INK, opacity: 0.9, lineHeight: 20 },
});
