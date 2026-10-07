import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { GoldDivider } from "@/components/GoldDivider";
import { BD, FS, GRID_PAD, LS, RD, SHADOW, SP } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";

const MENU_ITEMS = [
  { icon: "package"   as const, label: "TRACK ORDER",      path: "/track" },
  { icon: "mail"      as const, label: "CONTACT US",       path: "/contact" },
  { icon: "info"      as const, label: "FAQ",              path: "/faq" },
  { icon: "truck"     as const, label: "SHIPPING INFO",    path: "/shipping" },
  { icon: "maximize"  as const, label: "SIZE GUIDE",       path: "/size-guide" },
  { icon: "users"     as const, label: "COMMUNITY",        path: "/community" },
  { icon: "book-open" as const, label: "OUR STORY",        path: "/story" },
  { icon: "globe"     as const, label: "EGYPTIAN CULTURE", path: "/culture" },
  { icon: "briefcase" as const, label: "CAREERS",          path: "/careers" },
];

const BRAND_STORY = [
  { glyph: "𓂀", title: "ANCIENT ROOTS",   text: "Born from the cradle of civilization, wearing 5,000 years of history." },
  { glyph: "𓋹", title: "MODERN STREETS",  text: "Egyptian symbolism reinterpreted for contemporary urban fashion." },
  { glyph: "𓇯", title: "SACRED CRAFT",    text: "Every piece is a wearable artifact. Premium quality, limitless heritage." },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      {/* Dark brand header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + SP.md, backgroundColor: colors.foreground },
        ]}
      >
        <View style={[styles.glyphCircle, { borderColor: "rgba(200,157,41,0.35)" }]}>
          <Text style={[styles.glyphRow, { color: colors.primary }]}>𓂀</Text>
        </View>
        <Text style={[styles.brandName, { color: colors.background }]}>GREECE</Text>
        <Text style={[styles.brandTagline, { color: colors.primary }]}>EGYPTIAN STREETWEAR</Text>
        <Text style={[styles.brandSub, { color: "rgba(253,248,239,0.45)" }]}>Maadi, Cairo, Egypt</Text>
      </View>

      {/* Quick links */}
      <View style={[styles.section, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>QUICK LINKS</Text>
        <View
          style={[
            styles.menuCard,
            { ...SHADOW.sm },
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {MENU_ITEMS.map((item, i) => (
            <React.Fragment key={item.label}>
              <Pressable
                style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }]}
                onPress={() => router.push(item.path as any)}
              >
                <View style={[styles.menuIconWrapper, { backgroundColor: colors.primary + "18" }]}>
                  <Feather name={item.icon} size={16} color={colors.primary} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </Pressable>
              {i < MENU_ITEMS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Brand story cards */}
      <View style={[styles.section, { backgroundColor: colors.background }]}>
        <GoldDivider />
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>OUR STORY</Text>
        <View style={styles.storyCards}>
          {BRAND_STORY.map((s) => (
            <View
              key={s.title}
              style={[
                styles.storyCard,
                { ...SHADOW.xs },
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.storyGlyph, { color: colors.primary }]}>{s.glyph}</Text>
              <Text style={[styles.storyTitle, { color: colors.foreground }]}>{s.title}</Text>
              <Text style={[styles.storyText, { color: colors.mutedForeground }]}>{s.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact banner */}
      <View style={[styles.contactBanner, { backgroundColor: colors.foreground }]}>
        <GoldDivider />
        <Text style={[styles.contactTitle, { color: colors.primary }]}>GET IN TOUCH</Text>
        {[
          { icon: "map-pin" as const, text: "Maadi, Cairo, Egypt" },
          { icon: "mail"    as const, text: "info@greece-hieroglyphs.com" },
          { icon: "clock"   as const, text: "Sun–Thu 10am–8pm EET" },
        ].map((c) => (
          <View key={c.text} style={styles.contactRow}>
            <View style={[styles.contactIconBg, { backgroundColor: "rgba(200,157,41,0.12)" }]}>
              <Feather name={c.icon} size={13} color={colors.primary} />
            </View>
            <Text style={[styles.contactText, { color: colors.secondary }]}>{c.text}</Text>
          </View>
        ))}
        <GoldDivider glyph="𓋹" />
        <Text style={[styles.footerText, { color: "rgba(253,248,239,0.3)" }]}>
          © 2025 GREECE. All rights reserved.
        </Text>
      </View>

      <View style={{ height: Platform.OS === "web" ? 100 : 90 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: GRID_PAD,
    paddingBottom: SP.xxxl,
    alignItems: "center",
    gap: SP.xs + 2,
  },
  glyphCircle: {
    width: 72,
    height: 72,
    borderRadius: RD.circle,
    borderWidth: BD.thick,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SP.xs,
  },
  glyphRow: {
    fontSize: FS.h2,
  },
  brandName: {
    fontSize: FS.hero,
    fontFamily: "Cinzel_900Black",
    letterSpacing: 4,
  },
  brandTagline: {
    fontSize: FS.xs,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.ultra,
  },
  brandSub: {
    fontSize: FS.sm,
    fontFamily: "Inter_400Regular",
  },
  section: {
    padding: GRID_PAD,
    gap: SP.md,
  },
  sectionTitle: {
    fontSize: FS.base,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.widest,
  },
  menuCard: {
    borderWidth: BD.thin,
    borderRadius: RD.md,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SP.md,
    paddingHorizontal: GRID_PAD,
    paddingVertical: SP.md + 2,
  },
  menuIconWrapper: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RD.sm,
  },
  menuLabel: {
    flex: 1,
    fontSize: FS.sm,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.wider,
  },
  divider: {
    height: 1,
    marginHorizontal: GRID_PAD,
  },
  storyCards: {
    gap: SP.sm,
  },
  storyCard: {
    padding: GRID_PAD,
    borderWidth: BD.thin,
    borderRadius: RD.md,
    gap: SP.xs + 2,
  },
  storyGlyph: { fontSize: FS.xxxl },
  storyTitle: {
    fontSize: FS.md,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.wider,
  },
  storyText: {
    fontSize: FS.base,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  contactBanner: {
    padding: SP.xxl,
    gap: SP.md,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: FS.lg,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.ultra,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SP.sm,
  },
  contactIconBg: {
    width: 28,
    height: 28,
    borderRadius: RD.circle,
    alignItems: "center",
    justifyContent: "center",
  },
  contactText: {
    fontSize: FS.base,
    fontFamily: "Inter_400Regular",
  },
  footerText: {
    fontSize: FS.xs,
    fontFamily: "Inter_400Regular",
    letterSpacing: LS.normal,
    textAlign: "center",
  },
});
