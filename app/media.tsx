// app/media.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Header, { HEADER_H } from "../app/header";

/** ---- Theme ---- */
const PAPER = "#f6f1ea";
const INK = "#161616";
const ACCENT = "#d9cdbb";
const PURPLE = "#6f00ff";

/** ---- Local images (placeholders until GDrive hook-up) ---- */
import one from "../assets/media/one.png";
import two from "../assets/media/two.png";

/** Click-through destination */
const DRIVE_FOLDER_URL =
  "https://drive.google.com/drive/folders/1oM2-p7UQ6Vr1cPKIADcTY_GCMVsWNzGU";

type Slide = { source: ImageSourcePropType; alt?: string };
const SLIDES: Slide[] = [
  { source: one, alt: "Gallery 1" },
  { source: two, alt: "Gallery 2" },
];

export default function MediaPage() {
  const { height } = useWindowDimensions();
  const headerOffset = Platform.OS === "web" ? HEADER_H : 0;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (SLIDES.length === 0) setErr("Add one.png and two.png to assets/media.");
      setLoading(false);
    }, 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PAPER }}>
      <Header />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: headerOffset, paddingBottom: 32 }}
        showsVerticalScrollIndicator
      >
        <View style={[s.container, s.pageHeader]}>
          <Text style={s.h1}>MEDIA</Text>
          <Text style={s.kicker}>Swipe through our favorite moments ✨</Text>
        </View>

        <View style={[s.container, { paddingBottom: 24 }]}>
          {loading ? (
            <View style={s.stateCard}>
              <ActivityIndicator />
              <Text style={s.stateMsg}>Loading…</Text>
            </View>
          ) : err ? (
            <View style={s.stateCard}>
              <Text style={s.errorTitle}>Heads up</Text>
              <Text style={s.emptyBody}>{err}</Text>
            </View>
          ) : (
            <Carousel
              slides={SLIDES}
              onSlidePress={() =>
                Linking.openURL(DRIVE_FOLDER_URL).catch(() => {
                  if (typeof window !== "undefined")
                    (window as any).open?.(DRIVE_FOLDER_URL, "_blank");
                })
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
function Carousel({
  slides,
  onSlidePress,
}: {
  slides: Slide[];
  onSlidePress: () => void;
}) {
  const { width: screenW } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const viewerW = Math.min(screenW - 24, 1200);
  const viewerH = Math.min(viewerW * 0.6, 720); 

  const slideW = viewerW;

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, slides.length - 1));
    setIndex(clamped);
    listRef.current?.scrollToIndex({ index: clamped, animated: true });
  };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const itemLayout = (_: any, i: number) => ({
    length: slideW,
    offset: slideW * i,
    index: i,
  });

  return (
    <View style={s.carouselWrap}>
      <View style={[s.viewer, { width: viewerW, height: viewerH }]}>
        <FlatList
          ref={listRef}
          horizontal
          pagingEnabled
          data={slides}
          getItemLayout={itemLayout}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / slideW);
            setIndex(i);
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={onSlidePress}
              style={{
                width: slideW,
                height: "100%", 
              }}
            >
              <Image
                source={item.source}
                style={s.slideImg}   
                resizeMode="cover"  
              />
              {item.alt ? (
                <Text style={s.caption} numberOfLines={1}>
                  {item.alt}
                </Text>
              ) : null}
            </Pressable>
          )}
        />

        {/* Arrows */}
        <Pressable
          onPress={prev}
          style={[s.arrow, s.arrowLeft]}
          disabled={index === 0}
        >
          <Text style={[s.arrowTxt, index === 0 && { opacity: 0.3 }]}>‹</Text>
        </Pressable>
        <Pressable
          onPress={next}
          style={[s.arrow, s.arrowRight]}
          disabled={index === slides.length - 1}
        >
          <Text
            style={[
              s.arrowTxt,
              index === slides.length - 1 && { opacity: 0.3 },
            ]}
          >
            ›
          </Text>
        </Pressable>

        {/* Dots */}
        <View style={s.dots}>
          {slides.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goTo(i)}
              style={[s.dot, i === index && s.dotActive]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  pageHeader: { paddingTop: 24, paddingBottom: 8, alignItems: "center" },
  h1: {
    color: PURPLE,
    fontWeight: "900",
    fontSize: 42,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  kicker: { color: INK, marginTop: 6, textAlign: "center" },

  carouselWrap: { alignItems: "center", justifyContent: "center" },
  viewer: {
    backgroundColor: PAPER,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ACCENT,
    position: "relative",
  },

  slideImg: { width: "100%", height: "100%" },

  caption: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    textShadowColor: "#0008",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    paddingHorizontal: 12,
  },

  arrow: {
    position: "absolute",
    top: "45%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#0008",
    borderRadius: 12,
    zIndex: 10,
  },
  arrowLeft: { left: 10 },
  arrowRight: { right: 10 },
  arrowTxt: { color: "#fff", fontSize: 38, fontWeight: "900" },

  dots: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#0004" },
  dotActive: { backgroundColor: PURPLE },

  stateCard: {
    alignSelf: "center",
    maxWidth: 640,
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ACCENT,
    backgroundColor: "#faf6f0",
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  stateMsg: { color: INK },
  emptyBody: { marginTop: 4, color: INK, textAlign: "center", lineHeight: 20 },
  errorTitle: { fontSize: 18, fontWeight: "900", color: "#a00", textAlign: "center" },
});

export { };

