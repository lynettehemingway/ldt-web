// app/board.tsx
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Header, { HEADER_H } from "../app/header";

const PAPER = "#f7f4f1ff";
const ACCENT = "#d9cdbb";
const PURPLE = "#6f00ff";
const INK = "#161616";

const TABLET_BP = 600;
const BREAKPOINT = 900;

// -------- group (board) hero image --------
const GROUP_SRC = require("../assets/images/board/shoot/boardphotoshoot.png");

// -------- photos registry (main + optional photoshoot alt) --------
const PHOTOS = {
  president: {
    main: require("../assets/images/board/prof/steven.jpg"),
    alt: require("../assets/images/board/shoot/stevenphotoshoot.png"),
  },
  vp: {
    main: require("../assets/images/board/prof/colin.jpg"),
    alt: require("../assets/images/board/shoot/colinphotoshoot.png"),
  },
  treasurer: {
    main: require("../assets/images/board/prof/kelvin.jpg"),
    alt: require("../assets/images/board/shoot/kelvinphotoshoot.png"),
  },
  webmaster1: {
    main: require("../assets/images/board/prof/alice.jpg"),
    alt: require("../assets/images/board/shoot/alicephotoshoot.png"),
  },
  webmaster2: {
    main: require("../assets/images/board/prof/lynette.jpg"),
    alt: require("../assets/images/board/shoot/lynphotoshoot.png"),
  },
  showDirector1: {
    main: require("../assets/images/board/prof/han.jpg"),
    alt: require("../assets/images/board/shoot/hanphotoshoot.png"),
  },
  showDirector2: {
    main: require("../assets/images/board/prof/matt.jpg"),
    alt: require("../assets/images/board/shoot/mattphotoshoot.png"),
  },
  showDirector3: {
    main: require("../assets/images/board/prof/kayla.jpg"),
    alt: require("../assets/images/board/shoot/kaylaphotoshoot.png"),
  },
} as const;

type Socials = Partial<{
  instagram: string;
  linkedin: string;
  website: string;
}>;

type Member = {
  id: keyof typeof PHOTOS | string;
  name: string;
  role: string;
  socials?: Socials;
  details?: {
    major?: string;
    year?: string;
    pronouns?: string;
  };
};

// --- board roster (exec vs directors)
const EXEC: Member[] = [
  {
    id: "president",
    name: "Steven Tran",
    role: "President",
    socials: { instagram: "https://www.instagram.com/stevendangkhoi/" },
    details: {
      major:
        "Digital Arts & Sciences, Minor in Media Production, Management & Technology",
      year: "3rd",
      pronouns: "he/him",
    },
  },
  {
    id: "vp",
    name: "Colin Liang",
    role: "Vice President",
    socials: { instagram: "https://www.instagram.com/_jhapu/" },
    details: { major: "Chemistry, Pre-Med Track", year: "2nd", pronouns: "he/him" },
  },
  {
    id: "treasurer",
    name: "Kelvin Nguyen",
    role: "Treasurer",
    socials: { instagram: "https://www.instagram.com/kelvin.saito/" },
    details: {
      major: "Finance, Minor in Spanish, Pre-Law Track",
      year: "2nd",
      pronouns: "he/him",
    },
  },
];

const DIRECTORS: Member[] = [
  {
    id: "webmaster1",
    name: "Alice Jiang",
    role: "Webmaster",
    socials: { instagram: "https://instagram.com/alicezzjiang" },
    details: {
      major:
        "Computer Science, Minor in Business Administration, Pre-Law Track",
      year: "3rd",
      pronouns: "she/her",
    },
  },
  {
    id: "webmaster2",
    name: "Lynette Hemingway",
    role: "Webmaster",
    socials: { instagram: "https://www.instagram.com/lynette_hemingway/" },
    details: {
      major:
        "Computer Science, Minor in Digital Arts & Sciencces, GIS Certificate",
      year: "3rd",
      pronouns: "she/her",
    },
  },
  {
    id: "showDirector1",
    name: "Han Nguyen",
    role: "Show Director",
    socials: { instagram: "https://www.instagram.com/hantheburgher/" },
    details: { major: "Food & Resource Economics", year: "2nd Year", pronouns: "he/him" },
  },
  {
    id: "showDirector2",
    name: "Matt Baterna",
    role: "Show Director",
    socials: { instagram: "https://www.instagram.com/amattforbats/" },
    details: {
      major: "Exercise & Sports Science, Pre-Physical Therapy Track",
      year: "2nd",
      pronouns: "he/him",
    },
  },
  {
    id: "showDirector3",
    name: "Kayla Le",
    role: "Show Director",
    socials: { instagram: "https://www.instagram.com/k.la_009/" },
    details: { major: "Accounting", year: "2nd Year", pronouns: "she/her" },
  },
];

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
  bottom = 8,
  size = 60,
}: {
  color?: string;
  visible?: boolean;
  onPress?: () => void;
  bottom?: number;
  size?: number;
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
        Animated.timing(bob, {
          toValue: -5,
          duration: 650,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 650,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [op1, op2, op3, bob]);

  const svgH = size;
  const svgW = Math.round(size * (28 / 60));

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        alignItems: "center",
        transform: [{ translateY: bob }],
        zIndex: 20,
        elevation: 20,
      }}
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

