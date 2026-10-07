import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { GoldDivider } from "@/components/GoldDivider";
import { BD, COL2, FS, GRID_GAP, GRID_PAD, LS, RD, SHADOW, SP } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";

const TIMELINE = [
  { year: "3100 BC", title: "THE ANCIENT INSPIRATION", desc: "Egyptian pharaohs adorned themselves in symbols of power — the Ankh, the Eye of Horus, the Scarab. These weren't just decorations; they were statements of identity and authority." },
  { year: "2021",    title: "THE VISION",   desc: "In the streets of Cairo, two designers looked at ancient temple walls and asked: what if these symbols lived on hoodies, tees, and jackets? The seed of GREECE was planted." },
  { year: "2022",    title: "THE BRAND",    desc: "GREECE launched its first collection — 6 pieces, all sold out in 48 hours. Cairo's streets confirmed what we believed: people hunger for fashion that honors their heritage." },
  { year: "2023",    title: "THE COMMUNITY",desc: "10,000 modern pharaohs joined the movement. GREECE expanded to 12 core pieces and began shipping across Egypt and the Arab world." },
  { year: "2024+",   title: "THE FUTURE",   desc: "We're building more than a brand — we're building a cultural movement. Ancient power, modern form. The revolution continues." },
];

const VALUES = [
  { glyph: "𓋹", title: "HERITAGE FIRST",  desc: "Every stitch honors thousands of years of Egyptian culture. We never compromise on cultural authenticity." },
  { glyph: "𓇳", title: "BUILT TO LAST",   desc: "Like the pyramids, our garments are engineered for longevity. Premium materials, uncompromising construction." },
  { glyph: "𓂀", title: "STREET REBELLION",desc: "We blend ancient authority with modern defiance. Fashion is protest. Wear your roots loud." },
  { glyph: "𓅃", title: "MADE WITH PRIDE", desc: "Proudly designed in Cairo. We celebrate Egyptian craftsmanship and support local artisans." },
  { glyph: "𓊽", title: "FOR THE CULTURE", desc: "GREECE is for anyone who carries the fire of Egyptian ancestry in their DNA — wherever they are in the world." },
  { glyph: "𓆣", title: "ALWAYS WATCHING", desc: "Like the Eye of Horus, we guard cultural integrity. No appropriation, only authentic celebration." },
];

export default function StoryScreen() {
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
        <Text style={[styles.glyphs, { color: colors.primary }]}>𓂀 𓋹 𓇯</Text>
        <Text style={[styles.title, { color: colors.background }]}>OUR STORY</Text>
        <Text style={[styles.sub, { color: "rgba(253,248,239,0.65)" }]}>
          Born from the cradle of civilization.{"\n"}Built for the streets of today.
        </Text>
      </View>

      {/* Timeline */}
      <View style={[styles.section, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>THE TIMELINE</Text>
        <GoldDivider />
        {TIMELINE.map((t) => (
          <View key={t.year} style={styles.timelineItem}>
            <View style={[styles.yearBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.yearText, { color: colors.primaryForeground }]}>{t.year}</Text>
            </View>
            <View style={[styles.timelineContent, { borderLeftColor: colors.primary + "40" }]}>
              <Text style={[styles.timelineTitle, { color: colors.foreground }]}>{t.title}</Text>
              <Text style={[styles.timelineDesc, { color: colors.mutedForeground }]}>{t.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Values grid */}
      <View style={[styles.section, { backgroundColor: colors.foreground }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>OUR VALUES</Text>
        <GoldDivider />
        <View style={styles.valuesGrid}>
          {VALUES.map((v) => (
            <View
              key={v.title}
              style={[
                styles.valueCard,
                { width: COL2, borderColor: "rgba(200,157,41,0.25)", backgroundColor: "rgba(255,255,255,0.04)" },
              ]}
            >
              <Text style={[styles.valueGlyph, { color: colors.primary }]}>{v.glyph}</Text>
              <Text style={[styles.valueTitle, { color: colors.background }]}>{v.title}</Text>
              <Text style={[styles.valueDesc, { color: "rgba(253,248,239,0.6)" }]}>{v.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: Platform.OS === "web" ? 100 : 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { padding: GRID_PAD, paddingBottom: SP.xxxl, gap: SP.sm },
  backBtn: {
    marginBottom: SP.sm,
    width: 36,
    height: 36,
    borderRadius: RD.circle,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  glyphs: { fontSize: FS.xxl, letterSpacing: 6 },
  title: { fontSize: FS.h1, fontFamily: "Cinzel_900Black", letterSpacing: LS.widest },
  sub: { fontSize: FS.lg, fontFamily: "Inter_400Regular", lineHeight: 22 },
  section: { padding: GRID_PAD, gap: GRID_PAD },
  sectionTitle: { fontSize: FS.lg, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
  timelineItem: { flexDirection: "row", gap: SP.md, alignItems: "flex-start" },
  yearBadge: {
    paddingHorizontal: SP.sm,
    paddingVertical: SP.xs,
    minWidth: 64,
    alignItems: "center",
    borderRadius: RD.sm,
  },
  yearText: { fontSize: FS.xs, fontFamily: "Cinzel_700Bold", letterSpacing: LS.normal },
  timelineContent: {
    flex: 1,
    borderLeftWidth: BD.thick,
    paddingLeft: SP.lg,
    paddingBottom: GRID_PAD,
    gap: SP.xs,
  },
  timelineTitle: { fontSize: FS.md, fontFamily: "Cinzel_700Bold", letterSpacing: LS.wide },
  timelineDesc: { fontSize: FS.base, fontFamily: "Inter_400Regular", lineHeight: 20 },
  valuesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
    justifyContent: "space-between",
  },
  valueCard: {
    borderWidth: BD.thin,
    borderRadius: RD.md,
    padding: SP.lg,
    gap: SP.xs + 2,
  },
  valueGlyph: { fontSize: FS.h3 },
  valueTitle: { fontSize: FS.xs, fontFamily: "Cinzel_700Bold", letterSpacing: LS.wider },
  valueDesc: { fontSize: FS.sm, fontFamily: "Inter_400Regular", lineHeight: 17 },
});
