import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { GoldDivider } from "@/components/GoldDivider";
import { BD, BTN_H, FS, GRID_PAD, LS, RD, SHADOW, SP } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";
import { apiPost, notify } from "@/lib/api";

export default function ContactScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Name, email and message are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiPost("/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        ...(form.subject.trim() ? { subject: form.subject.trim() } : {}),
        message: form.message.trim(),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setForm({ name: "", email: "", subject: "", message: "" });
      notify("Message Sent 𓂀", "We'll get back to you within 24 hours.");
      router.back();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
      bottomOffset={16}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === "web" ? 67 + GRID_PAD : insets.top + GRID_PAD,
            backgroundColor: colors.foreground,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.background} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.background }]}>GET IN TOUCH</Text>
        <Text style={[styles.headerSub, { color: colors.primary }]}>
          𓂀 WE'D LOVE TO HEAR FROM YOU
        </Text>
      </View>

      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <GoldDivider />

        {/* Contact info */}
        <View style={styles.infoRow}>
          {[
            { icon: "map-pin" as const, text: "Maadi, Cairo, Egypt" },
            { icon: "mail"    as const, text: "info@greece-hieroglyphs.com" },
          ].map((c) => (
            <View
              key={c.text}
              style={[
                styles.infoChip,
                { ...SHADOW.xs },
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.infoIconBg, { backgroundColor: colors.primary + "14" }]}>
                <Feather name={c.icon} size={12} color={colors.primary} />
              </View>
              <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{c.text}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.formTitle, { color: colors.foreground }]}>SEND A MESSAGE</Text>

        {[
          { key: "name"    as const, label: "FULL NAME *",  placeholder: "Your name",            type: "default"       as const },
          { key: "email"   as const, label: "EMAIL *",      placeholder: "your@email.com",        type: "email-address" as const },
          { key: "subject" as const, label: "SUBJECT",      placeholder: "What's this about?",    type: "default"       as const },
        ].map((field) => (
          <View key={field.key} style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
            <TextInput
              value={form[field.key]}
              onChangeText={set(field.key)}
              placeholder={field.placeholder}
              placeholderTextColor={colors.mutedForeground}
              keyboardType={field.type}
              autoCapitalize={field.type === "email-address" ? "none" : "words"}
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  fontFamily: "Inter_400Regular",
                },
              ]}
            />
          </View>
        ))}

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>MESSAGE *</Text>
          <TextInput
            value={form.message}
            onChangeText={set("message")}
            placeholder="Tell us what's on your mind..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={5}
            style={[
              styles.textarea,
              {
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.card,
                fontFamily: "Inter_400Regular",
              },
            ]}
          />
        </View>

        {error ? (
          <View
            style={[
              styles.errorBox,
              { backgroundColor: "rgba(174,28,28,0.08)", borderColor: colors.destructive + "60" },
            ]}
          >
            <Feather name="alert-circle" size={14} color={colors.destructive} />
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            { ...SHADOW.gold },
            { backgroundColor: colors.foreground, opacity: pressed || loading ? 0.85 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <>
              <Feather name="send" size={16} color={colors.background} />
              <Text style={[styles.submitBtnText, { color: colors.background }]}>SEND MESSAGE</Text>
            </>
          )}
        </Pressable>
      </View>

      <View style={{ height: Platform.OS === "web" ? 100 : 60 }} />
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: GRID_PAD,
    paddingBottom: SP.xxl,
    gap: SP.xs,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RD.circle,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SP.sm,
  },
  headerTitle: { fontSize: FS.h3, fontFamily: "Cinzel_900Black", letterSpacing: LS.widest },
  headerSub: { fontSize: FS.xs, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
  content: { padding: GRID_PAD, gap: SP.md, flex: 1 },
  infoRow: { gap: SP.sm },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SP.sm,
    padding: SP.md,
    borderWidth: BD.thin,
    borderRadius: RD.md,
  },
  infoIconBg: {
    width: 28,
    height: 28,
    borderRadius: RD.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: { fontSize: FS.md, fontFamily: "Inter_400Regular" },
  formTitle: { fontSize: FS.base, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest, marginTop: SP.xs },
  fieldGroup: { gap: SP.xs + 2 },
  fieldLabel: { fontSize: FS.xxs, fontFamily: "Cinzel_700Bold", letterSpacing: LS.wider },
  input: {
    borderWidth: BD.thin,
    borderRadius: RD.sm,
    paddingHorizontal: SP.md,
    paddingVertical: SP.md + 1,
    fontSize: FS.lg,
  },
  textarea: {
    borderWidth: BD.thin,
    borderRadius: RD.sm,
    paddingHorizontal: SP.md,
    paddingVertical: SP.md,
    fontSize: FS.lg,
    minHeight: 120,
    textAlignVertical: "top",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: SP.sm,
    padding: SP.md,
    borderWidth: BD.thin,
    borderRadius: RD.sm,
  },
  errorText: { fontSize: FS.base, fontFamily: "Inter_400Regular", flex: 1 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SP.md,
    paddingVertical: SP.lg,
    minHeight: BTN_H.lg,
    borderRadius: RD.sm,
  },
  submitBtnText: { fontSize: FS.sm, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
});