// helpers
function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ---------- board ----------
export default function Board() {
  const listRef = useRef<any>(null);

  const { width: winW, height: winH } = useWindowDimensions();
  const isTablet = winW >= TABLET_BP && winW < BREAKPOINT;
  const isMobile = winW < TABLET_BP;

  const HERO_MAX_W = useMemo(() => clamp(winW - 32, 980, 1400), [winW]);
  const headerOffset = Platform.OS === "web" ? HEADER_H : 0;

  const H1 = Math.round(rsize(winW, 48, 34, 64));
  const H1_LH = Math.round(H1 * 1.08);
  const KICKER_SIZE = Math.round(rsize(winW, 14, 12, 16));
  const COPY_SIZE = Math.round(rsize(winW, 16, 14, 18));
  const COPY_LH = Math.round(COPY_SIZE * 1.35);
  const SECTION_H = Math.round(rsize(winW, 20, 16, 26));
  const CHEVRON_SIZE = Math.round(rsize(winW, 56, 42, 72));
  const CHEVRON_BOTTOM = Math.round(rsize(winW, 8, 6, 12));
  const COL_GAP = isMobile ? 16 : isTablet ? 20 : 28;

  const numColumns = useMemo(() => {
    if (winW < 520) return 1;
    if (winW < 820) return 2;
    if (winW < 1100) return 3;
    return 4;
  }, [winW]);

  const cardContainerMax = 1100;
  const gutter = isMobile ? 16 : isTablet ? 20 : 24;
  const containerW = Math.min(winW, cardContainerMax);
  const CARD_W = Math.floor((containerW - (numColumns - 1) * gutter - 2 * 16) / numColumns);

  const SHOW_DIRECTORS = useMemo(
    () => DIRECTORS.filter((m) => m.role.toLowerCase().includes("show director")),
    []
  );
  const WEBMASTERS = useMemo(
    () => DIRECTORS.filter((m) => m.role.toLowerCase().includes("webmaster")),
    []
  );

  const sections = useMemo(
    () => [
      { title: "Executive Board", data: chunk(EXEC, numColumns) },
      {
        title: "Chair Board",
        data: [...chunk(SHOW_DIRECTORS, numColumns), ...chunk(WEBMASTERS, numColumns)],
      },
    ],
    [numColumns, SHOW_DIRECTORS, WEBMASTERS]
  );

  const GROUP_AR_WIDE = 4 / 3;
  const GROUP_AR_MOBILE = 4 / 5;
  const IMAGE_MODE: "cover" | "contain" = "cover";
  const isWideHero = winW >= BREAKPOINT;

  const heroViewportH = Math.max(620, winH - headerOffset);
  const HERO_INNER_PADDING = 40;
  const IMG_H = isWideHero ? clamp(heroViewportH - HERO_INNER_PADDING, 420, 1080) : undefined;
  const IMG_W = isWideHero && IMG_H ? Math.round(IMG_H * GROUP_AR_WIDE) : undefined;
  const heroMinH = heroViewportH;

  const scrollToGrid = () => {
    listRef.current?.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      viewOffset: headerOffset + 8,
      animated: true,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: PAPER }}>
      <Header />

      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(row, idx) => `${row.map((m) => m.id).join("_")}-${idx}`}
        contentContainerStyle={{
          alignItems: "center",
          minHeight: winH - (Platform.OS === "web" ? 0 : HEADER_H),
          paddingTop: headerOffset,
          paddingBottom: 32,
          paddingHorizontal: 16,
          gap: 12,
        }}
        ListHeaderComponent={
          <>
            <View
              style={[
                styles.heroCard,
                {
                  minHeight: heroMinH,
                  maxWidth: HERO_MAX_W,
                  padding: isMobile ? 16 : 20,
                  gap: isMobile ? 14 : 16,
                },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: isWideHero ? "row" : "column",
                  alignItems: isWideHero ? "stretch" : "center",
                  justifyContent: isWideHero ? "space-between" : "center",
                  gap: COL_GAP,
                }}
              >
                {/* left: group photo */}
                <View
                  style={[
                    styles.groupWrap,
                    isWideHero
                      ? { width: IMG_W, height: IMG_H, alignSelf: "center", flexShrink: 0 }
                      : { width: "100%" },
                  ]}
                >
                  <Image
                    source={GROUP_SRC}
                    style={
                      isWideHero
                        ? { width: "100%", height: "100%" }
                        : [styles.groupImage, { aspectRatio: GROUP_AR_MOBILE, maxHeight: heroViewportH - 24 }]
                    }
                    resizeMode={IMAGE_MODE}
                    accessible
                    accessibilityLabel="UF Lion Dance Team — Board group photo"
                  />
                  <View style={styles.groupCaptionPill}>
                    <Text style={styles.groupCaptionText}>Board 2025–26</Text>
                  </View>
                </View>

                {/* right: title block */}
                <View
                  style={{
                    ...(isWideHero ? { flex: 1 } : { width: "100%" }),
                    alignItems: isWideHero ? "flex-start" : "center",
                    justifyContent: "center",
                    gap: 8,
                    minWidth: 0,
                    flexBasis: 0,
                    flexGrow: 1,
                    paddingRight: 0,
                    position: "relative",
                    paddingBottom: isWideHero ? 36 : 0,
                  }}
                >
                  <Text style={[styles.kicker, { fontSize: KICKER_SIZE }]}>
                    UF LION DANCE TEAM 2025–2026
                  </Text>
                  <Text style={[styles.h1, { fontSize: H1, lineHeight: H1_LH }]}>
                    BOARD MEMBERS
                  </Text>
                  <Text
                    style={[
                      styles.copyCenter,
                      { textAlign: isWideHero ? "left" : "center", fontSize: COPY_SIZE, lineHeight: COPY_LH },
                    ]}
                  >
                    The board leads our team with dedication, creativity, and a passion for lion dance.
                  </Text>

                  <ChevronsCue
                    color={PURPLE}
                    size={CHEVRON_SIZE}
                    bottom={CHEVRON_BOTTOM}
                    visible={isWideHero}
                    onPress={scrollToGrid}
                  />
                </View>
              </View>
            </View>

            <View style={[styles.sectionRule, { maxWidth: HERO_MAX_W, marginBottom: 8 }]} />
            <View style={{ height: isMobile ? 40 : 64 }} />
          </>
        }
        renderSectionHeader={({ section }) => {
          const title = String(section.title ?? "");
          const isAccent = /executive|chair/i.test(title);
          return (
            <View style={styles.sectionHeaderWrap}>
              <Text style={[styles.sectionHeader, { fontSize: SECTION_H, color: isAccent ? PURPLE : INK }]}>
                {title}
              </Text>
            </View>
          );
        }}
        renderItem={({ item: row }) => (
          <View
            style={{
              width: "100%",
              maxWidth: cardContainerMax,
              flexDirection: "row",
              justifyContent: "space-between",
              gap: gutter,
              marginBottom: gutter,
              alignItems: "stretch",
            }}
          >
            {row.map((member) => (
              <MemberCard key={member.id} member={member} cardWidth={CARD_W} />
            ))}
          </View>
        )}
      />
    </View>
  );
}

