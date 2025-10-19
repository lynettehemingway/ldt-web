// app/media.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
const PAPER = "#f7f4f1ff";
const INK = "#161616";
const ACCENT = "#d9cdbb";
const PURPLE = "#6f00ff";

/** Collage spacing (set to 0 for seamless) */
const COLLAGE_GAP = 4;

/** =========================================
 *  Add galleries here (as many as you want)
 *  ========================================= */
const GALLERIES: {
  title: string;
  folderId: string;
  slideIds?: string[];
}[] = [
  {
    title: "LDT x CASA x VSO Workshop • 09/05/2025",
    folderId: "1Rb-zR2zjL39yStZnq8Q2JMym1izlA9Ho",
    slideIds: [
      "1J_YYT3ICdeNq01XDeZQz5nG2w6pVISyO",
      "17OEjgdktNCl8ynbPAWNb9W9zTcGjWpxa",
      "1kRvwOqUpEi6_7xTYSQQn0pCIdZ8w8Uxq",
      "1xJIkPHSFKRKp4Dg9dsFdRqS2cUv6aziN",
      "19w2xeg4iZpChTflHmVW-zO2TexhGLTTR",
      "1H5difcnVGQp9EdXhU5qacKG0eIrcw2Ju",
      "114xG4s3ILLSOV-A8aoT8LMGWYCYlJ5NW",
      "1nblWcwg8MN5pfbqJ3a1sroPD0GpWEsNv",
      "1jeoCg2GqCUE0RexQXvrCpcuMWbLxDL_p",
      "1MADNctYHRL3jLukrYUTDEK4j8RojSvVp",
    ],
  },
  {
    title: "LDT Workshop • 09/11/2025",
    folderId: "1O5ZQpwQhO9gU8uqNmxGD7W3HNkYPZOwN",
    slideIds: ["1nnyt4WmVuM2-nILvoxTFng3xB6TUxADO"],
  },
];

/** Build multiple cookie-free-ish candidates for each Drive file ID.
 * Order matters: try the least cookie-sensitive first.
 */
const idToCandidates = (id: string) => {
  const bust = `t=${Date.now()}`; // cache-buster
  return [
    // Often returns JPEG/WEBP for HEIC; generally works without login
    `https://drive.google.com/uc?export=view&id=${id}&${bust}`,
    // Public googleusercontent pipe
    `https://lh3.googleusercontent.com/d/${id}=w2400?${bust}`,
    // Thumbnail endpoint (sometimes cookie-gated; keep later)
    `https://drive.google.com/thumbnail?id=${id}&sz=w2400&${bust}`,
    // Download endpoint can still render as <img> in many cases
    `https://drive.google.com/uc?export=download&id=${id}&${bust}`,
  ];
};

type Slide = { sources: string[] };

