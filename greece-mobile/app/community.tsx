import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { GoldDivider } from "@/components/GoldDivider";
import { BD, FS, GRID_PAD, LS, RD, SHADOW, SP } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";

const TESTIMONIALS = [
  { name: "MAYA K.",    location: "Zamalek, Cairo",    quote: "GREECE gave me a way to wear my Egyptian identity with pride. The Horus Hoodie is my signature piece everywhere I go.", rating: 5 },
  { name: "OMAR B.",    location: "Alexandria",         quote: "Finally, a brand that understands Egyptian culture on a deep level. I've learned so much about my heritage through the designs.", rating: 5 },
  { name: "SARA M.",    location: "New Cairo",          quote: "The quality is insane for the price. I've washed my Ankh Tee 30 times and it still looks brand new.", rating: 5 },
  { name: "HASSAN R.",  location: "Heliopolis, Cairo",  quote: "Wearing GREECE abroad always sparks conversations about Egypt. It's become my ambassador piece when I travel.", rating: 5 },
  { name: "LAYLA A.",   location: "Maadi, Cairo",       quote: "The Nefertiti Hoodie was a birthday gift from my partner and it's my most-worn piece.", rating: 5 },
  { name: "KAREEM S.",  location: "Giza",               quote: "I've been waiting for an Egyptian streetwear brand this authentic my whole life. GREECE bridges a gap that needed bridging.", rating: 5 },
];

const STATS = [
  { value: "10K+", label: "MODERN PHARAOHS" },
  { value: "50K+", label: "INSTAGRAM FOLLOWERS" },
  { value: "98%",  label: "SATISFACTION RATE" },
  { value: "30+",  label: "CITIES REACHED" },
];

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
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
        <View style={[styles.glyphCircle, { borderColor: "rgba(200,157,41,0.3)" }]}>
          <Text style={[styles.glyphs, { color: colors.primary }]}>𓂀</Text>
        </View>
        <Text style={[styles.title, { color: colors.background }]}>THE COMMUNITY</Text>
        <Text style={[styles.sub, { color: "rgba(253,248,239,0.65)" }]}>
          10,000+ Modern Pharaohs and growing
        </Text>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: colors.primary }]}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.primaryForeground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.primaryForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Testimonials */}
      <View style={[styles.section, { backgroundColor: colors.background }]}>
        <GoldDivider />
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>WHAT THE PHARAOHS SAY</Text>
        {TESTIMONIALS.map((t) => (
          <View
            key={t.name}
            style={[
              styles.card,
              { ...SHADOW.xs },
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardNameBlock}>
                <View style={[styles.avatarCircle, { backgroundColor: colors.primary + "20" }]}>
                  <Text style={[styles.avatarLetter, { color: colors.primary }]}>
                    {t.name[0]}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.cardName, { color: colors.foreground }]}>{t.name}</Text>
                  <Text style={[styles.cardLocation, { color: colors.mutedForeground }]}>{t.location}</Text>
                </View>
              </View>
              <View style={styles.stars}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Feather key={i} name="star" size={11} color={colors.primary} />
                ))}
              </View>
            </View>
            <Text style={[styles.cardQuote, { color: colors.mutedForeground }]}>"{t.quote}"</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View
        style={[
          styles.ctaBanner,
          { ...SHADOW.sm },
          { backgroundColor: colors.accent, marginHorizontal: GRID_PAD, marginBottom: GRID_PAD, borderRadius: RD.md },
        ]}
      >
        <Text style={[styles.ctaTitle, { color: colors.accentForeground }]}>JOIN THE MOVEMENT</Text>
        <Text style={[styles.ctaText, { color: "rgba(253,248,239,0.8)" }]}>
          Tag your GREECE looks with #ModernPharaohs and get featured on our page.
        </Text>
        <Text style={[styles.ctaHandle, { color: colors.primary }]}>@greece-hieroglyphs.com</Text>
      </View>

      <View style={{ height: Platform.OS === "web" ? 100 : 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { padding: GRID_PAD, paddingBottom: SP.xxxl - SP.xs, gap: SP.sm, alignItems: "center" },
  backBtn: {
    alignSelf: "flex-start",
    width: 36,
    height: 36,
    borderRadius: RD.circle,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SP.sm,
  },
  glyphCircle: {
    width: 64,
    height: 64,
    borderRadius: RD.circle,
    borderWidth: BD.thick,
    alignItems: "center",
    justifyContent: "center",
  },
  glyphs: { fontSize: FS.xxl },
  title: { fontSize: FS.h2, fontFamily: "Cinzel_900Black", letterSpacing: LS.widest },
  sub: { fontSize: FS.base, fontFamily: "Inter_400Regular" },
  statsRow: { flexDirection: "row", paddingVertical: GRID_PAD },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: FS.lg, fontFamily: "Cinzel_700Bold" },
  statLabel: {
    fontSize: FS.micro - 1,
    fontFamily: "Inter_700Bold",
    letterSpacing: LS.normal,
    textAlign: "center",
    marginTop: SP.xs - 2,
    opacity: 0.8,
  },
  section: { padding: GRID_PAD, gap: SP.md },
  sectionTitle: { fontSize: FS.base, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
  card: { borderWidth: BD.thin, borderRadius: RD.md, padding: GRID_PAD, gap: SP.md },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardNameBlock: { flexDirection: "row", alignItems: "center", gap: SP.sm },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: RD.circle,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { fontSize: FS.base, fontFamily: "Cinzel_700Bold" },
  cardName: { fontSize: FS.md, fontFamily: "Cinzel_700Bold", letterSpacing: LS.wide },
  cardLocation: { fontSize: FS.xs, fontFamily: "Inter_400Regular" },
  stars: { flexDirection: "row", gap: SP.xs - 3 },
  cardQuote: {
    fontSize: FS.base,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    fontStyle: "italic",
  },
  ctaBanner: { padding: SP.xxl, gap: SP.sm, alignItems: "center" },
  ctaTitle: { fontSize: FS.xl, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
  ctaText: { fontSize: FS.base, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  ctaHandle: { fontSize: FS.lg, fontFamily: "Inter_700Bold" },
});