// ---- member card with crossfade hover ----
function MemberCard({ member, cardWidth }: { member: Member; cardWidth: number }) {
  const mainSrc = (PHOTOS as any)[member.id]?.main ?? require("../assets/images/lions.png");
  const altSrc = (PHOTOS as any)[member.id]?.alt ?? mainSrc;

  // keep both mounted and crossfade
  const altOp = useRef(new Animated.Value(0)).current; // 0 main, 1 alt
  const FADE_MS = 180;

  const showAlt = () =>
    Animated.timing(altOp, {
      toValue: 1,
      duration: FADE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

  const showMain = () =>
    Animated.timing(altOp, {
      toValue: 0,
      duration: FADE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

  // prefetch if any are remote urls (require() is already bundled)
  useEffect(() => {
    if (typeof altSrc === "string") Image.prefetch(altSrc);
    if (typeof mainSrc === "string") Image.prefetch(mainSrc);
  }, [altSrc, mainSrc]);

  const a11y = `${member.name} — ${member.role}`;

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Pressable
        onPress={() => {
          altOp.stopAnimation((v) => (v < 0.5 ? showAlt() : showMain()));
        }}
        onHoverIn={showAlt}
        onHoverOut={showMain}
      >
        <View style={styles.photoWrap}>
          {/* base layer */}
          <Image source={mainSrc} style={[styles.photo, StyleSheet.absoluteFillObject]} accessible accessibilityLabel={a11y} />
          {/* alt layer */}
          <Animated.Image source={altSrc} style={[styles.photo, StyleSheet.absoluteFillObject, { opacity: altOp }]} />
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>{member.role}</Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.meta}>
        <Text style={styles.name}>{member.name}</Text>

        <View style={styles.detailsBlock}>
          {member.details?.major && (
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Major: </Text>
              {member.details.major}
            </Text>
          )}
          {member.details?.year && (
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Year: </Text>
              {member.details.year}
            </Text>
          )}
          {member.details?.pronouns && (
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Pronouns: </Text>
              {member.details.pronouns}
            </Text>
          )}
        </View>

        <View style={styles.flexSpacer} />

        <View style={styles.socialRow}>
          {member.socials?.instagram && <Chip label="Instagram" href={member.socials.instagram} />}
          {member.socials?.website && <Chip label="Website" href={member.socials.website} />}
        </View>
      </View>
    </View>
  );
}

function Chip({ label, href }: { label: string; href: string }) {
  return (
    <Pressable
      onPress={() => {
        import("react-native").then(({ Linking }) => Linking.openURL(href));
      }}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: pressed ? PURPLE : ACCENT,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    width: "100%",
    backgroundColor: PAPER,
    borderRadius: 10,
    position: "relative",
    overflow: "visible",
  },

  // titles
  kicker: { color: INK, fontWeight: "900", letterSpacing: 1 },
  h1: { color: PURPLE, fontWeight: "900", letterSpacing: 1 },
  copyCenter: { color: INK, maxWidth: 680, textAlign: "center" },

  // group image
  groupWrap: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: ACCENT,
    backgroundColor: "#eadfce",
  },
  groupImage: { width: "100%", resizeMode: "cover" },
  groupCaptionPill: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(22,22,22,0.85)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  groupCaptionText: {
    color: "#fff",
    fontWeight: "900",
    letterSpacing: 0.4,
    fontSize: 12,
  },

  sectionRule: {
    height: 2,
    backgroundColor: ACCENT,
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },

  // section header
  sectionHeaderWrap: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 4,
  },
  sectionHeader: { color: INK, fontWeight: "900", letterSpacing: 0.6 },

  // grid card
  card: {
    backgroundColor: PAPER,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: ACCENT,
    flex: 1,
  },
  photoWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: 4 / 5,
    backgroundColor: "#eadfce",
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%", resizeMode: "cover" },
  rolePill: {
    position: "absolute",
    left: 10,
    bottom: 10,
    backgroundColor: INK,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  rolePillText: { color: "#fff", fontWeight: "900", letterSpacing: 0.5, fontSize: 12 },

  meta: { padding: 12, gap: 8, flex: 1 },
  flexSpacer: { flexGrow: 1 },
  name: { color: INK, fontWeight: "900", fontSize: 18, letterSpacing: 0.3 },

  socialRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: PAPER,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
  },
  chipText: { color: INK, fontWeight: "700", fontSize: 12, letterSpacing: 0.2 },

  detailsBlock: {
    gap: 2,
    minHeight: 56,
  },
  detailText: {
    color: INK,
    opacity: 0.8,
    fontSize: 13,
    lineHeight: 18,
    ...(Platform.OS === "web" ? { wordBreak: "break-word" } : {}),
  },
  detailLabel: {
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