export default function MediaPage() {
  const headerOffset = Platform.OS === "web" ? HEADER_H : 0;
  const { width: winW } = useWindowDimensions();

  // responsive size helper (matches board.tsx behavior)
  const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(n, hi));
  const rsize = (winW: number, pref: number, min: number, max: number, base = 1200) =>
    clamp(Math.round(pref * (winW / base)), min, max);
  const KICKER_SIZE = rsize(winW, 14, 12, 16);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PAPER }}>
      <Header />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: headerOffset, paddingBottom: 56 }}
        showsVerticalScrollIndicator
      >
        <View style={[styles.container, styles.pageHeader]}>
          <Text style={styles.h1}>MEDIA</Text>
          <Text style={[styles.kicker, { fontSize: KICKER_SIZE }]}>
            Performances, workshops, and behind-the-scenes
          </Text>
        </View>

        <View style={styles.container}>
          {GALLERIES.map((g, idx) => (
            <GallerySection key={idx} {...g} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** ---------- Section (Hero Image + optional collage/embed) ---------- */
function GallerySection({
  title,
  folderId,
  slideIds,
}: {
  title: string;
  folderId: string;
  slideIds?: string[];
}) {
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

  const slides: Slide[] =
    (slideIds ?? []).map((id) => ({
      sources: idToCandidates(id),
    })) || [];

  const hero = slides.length > 0 ? slides[0] : undefined;

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable
          onPress={() =>
            Linking.openURL(folderUrl).catch(() => {
              if (typeof window !== "undefined")
                (window as any).open?.(folderUrl, "_blank");
            })
          }
          style={styles.cta}
        >
          <Text style={styles.ctaText}>Open in Drive</Text>
        </Pressable>
      </View>

      {hero ? (
        <>
          <HeroImage
            slide={hero}
            onPress={() =>
              Linking.openURL(folderUrl).catch(() => {
                if (typeof window !== "undefined")
                  (window as any).open?.(folderUrl, "_blank");
              })
            }
          />
          {/* Optional: show a small collage below the hero using the rest of slides */}
          {slides.length > 1 && <HeroCollage slides={slides.slice(1)} />}
        </>
      ) : Platform.OS === "web" ? (
        <PrettyDriveEmbed folderId={folderId} />
      ) : (
        <NativeFallback folderUrl={folderUrl} />
      )}
    </View>
  );
}

/** ---------- Simple, reliable hero image that links to Drive ---------- */
function HeroImage({
  slide,
  onPress,
}: {
  slide: Slide;
  onPress: () => void;
}) {
  const { width } = useWindowDimensions();
  const maxW = Math.min(width - 24, 1200);
  const height = Math.max(Math.round(maxW * 0.56), 380);
  return (
    <Pressable onPress={onPress} style={{ alignSelf: "center" }}>
      <View
        style={{
          width: maxW,
          height,
          borderRadius: 18,
          overflow: "hidden",
          backgroundColor: "#f6f2eb",
          borderWidth: 1,
          borderColor: ACCENT,
        }}
      >
        <DriveImageSimple sources={slide.sources} />
      </View>
      <Text
        style={{
          textAlign: "center",
          marginTop: 10,
          color: PURPLE,
          fontWeight: "800",
        }}
      >
        View Full Gallery →
      </Text>
    </Pressable>
  );
}

/** Reusable image that iterates through multiple candidate URLs until one loads. */
function DriveImageSimple({ sources }: { sources: string[] }) {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const tryNext = () => {
    setLoaded(false);
    setIdx((i) => (i + 1 < sources.length ? i + 1 : i));
  };

  if (Platform.OS === "web") {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <img
          src={sources[idx]}
          referrerPolicy="no-referrer"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={tryNext}
        />
        {!loaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
            }}
          >
            <span style={{ color: "#161616" }}>Loading photo…</span>
          </div>
        )}
      </div>
    );
  }

  // Native
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Image
        source={{ uri: sources[idx] }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        onLoadEnd={() => setLoaded(true)}
        onError={tryNext}
      />
      {!loaded && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator />
          <Text style={{ color: INK, marginTop: 8 }}>Loading photo…</Text>
        </View>
      )}
    </View>
  );
}

