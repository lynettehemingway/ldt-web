// app/merch.tsx
import React, { useMemo, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type ImageSourcePropType, // <-- add type
} from "react-native";
import Header from "../app/header";

// use require() to avoid TS "no module declarations" error for png
const h = require("../assets/media/one.png");

const BRAND_SERIF =
  Platform.OS === "web" ? "var(--brand-serif, Georgia, serif)" : "serif";

const PAPER = "#f6f1ea";
const INK = "#161616";
const ACCENT = "#d9cdbb";
const PURPLE = "#6f00ff";

const TABLET_BP = 640;
const DESKTOP_BP = 960;

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: ImageSourcePropType;   // <-- fix type
  link: string;
};

type Option = { value: string; label: string };

const CATEGORIES: Option[] = [
  { value: "all", label: "All" },
  { value: "tees", label: "Tees" },
  { value: "hoodies", label: "Hoodies" },
  { value: "stickers", label: "Stickers" },
  { value: "accessories", label: "Accessories" },
];

const PRODUCTS: Product[] = [
  {
    id: "tee-purple",
    name: "Coming Soon",
    price: 25,
    category: "tees",
    description: "Stay Tuned!",
    image: h, // <-- now valid
    link: "https://instagram.com/uf.ldt",
  },
];

const currency = (n: number) => `$${n.toFixed(2)}`;

export default function MerchPage() {
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const cols = width >= DESKTOP_BP ? 3 : width >= TABLET_BP ? 2 : 1;

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice();
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, search]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PAPER }}>
      <Header />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 80 }}
        showsVerticalScrollIndicator
      >
        {/* Page Title */}
        <View style={[s.pageHeader, s.container]}>
          <Text style={[s.pageHeaderTitle, { textAlign: "center", width: "100%" }]}>LDT MERCH</Text>
        </View>

        {/* Toolbar */}
        <View style={[s.container, s.toolbar]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {CATEGORIES.map((c) => (
              <Pill
                key={c.value}
                text={c.label}
                active={category === c.value}
                onPress={() => setCategory(c.value)}
              />
            ))}
          </ScrollView>
          <Input value={search} onChange={setSearch} placeholder="Search merch…" />
        </View>

        {/* Grid */}
        <View style={[s.container, { marginTop: 18 }]}>
          <Grid columns={cols} gap={20}>
            {filtered.map((p) => (
              <Card key={p.id} product={p} />
            ))}
          </Grid>
          {filtered.length === 0 && (
            <View style={{ paddingVertical: 40 }}>
              <Text style={s.muted}>No items match that search.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Grid({
  columns = 2,
  gap = 12,
  children,
}: {
  columns?: number;
  gap?: number;
  children: React.ReactNode;
}) {
  const rows: React.ReactNode[][] = [];
  const cells = React.Children.toArray(children);
  for (let i = 0; i < cells.length; i += columns)
    rows.push(cells.slice(i, i + columns));
  return (
    <View style={{ gap }}>
      {rows.map((row, idx) => (
        <View key={idx} style={{ flexDirection: "row", gap }}>
          {row.map((cell, i) => (
            <View key={i} style={{ flex: 1 }}>
              {cell}
            </View>
          ))}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map((_, k) => (
              <View key={`sp-${k}`} style={{ flex: 1 }} />
            ))}
        </View>
      ))}
    </View>
  );
}

function Card({ product }: { product: Product }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(product.link)}
      style={({ hovered, pressed }) => [
        s.card,
        hovered && {
          transform: [{ translateY: -6 }],
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <Image source={product.image} style={{ width: "100%", height: 300 }} />
      <View style={s.cardBody}>
        <Text style={s.cardTitle}>{product.name}</Text>
        <Text style={s.price}>{currency(product.price)}</Text>
        <Text style={s.desc}>{product.description}</Text>
      </View>
    </Pressable>
  );
}

function Pill({
  text,
  active,
  onPress,
}: {
  text: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[s.pill, active && s.pillActive]}>
      <Text style={[s.pillTxt, active && { color: "white" }]}>{text}</Text>
    </Pressable>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={s.inputWrap}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={ACCENT}
        style={s.inputValue}
      />
    </View>
  );
}

const s = StyleSheet.create({
  pageHeader: { paddingTop: 32, paddingBottom: 16, alignItems: "center", backgroundColor: PAPER },
  pageHeaderTitle: {
    color: PURPLE,
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  container: { width: "100%", maxWidth: 1040, alignSelf: "center", paddingHorizontal: 16 },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },

  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ACCENT,
    backgroundColor: "#ffff",
  },
  pillActive: { backgroundColor: PURPLE },
  pillTxt: { color: INK, fontWeight: "600" },

  inputWrap: {
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 12,
    paddingHorizontal: 10,
    minWidth: 160,
    backgroundColor: "white",
  },
  inputValue: { color: INK, paddingVertical: 8 },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ACCENT,
    elevation: 2,
  },
  cardBody: { padding: 14, gap: 6 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: PURPLE },
  price: { fontWeight: "800", color: INK },
  desc: { fontSize: 13, color: "#333" },

  muted: { color: "#6b6b6b" },
});

export { };

