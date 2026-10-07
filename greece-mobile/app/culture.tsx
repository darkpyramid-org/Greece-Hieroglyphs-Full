import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { GoldDivider } from "@/components/GoldDivider";
import { BD, FS, GRID_PAD, LS, RD, SHADOW, SP } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";

const SYMBOLS = [
  { symbol: "𓋹", name: "ANKH",          meaning: "Eternal Life & Power",        desc: "The Ankh is the ancient Egyptian symbol for life, immortality, and divine power. Carried by pharaohs and gods alike." },
  { symbol: "𓂀", name: "EYE OF HORUS",  meaning: "Protection & Royal Power",     desc: "Wedjat — the Eye of Horus — is a symbol of protection, royal power, and good health. Our brand's guiding symbol." },
  { symbol: "𓁿", name: "SCARAB",         meaning: "Transformation & Rebirth",     desc: "The scarab beetle (Khepri) was the god of the rising sun. Egyptians carved scarabs as symbols of regeneration." },
  { symbol: "𓇳", name: "SUN DISC (RA)", meaning: "The Source of All Power",      desc: "Ra, the sun god, was the most powerful deity. The sun disc represents creation, warmth, and omnipotent power." },
  { symbol: "𓅃", name: "FALCON (HORUS)",meaning: "Kingship & Divine Authority",  desc: "The falcon was the manifestation of Horus, god of the sky and kingship. Every pharaoh was the living Horus." },
  { symbol: "𓊖", name: "CARTOUCHE",     meaning: "Identity & Immortality",       desc: "A cartouche is an oval enclosure containing a pharaoh's royal name in hieroglyphs — a mark of immortality." },
];

const GODS = [
  { name: "HORUS",   role: "Sky God & Protector",        info: "God of the sky, war, and hunting. Patron of pharaohs. His eye (the Wedjat) is one of the most powerful symbols of protection in history." },
  { name: "RA",      role: "Sun God & Creator",           info: "The paramount deity of ancient Egypt. Creator of all life and order." },
  { name: "OSIRIS",  role: "God of Death & Resurrection", info: "Ruler of the underworld and judge of the dead. His resurrection gave hope of eternal life beyond death." },
  { name: "ANUBIS",  role: "God of Mummification",        info: "The jackal-headed guide of souls. He weighed the hearts of the dead against the feather of Ma'at." },
  { name: "THOTH",   role: "God of Wisdom & Writing",     info: "The ibis-headed god of knowledge, writing, science, and judgment. Inventor of hieroglyphs." },
  { name: "SEKHMET", role: "Goddess of War & Healing",    info: "The lion-headed goddess of war — also of healing. She embodied both destruction and protection." },
];

export default function CultureScreen() {
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
            backgroundColor: colors.accent,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.accentForeground} />
        </Pressable>
        <Text style={[styles.glyphs, { color: colors.primary }]}>𓂀 𓋹 𓇳 𓅃</Text>
        <Text style={[styles.title, { color: colors.accentForeground }]}>EGYPTIAN CULTURE</Text>
        <Text style={[styles.sub, { color: "rgba(253,248,239,0.7)" }]}>
          The symbolism behind the streetwear
        </Text>
      </View>

      {/* Sacred symbols */}
      <View style={[styles.section, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>SACRED SYMBOLS</Text>
        <GoldDivider />
        {SYMBOLS.map((s) => (
          <View
            key={s.name}
            style={[
              styles.symbolCard,
              { ...SHADOW.sm },
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.glyphBox, { backgroundColor: colors.primary + "14" }]}>
              <Text style={[styles.symbolGlyph, { color: colors.primary }]}>{s.symbol}</Text>
            </View>
            <View style={styles.symbolInfo}>
              <Text style={[styles.symbolName, { color: colors.foreground }]}>{s.name}</Text>
              <Text style={[styles.symbolMeaning, { color: colors.primary }]}>{s.meaning}</Text>
              <Text style={[styles.symbolDesc, { color: colors.mutedForeground }]}>{s.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Gods — dark section */}
      <View style={[styles.section, { backgroundColor: colors.foreground }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>THE GODS</Text>
        <GoldDivider />
        {GODS.map((g) => (
          <View
            key={g.name}
            style={[styles.godCard, { borderColor: "rgba(200,157,41,0.25)", backgroundColor: "rgba(255,255,255,0.04)" }]}
          >
            <Text style={[styles.godName, { color: colors.primary }]}>{g.name}</Text>
            <Text style={[styles.godRole, { color: colors.secondary }]}>{g.role}</Text>
            <Text style={[styles.godInfo, { color: "rgba(253,248,239,0.6)" }]}>{g.info}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: Platform.OS === "web" ? 100 : 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { padding: GRID_PAD, paddingBottom: SP.xxxl - SP.xs, gap: SP.xs + 2 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RD.circle,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SP.xs,
  },
  glyphs: { fontSize: FS.xxl, letterSpacing: 6 },
  title: { fontSize: FS.h2, fontFamily: "Cinzel_900Black", letterSpacing: LS.widest },
  sub: { fontSize: FS.base, fontFamily: "Inter_400Regular" },
  section: { padding: GRID_PAD, gap: SP.md },
  sectionTitle: { fontSize: FS.lg, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
  symbolCard: {
    flexDirection: "row",
    borderWidth: BD.thin,
    borderRadius: RD.md,
    padding: SP.md,
    gap: SP.md,
    alignItems: "flex-start",
  },
  glyphBox: {
    width: 48,
    height: 48,
    borderRadius: RD.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  symbolGlyph: { fontSize: FS.xxl },
  symbolInfo: { flex: 1, gap: SP.xs },
  symbolName: { fontSize: FS.md, fontFamily: "Cinzel_700Bold", letterSpacing: LS.wide },
  symbolMeaning: { fontSize: FS.xs, fontFamily: "Inter_500Medium", letterSpacing: LS.normal },
  symbolDesc: { fontSize: FS.md, fontFamily: "Inter_400Regular", lineHeight: 19 },
  godCard: { borderWidth: BD.thin, borderRadius: RD.sm, padding: SP.lg, gap: SP.xs + 1 },
  godName: { fontSize: FS.lg, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
  godRole: { fontSize: FS.sm, fontFamily: "Inter_500Medium" },
  godInfo: { fontSize: FS.md, fontFamily: "Inter_400Regular", lineHeight: 19 },
});