/** ---------- Tight masonry collage for the remaining slides ---------- */
function HeroCollage({ slides }: { slides: Slide[] }) {
  const { width } = useWindowDimensions();

  const maxW = Math.min(width - 24, 1200);
  const columns = width < 640 ? 2 : width < 1024 ? 3 : 4;
  const gap = COLLAGE_GAP;
  const colW = Math.floor((maxW - gap * (columns - 1)) / columns);

  const [sizes, setSizes] = useState<Record<number, { w: number; h: number }>>(
    {}
  );
  useEffect(() => {
    slides.forEach((s, i) => {
      // Try first candidate to estimate aspect; fallback to default if it errors
      Image.getSize(
        s.sources[0],
        (w, h) => setSizes((prev) => ({ ...prev, [i]: { w, h } })),
        () => setSizes((prev) => ({ ...prev, [i]: { w: 3, h: 2 } }))
      );
    });
  }, [slides]);

  const cols: Array<{ i: number; h: number }>[] = Array.from(
    { length: columns },
    () => []
  );
  const heights = new Array(columns).fill(0);

  slides.forEach((_, i) => {
    const sz = sizes[i] ?? { w: 3, h: 2 };
    const targetH = Math.round((sz.h / sz.w) * colW);
    const k = heights.indexOf(Math.min(...heights));
    cols[k].push({ i, h: targetH });
    heights[k] += targetH + gap;
  });

  return (
    <View style={[styles.collageWrap, { width: maxW }]}>
      <View style={[styles.collageRow, { gap }]}>
        {cols.map((col, ci) => (
          <View key={ci} style={{ width: colW, gap }}>
            {col.map(({ i, h }) => (
              <View
                key={i}
                style={{
                  width: colW,
                  height: h,
                  backgroundColor: "#f6f2eb",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <CollageImage sources={slides[i].sources} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

/** Smaller image component for the collage that also falls forward on errors. */
function CollageImage({ sources }: { sources: string[] }) {
  const [idx, setIdx] = useState(0);
  const tryNext = () => setIdx((i) => (i + 1 < sources.length ? i + 1 : i));

  if (Platform.OS === "web") {
    return (
      <img
        src={sources[idx]}
        referrerPolicy="no-referrer"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        alt=""
        onError={tryNext}
      />
    );
  }
  return (
    <Image
      source={{ uri: sources[idx] }}
      style={{ width: "100%", height: "100%" }}
      resizeMode="cover"
      onError={tryNext}
    />
  );
}

/** ---------- Drive embed fallback ---------- */
function PrettyDriveEmbed({ folderId }: { folderId: string }) {
  const { width } = useWindowDimensions();
  const frameW = Math.min(width - 24, 1200);
  const frameH = Math.max(Math.round(frameW * 0.62), 640);
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={[styles.embedWrap, { width: frameW, height: frameH }]}>
      {/* @ts-ignore */}
      <iframe
        src={`https://drive.google.com/embeddedfolderview?id=${folderId}#grid`}
        style={{ width: "100%", height: "100%", border: 0 }}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator />
          <Text style={{ color: INK, marginTop: 8 }}>Loading gallery…</Text>
        </View>
      )}
    </View>
  );
}

function NativeFallback({ folderUrl }: { folderUrl: string }) {
  return (
    <View style={styles.stateCard}>
      <Text style={styles.errorTitle}>Web gallery shown on website</Text>
      <Text style={styles.emptyBody}>
        On native apps we don’t embed Google Drive. Tap below to open the folder.
      </Text>
      <Pressable
        style={{ marginTop: 10 }}
        onPress={() =>
          Linking.openURL(folderUrl).catch(() => {
            if (typeof window !== "undefined")
              (window as any).open?.(folderUrl, "_blank");
          })
        }
      >
        <Text style={{ color: PURPLE, fontWeight: "800" }}>
          Open Google Drive Folder →
        </Text>
      </Pressable>
    </View>
  );
}

/** ------------------------ Styles ------------------------ */
const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  pageHeader: { paddingTop: 24, paddingBottom: 12, alignItems: "center" },
  h1: {
    color: PURPLE,
    fontWeight: "900",
    fontSize: 48,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  kicker: { color: INK, fontWeight: "900", letterSpacing: 1  },

  sectionCard: {
    backgroundColor: "#fffdf8",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ACCENT,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: INK },
  cta: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#f1e9da",
    borderWidth: 1,
    borderColor: ACCENT,
  },
  ctaText: { fontWeight: "900", color: PURPLE, fontSize: 14 },

  collageWrap: { alignSelf: "center", marginTop: 14 },
  collageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  embedWrap: {
    alignSelf: "center",
    backgroundColor: "#fffdf8",
    borderRadius: 0,
    borderWidth: 0,
    position: "relative",
    width: "100%",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

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
    marginTop: 8,
  },
  emptyBody: { marginTop: 4, color: INK, textAlign: "center", lineHeight: 20 },
  errorTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#a00",
    textAlign: "center",
  },
});

export { };

