// app/contact_dock.tsx
// Collapsible corner contact dock with user-friendly Feedback modal (web + native, Expo Router)

import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ---- Brand colors ----
const PURPLE = "#6f00ff";
const PURPLE_SOFT = "#8d3dff";
const INK = "#161616";
const PAPER = "#f6f1ea";
const ACCENT = "#d9cdbb";
const DESKTOP_BREAKPOINT = 900;

const TEAM_EMAIL = "ufliondanceteam@gmail.com";
const FEEDBACK_ENDPOINT = "https://formspree.io/f/mwpnadjv";

type ContactKey = "discord" | "instagram" | "email" | "feedback";

type Item = {
  key: ContactKey;
  label: string;
  href: string;
  internal?: boolean;
};

const ITEMS: Item[] = [
  { key: "discord", label: "Discord", href: "https://discord.gg/zKkVwQqaFj" },
  { key: "instagram", label: "Instagram", href: "https://instagram.com/uf.ldt" },
  { key: "email", label: "Email", href: `mailto:${TEAM_EMAIL}` },
  { key: "feedback", label: "Feedback", href: "/feedback", internal: true },
];

// ---- Icons ----
function ItemIcon({ keyName, size = 18, color = INK }: { keyName: ContactKey; size?: number; color?: string }) {
  switch (keyName) {
    case "discord":
      return <FontAwesome5 name="discord" size={size} color={color} />;
    case "instagram":
      return <Feather name="instagram" size={size} color={color} />;
    case "email":
      return <Feather name="mail" size={size} color={color} />;
    case "feedback":
      return <MaterialCommunityIcons name="message-text-outline" size={size} color={color} />;
  }
}

