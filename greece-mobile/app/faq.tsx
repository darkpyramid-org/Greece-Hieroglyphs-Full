import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BD, FS, GRID_PAD, LS, RD, SHADOW, SP } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";

const FAQ_CATEGORIES = [
  {
    category: "ORDERS & PAYMENTS",
    icon: "credit-card" as const,
    items: [
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, Mastercard), PayPal, Fawry, and cash on delivery within Egypt." },
      { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 2 hours of placement. Contact us immediately at support@greece-hieroglyphs.com." },
      { q: "Is my payment information secure?", a: "All payments are processed by Stripe. We never store your card details." },
    ],
  },
  {
    category: "SHIPPING & DELIVERY",
    icon: "truck" as const,
    items: [
      { q: "How long does delivery take within Egypt?", a: "Standard delivery within Cairo/Giza takes 2–3 business days. Other governorates take 4–6 business days." },
      { q: "Do you ship internationally?", a: "Yes, we ship to Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, and Jordan. International orders take 7–14 business days." },
      { q: "How much does shipping cost?", a: "Free shipping on orders above EGP 1,500 within Egypt. Standard shipping costs EGP 50–80 depending on governorate." },
    ],
  },
  {
    category: "RETURNS & EXCHANGES",
    icon: "refresh-cw" as const,
    items: [
      { q: "What is your return policy?", a: "We accept returns within 14 days of delivery for unworn, unwashed items with original tags attached." },
      { q: "How do I initiate a return?", a: "Email returns@greece-hieroglyphs.com with your order ID and reason for return. We'll guide you through the process." },
      { q: "Do you offer exchanges?", a: "Yes! We exchange for different sizes or colors within 14 days. Availability depends on current stock." },
    ],
  },
  {
    category: "PRODUCTS",
    icon: "package" as const,
    items: [
      { q: "Are GREECE garments true to size?", a: "Most GREECE pieces run slightly oversized for a streetwear fit. We recommend going one size down if you prefer a fitted look." },
      { q: "How do I care for my GREECE pieces?", a: "Machine wash cold, inside out, gentle cycle. Tumble dry low or hang to dry. Do not bleach or iron directly over the print/embroidery." },
      { q: "Are the symbols authentic to Egyptian culture?", a: "Yes. Every symbol we use is researched and approved by Egyptologists and cultural consultants. We take authenticity very seriously." },
    ],
  },
];

export default function FAQScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    Haptics.selectionAsync();
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.secondary }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>FAQ</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>FREQUENTLY ASKED QUESTIONS</Text>
      </View>

      <View style={{ padding: GRID_PAD, gap: SP.xl }}>
        {FAQ_CATEGORIES.map((cat) => (
          <View key={cat.category} style={styles.catBlock}>
            <View style={styles.catTitleRow}>
              <View style={[styles.catIconBg, { backgroundColor: colors.primary + "16" }]}>
                <Feather name={cat.icon} size={14} color={colors.primary} />
              </View>
              <Text style={[styles.catTitle, { color: colors.primary }]}>{cat.category}</Text>
            </View>
            <View
              style={[
                styles.catItems,
                { ...SHADOW.xs },
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
            >
              {cat.items.map((item, i) => {
                const key = `${cat.category}-${i}`;
                const open = openItems[key];
                return (
                  <React.Fragment key={key}>
                    <Pressable
                      style={({ pressed }) => [styles.faqRow, { opacity: pressed ? 0.7 : 1 }]}
                      onPress={() => toggle(key)}
                    >
                      <Text style={[styles.faqQ, { color: colors.foreground, flex: 1 }]}>
                        {item.q}
                      </Text>
                      <View
                        style={[
                          styles.chevronBg,
                          { backgroundColor: open ? colors.primary + "20" : colors.secondary },
                        ]}
                      >
                        <Feather
                          name={open ? "chevron-up" : "chevron-down"}
                          size={14}
                          color={open ? colors.primary : colors.mutedForeground}
                        />
                      </View>
                    </Pressable>
                    {open && (
                      <View style={[styles.faqA, { backgroundColor: colors.secondary }]}>
                        <Text style={[styles.faqAText, { color: colors.mutedForeground }]}>
                          {item.a}
                        </Text>
                      </View>
                    )}
                    {i < cat.items.length - 1 && (
                      <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        ))}
        <View style={{ height: Platform.OS === "web" ? 100 : 60 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: GRID_PAD,
    paddingBottom: GRID_PAD,
    borderBottomWidth: BD.thin,
    gap: SP.xs,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RD.circle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SP.xs,
  },
  title: { fontSize: FS.h3, fontFamily: "Cinzel_900Black", letterSpacing: LS.widest },
  sub: { fontSize: FS.xs, fontFamily: "Inter_500Medium", letterSpacing: LS.wider },
  catBlock: { gap: SP.sm },
  catTitleRow: { flexDirection: "row", alignItems: "center", gap: SP.sm },
  catIconBg: {
    width: 28,
    height: 28,
    borderRadius: RD.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  catTitle: { fontSize: FS.xs, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
  catItems: { borderWidth: BD.thin, borderRadius: RD.md, overflow: "hidden" },
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SP.md,
    padding: GRID_PAD,
  },
  faqQ: { fontSize: FS.base, fontFamily: "Inter_500Medium", lineHeight: 20 },
  chevronBg: {
    width: 28,
    height: 28,
    borderRadius: RD.circle,
    alignItems: "center",
    justifyContent: "center",
  },
  faqA: { paddingHorizontal: GRID_PAD, paddingBottom: GRID_PAD },
  faqAText: { fontSize: FS.base, fontFamily: "Inter_400Regular", lineHeight: 20 },
  divider: { height: 1, marginHorizontal: GRID_PAD },
});