function openMailto({
  to,
  subject,
  body,
  cc,
  bcc,
}: {
  to: string | string[];
  subject?: string;
  body?: string;
  cc?: string | string[];
  bcc?: string | string[];
}) {
  const list = (v?: string | string[]) =>
    !v ? undefined : Array.isArray(v) ? v.join(",") : v;

  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  if (cc) params.set("cc", list(cc)!);
  if (bcc) params.set("bcc", list(bcc)!);

  const mailtoUrl = `mailto:${list(to) ?? ""}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  if (Platform.OS === "web") {
    const a = document.createElement("a");
    a.href = mailtoUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    Linking.openURL(mailtoUrl);
  }
}

// ---- Validation helpers ----
const MAX_MESSAGE = 1000;
const MIN_MESSAGE = 10;
const isValidEmail = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const cleanPhone = (v: string) => v.replace(/[^\d()+\-.\s]/g, "");

// ---- Feedback modal ----
function FeedbackModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const errors = {
    message:
      !message.trim()
        ? "Please enter a message."
        : message.trim().length < MIN_MESSAGE
        ? `Message should be at least ${MIN_MESSAGE} characters.`
        : message.length > MAX_MESSAGE
        ? `Message must be ≤ ${MAX_MESSAGE} characters.`
        : "",
    email: !isValidEmail(email) ? "Please enter a valid email address." : "",
  };

  const canSubmit = !errors.message && !errors.email && !sending;

  const handleSubmit = async () => {
    setTouched({ message: true, email: true }); // reveal errors if any
    if (!canSubmit) return;

    setSending(true);
    setBanner(null);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
      to: TEAM_EMAIL,
      _subject: `UF LDT website feedback from ${name.trim() || "Anonymous"}`,
    };

    try {
      if (FEEDBACK_ENDPOINT) {
        const res = await fetch(FEEDBACK_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setBanner({ type: "ok", text: "Thanks! We received your feedback." });
      } else {
        const body = [
          `Name: ${payload.name || "(not provided)"}`,
          `Phone: ${payload.phone || "(not provided)"}`,
          `Email: ${payload.email || "(not provided)"}`,
          "",
          "Message:",
          payload.message,
        ].join("\n");
        openMailto({ to: TEAM_EMAIL, subject: payload._subject, body });
        setBanner({ type: "ok", text: "Opening your email app to send..." });
      }

      // Auto-close after a moment
      setTimeout(() => {
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setTouched({});
        setBanner(null);
        setSending(false);
        onClose();
      }, 1200);
    } catch (e) {
      setBanner({ type: "err", text: "Couldn’t send just now. Please try again or email us directly." });
      setSending(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <KeyboardAvoidingWrapper>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>Send Feedback</Text>
            <Text style={styles.modalSub}>
              Fields marked <Text style={{ color: PURPLE, fontWeight: "800" }}>*</Text> are required.
            </Text>

            {banner && (
              <View
                style={[
                  styles.banner,
                  banner.type === "ok" ? styles.bannerOk : styles.bannerErr,
                ]}
              >
                <Text style={styles.bannerText}>{banner.text}</Text>
              </View>
            )}

            <ScrollView contentContainerStyle={{ gap: 10 }} keyboardShouldPersistTaps="handled">
              <LabeledInput
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Optional"
                autoCapitalize="words"
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              />

              <LabeledInput
                label="Phone"
                value={phone}
                onChangeText={(v) => setPhone(cleanPhone(v))}
                placeholder="Optional"
                keyboardType="phone-pad"
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              />

              <LabeledInput
                label={<>Email</>}
                value={email}
                onChangeText={setEmail}
                placeholder="Optional (we’ll use it to reply)"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                error={touched.email ? errors.email : ""}
              />

              <LabeledInput
                label={
                  <>
                    Message <Text style={{ color: PURPLE, fontWeight: "800" }}>*</Text>
                  </>
                }
                value={message}
                onChangeText={(v) => setMessage(v.slice(0, MAX_MESSAGE))}
                placeholder="Tell us what's on your mind…"
                multiline
                numberOfLines={6}
                style={{ height: 140, textAlignVertical: "top" }}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                error={touched.message ? errors.message : ""}
                footerRight={
                  <Text style={styles.counter}>{message.length}/{MAX_MESSAGE}</Text>
                }
              />

              <View style={styles.modalActions}>
                <Pressable onPress={onClose} style={({ pressed }) => [styles.btnGhost, pressed && { opacity: 0.8 }]}>
                  <Text style={styles.btnGhostText}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                  style={({ pressed }) => [
                    styles.btnPrimary,
                    (!canSubmit || sending) && { opacity: 0.6 },
                    pressed && canSubmit && { transform: [{ scale: 0.98 }] },
                  ]}
                >
                  {sending ? <ActivityIndicator color={PAPER} /> : <Text style={styles.btnPrimaryText}>Send</Text>}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingWrapper>
      </View>
    </Modal>
  );
}

function KeyboardAvoidingWrapper({ children }: { children: React.ReactNode }) {
  if (Platform.OS === "ios") {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: "center", padding: 16 }}>
        {children}
      </KeyboardAvoidingView>
    );
  }
  return <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>{children}</View>;
}

function LabeledInput({
  label,
  error,
  footerRight,
  style,
  ...props
}: {
  label: React.ReactNode;
  error?: string;
  footerRight?: React.ReactNode;
  style?: any;
} & React.ComponentProps<typeof TextInput>) {
  const hasError = !!error;
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <Text style={{ color: INK, fontSize: 12, opacity: 0.75 }}>{label}</Text>
        {footerRight}
      </View>
      <TextInput
        {...props}
        placeholderTextColor="#777"
        style={[
          styles.input,
          hasError && { borderColor: "#d33", shadowColor: "#d33", shadowOpacity: 0.08, shadowRadius: 6 },
          style,
        ]}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// ---- Main dock ----
export default function ContactDock() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const [open, setOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // offset from edges (nudge left by increasing right)
  const bottom = Math.max(16, insets.bottom + 12);
  const right = Math.max(32, insets.right + 32);

  const content = useMemo(
    () => (
      <View pointerEvents="box-none" style={[StyleSheet.absoluteFillObject, { zIndex: 1000, elevation: 1000 }]}>
        <View style={[styles.cornerWrap, { bottom, right }]}>
          {/* Tray */}
          {open && (
            <View style={[styles.tray, isDesktop ? styles.trayDesktop : styles.trayMobile]}>
              {isDesktop ? (
                <>
                  <Text style={styles.trayTitle}>Contact</Text>

                  <ContactButton
                    label="Discord"
                    icon={<ItemIcon keyName="discord" />}
                    onPress={() =>
                      Platform.OS === "web"
                        ? window.open(ITEMS[0].href, "_blank", "noopener,noreferrer")
                        : Linking.openURL(ITEMS[0].href)
                    }
                  />

                  <ContactButton
                    label="Instagram"
                    icon={<ItemIcon keyName="instagram" />}
                    onPress={() =>
                      Platform.OS === "web"
                        ? window.open(ITEMS[1].href, "_blank", "noopener,noreferrer")
                        : Linking.openURL(ITEMS[1].href)
                    }
                  />

                  <ContactButton
                    label="Email"
                    icon={<ItemIcon keyName="email" />}
                    onPress={() =>
                      openMailto({
                        to: TEAM_EMAIL,
                        subject: "UF LDT Feedback",
                        body: "Hi UF LDT Team, ",
                      })
                    }
                  />

                  <ContactButton
                    label="Feedback"
                    icon={<ItemIcon keyName="feedback" />}
                    onPress={() => setShowFeedback(true)}
                  />
                </>
              ) : (
                // Mobile: mini icons
                <View style={styles.miniRow}>
                  <ContactMini onPress={() => (Platform.OS === "web" ? window.open(ITEMS[0].href, "_blank", "noopener,noreferrer") : Linking.openURL(ITEMS[0].href))} icon={<ItemIcon keyName="discord" />} />
                  <ContactMini onPress={() => (Platform.OS === "web" ? window.open(ITEMS[1].href, "_blank", "noopener,noreferrer") : Linking.openURL(ITEMS[1].href))} icon={<ItemIcon keyName="instagram" />} />
                  <ContactMini
                    onPress={() =>
                      openMailto({
                        to: TEAM_EMAIL,
                        subject: "Hello from the UF LDT website",
                        body: "Hi UF LDT Team,%0D%0A%0D%0A",
                      })
                    }
                    icon={<ItemIcon keyName="email" />}
                  />
                  <ContactMini onPress={() => setShowFeedback(true)} icon={<ItemIcon keyName="feedback" />} />
                </View>
              )}
            </View>
          )}

          {/* Corner toggle */}
          <Pressable
            onPress={() => setOpen((s) => !s)}
            accessibilityLabel="Contact dock"
            accessibilityHint={open ? "Collapse contact options" : "Expand contact options"}
            style={({ pressed }) => [styles.cornerButton, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <Feather name={open ? "chevrons-right" : "message-square"} size={20} color={PAPER} />
          </Pressable>
        </View>

        {/* Feedback modal */}
        <FeedbackModal visible={showFeedback} onClose={() => setShowFeedback(false)} />
      </View>
    ),
    [open, isDesktop, bottom, right, showFeedback]
  );

  return content;
}

// ---- Buttons ----
function ContactButton({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <View style={styles.btn}>
        {icon}
        <Text style={styles.btnText}>{label}</Text>
      </View>
    </Pressable>
  );
}

function ContactMini({ icon, onPress }: { icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <View style={styles.miniBtn}>{icon}</View>
    </Pressable>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  cornerWrap: { position: "absolute", alignItems: "flex-end" },

  cornerButton: {
    width: 46,
    height: 46,
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopRightRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PURPLE,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: PURPLE_SOFT,
  },

  tray: {
    backgroundColor: PAPER,
    borderWidth: 1,
    borderColor: ACCENT,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    marginBottom: 8,
    borderTopColor: PURPLE_SOFT,
    borderTopWidth: 3,
  },
  trayDesktop: {
    width: 240,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: "stretch",
    gap: 8,
  },
  trayMobile: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  trayTitle: {
    fontSize: 12,
    color: INK,
    opacity: 0.7,
    marginBottom: 6,
    letterSpacing: 1,
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: ACCENT,
  },
  btnText: { color: INK, fontSize: 14, fontWeight: "600" },

  miniRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  miniBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: ACCENT,
  },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center" },
  modalCard: {
    backgroundColor: PAPER,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ACCENT,
    maxWidth: 580,
    width: "100%",
    alignSelf: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: INK },
  modalSub: { fontSize: 12, color: INK, opacity: 0.7, marginBottom: 4 },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: INK,
  },
  errorText: { color: "#d33", fontSize: 12 },

  banner: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 4,
  },
  bannerOk: { backgroundColor: "#e8f7ed", borderColor: "#b6e0c2" },
  bannerErr: { backgroundColor: "#fdeaea", borderColor: "#f2c0c0" },
  bannerText: { color: INK },

  modalActions: { marginTop: 6, flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  btnPrimary: { backgroundColor: PURPLE, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16 },
  btnPrimaryText: { color: PAPER, fontWeight: "700" },
  btnGhost: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: ACCENT,
    backgroundColor: "#fff",
  },
  btnGhostText: { color: INK, fontWeight: "600" },

  counter: { fontSize: 12, color: INK, opacity: 0.6 },
});
