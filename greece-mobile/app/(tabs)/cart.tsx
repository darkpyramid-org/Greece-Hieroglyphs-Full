import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { GoldDivider } from "@/components/GoldDivider";
import { fmt, getImageUrl } from "@/constants/products";
import { BD, BTN_H, FS, GRID_PAD, LS, RD, SHADOW, SP } from "@/constants/theme";
import { useCart } from "@/contexts/CartContext";
import { useColors } from "@/hooks/useColors";
import { apiPost, notify } from "@/lib/api";

/**
 * Deep link back into the app (native). The previous URL pointed at a web path
 * that 404'd after a completed payment — a static bundle cannot serve
 * `/greece-mobile/checkout-success`.
 */
const APP_SCHEME_SUCCESS = "greece://checkout-success?session_id={CHECKOUT_SESSION_ID}";
const APP_SCHEME_CANCEL = "greece://(tabs)/cart";

/**
 * Where Stripe should return the customer for successful checkout.
 *
 * On web, deep links are useless inside the browser that just paid — Stripe
 * must redirect back to the Expo web origin itself (remembering the BASE_PATH
 * the bundle is served under). On native, hand Stripe the app's custom scheme.
 */
function buildSuccessUrl(): string {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const basePath = (process.env.EXPO_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
    return `${window.location.origin}${basePath}/checkout-success?session_id={CHECKOUT_SESSION_ID}`;
  }
  return APP_SCHEME_SUCCESS;
}

function buildCancelUrl(): string {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const basePath = (process.env.EXPO_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
    return `${window.location.origin}${basePath}/cart`;
  }
  return APP_SCHEME_CANCEL;
}

interface CheckoutResponse {
  url: string;
  sessionId: string;
  orderId: string;
  total: number;
}

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // The API requires these to persist/track the order; previously the mobile
    // app omitted them entirely, so every mobile order fell back to a shared
    // "Guest / guest@greece-hieroglyphs.com" placeholder.
    const name = customerName.trim();
    const email = customerEmail.trim();
    if (!name || !email) {
      notify("Missing details", "Please enter your name and email before checkout.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost<CheckoutResponse>("/checkout", {
        items: items.map((item) => ({
          product: { id: item.product.id },
          quantity: item.quantity,
          ...(item.size ? { size: item.size } : {}),
        })),
        customerEmail: email,
        customerName: name,
        shippingAddress: {
          fullName: name,
          email,
        },
        // Deep link back into the app — the previous URL pointed at a web path
        // that 404'd after a completed payment.
        successUrl: buildSuccessUrl(),
        cancelUrl: buildCancelUrl(),
      });

      if (!data.url) throw new Error("No redirect URL returned");

      if (data.url.startsWith("https://checkout.stripe.com")) {
        setLoading(false);
        await WebBrowser.openBrowserAsync(data.url);
        // Do NOT clearCart() or claim success here: openBrowserAsync resolves
        // when the payment sheet closes, which happens whether the customer
        // paid or cancelled. Show a pending state and let the success screen
        // clear the cart only when we know the order went through.
        router.push(`/checkout-success?session_id=${data.sessionId}&pending=1`);
        return;
      }

      // Demo flow (no Stripe key): the API mirrors the success URL, so the
      // deep-link scheme brings the customer straight to the confirmation.
      clearCart();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push(`/checkout-success?session_id=${encodeURIComponent(data.sessionId)}&order_id=${encodeURIComponent(data.orderId)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      notify("Checkout failed", message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.background, paddingTop: topPad + SP.xxl },
        ]}
      >
        <View style={[styles.emptyGlyphCircle, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.emptyGlyph, { color: colors.primary }]}>𓂀</Text>
        </View>
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>YOUR CART IS EMPTY</Text>
        <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
          The desert awaits your choice, Pharaoh.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.browseBtn,
            { ...SHADOW.gold },
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => router.push("/(tabs)/shop")}
        >
          <Text style={[styles.browseBtnText, { color: colors.primaryForeground }]}>
            BROWSE COLLECTION
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + SP.sm,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>YOUR CART</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: GRID_PAD, gap: SP.md }}
      >
        {items.map((item) => (
          <View
            key={`${item.product.id}-${item.size}`}
            style={[
              styles.itemCard,
              { ...SHADOW.sm },
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Image
              source={{ uri: getImageUrl(item.product.image_url) }}
              style={[styles.itemImage, { backgroundColor: colors.secondary }]}
              resizeMode="cover"
            />
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={1}>
                {item.product.name}
              </Text>
              <View style={[styles.sizePill, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.itemSize, { color: colors.foreground }]}>
                  SIZE: {item.size}
                </Text>
              </View>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>
                {fmt(item.product.price)}
              </Text>
              <View style={styles.qtyRow}>
                <Pressable
                  style={[styles.qtyBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
                  onPress={() => { Haptics.selectionAsync(); updateQuantity(item.product.id, item.size, item.quantity - 1); }}
                >
                  <Feather name="minus" size={13} color={colors.foreground} />
                </Pressable>
                <Text style={[styles.qtyNum, { color: colors.foreground }]}>{item.quantity}</Text>
                <Pressable
                  style={[styles.qtyBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
                  onPress={() => { Haptics.selectionAsync(); updateQuantity(item.product.id, item.size, item.quantity + 1); }}
                >
                  <Feather name="plus" size={13} color={colors.foreground} />
                </Pressable>
                <Pressable
                  style={[styles.removeBtn, { backgroundColor: colors.destructive + "14" }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); removeItem(item.product.id, item.size); }}
                >
                  <Feather name="trash-2" size={13} color={colors.destructive} />
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        {/* Summary */}
        <View
          style={[
            styles.summary,
            { ...SHADOW.sm },
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <GoldDivider />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>SUBTOTAL</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>{fmt(totalPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>SHIPPING</Text>
            <View style={[styles.freeBadge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.freeBadgeText, { color: colors.accentForeground }]}>FREE</Text>
            </View>
          </View>
          <GoldDivider />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>TOTAL</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>{fmt(totalPrice)}</Text>
          </View>
        </View>

        {/* Pre-checkout details — the order cannot be persisted or tracked without these. */}
        <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.foreground }]}>YOUR DETAILS</Text>
          <TextInput
            style={[styles.contactInput, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="Full name"
            placeholderTextColor={colors.mutedForeground}
            value={customerName}
            onChangeText={setCustomerName}
            autoCapitalize="words"
            autoComplete="name"
          />
          <TextInput
            style={[styles.contactInput, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="Email address"
            placeholderTextColor={colors.mutedForeground}
            value={customerEmail}
            onChangeText={setCustomerEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.checkoutBtn,
            { ...SHADOW.gold },
            { backgroundColor: colors.foreground, opacity: pressed || loading ? 0.85 : 1 },
          ]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.checkoutBtnText, { color: colors.background }]}>
              CHECKOUT — {fmt(totalPrice)}
            </Text>
          )}
        </Pressable>

        <View style={{ height: Platform.OS === "web" ? 100 : 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: GRID_PAD,
    paddingHorizontal: 40,
  },
  emptyGlyphCircle: {
    width: 80,
    height: 80,
    borderRadius: RD.circle,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyGlyph: { fontSize: 36 },
  emptyTitle: {
    fontSize: FS.xxl,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.widest,
    textAlign: "center",
  },
  emptySub: {
    fontSize: FS.base,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  browseBtn: {
    paddingVertical: SP.lg,
    paddingHorizontal: SP.xxxl,
    marginTop: SP.sm,
    minHeight: BTN_H.lg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RD.sm,
  },
  browseBtnText: {
    fontSize: FS.sm,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.wider,
  },
  header: {
    paddingHorizontal: GRID_PAD,
    paddingBottom: SP.md,
    borderBottomWidth: BD.thin,
    gap: SP.xs,
  },
  headerTitle: {
    fontSize: FS.xxxl,
    fontFamily: "Cinzel_900Black",
    letterSpacing: LS.widest,
  },
  headerSub: {
    fontSize: FS.md,
    fontFamily: "Inter_400Regular",
  },
  itemCard: {
    flexDirection: "row",
    borderWidth: BD.thin,
    borderRadius: RD.md,
    overflow: "hidden",
  },
  itemImage: {
    width: 90,
    height: 110,
  },
  itemInfo: {
    flex: 1,
    padding: SP.md,
    gap: SP.xs,
  },
  itemName: {
    fontSize: FS.md,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.normal,
  },
  sizePill: {
    alignSelf: "flex-start",
    paddingHorizontal: SP.sm,
    paddingVertical: SP.xs - 2,
    borderRadius: RD.xs,
  },
  itemSize: {
    fontSize: FS.xs,
    fontFamily: "Inter_700Bold",
    letterSpacing: LS.wide,
  },
  itemPrice: {
    fontSize: FS.base,
    fontFamily: "Inter_700Bold",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SP.xs + 2,
    marginTop: SP.xs - 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderWidth: BD.thin,
    borderRadius: RD.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyNum: {
    fontSize: FS.lg,
    fontFamily: "Inter_600SemiBold",
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: {
    marginLeft: "auto",
    width: 28,
    height: 28,
    borderRadius: RD.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    padding: GRID_PAD,
    borderWidth: BD.thin,
    borderRadius: RD.md,
    gap: SP.md,
    marginTop: SP.xs,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactCard: {
    borderWidth: BD.thin,
    borderRadius: RD.md,
    padding: GRID_PAD,
    gap: SP.sm,
    marginTop: SP.xs,
  },
  contactTitle: {
    fontSize: FS.xs,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.wider,
  },
  contactInput: {
    borderWidth: BD.thin,
    borderRadius: RD.sm,
    paddingHorizontal: SP.md,
    paddingVertical: SP.sm + 2,
    fontSize: FS.base,
    fontFamily: "Inter_400Regular",
  },
  summaryLabel: {
    fontSize: FS.xs,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.wider,
  },
  summaryValue: {
    fontSize: FS.base,
    fontFamily: "Inter_600SemiBold",
  },
  freeBadge: {
    paddingHorizontal: SP.sm,
    paddingVertical: SP.xs - 2,
    borderRadius: RD.xs,
  },
  freeBadgeText: {
    fontSize: FS.xs,
    fontFamily: "Inter_700Bold",
    letterSpacing: LS.wide,
  },
  totalLabel: {
    fontSize: FS.base,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.widest,
  },
  totalValue: {
    fontSize: FS.xl,
    fontFamily: "Inter_700Bold",
  },
  checkoutBtn: {
    paddingVertical: SP.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: BTN_H.lg,
    borderRadius: RD.sm,
  },
  checkoutBtnText: {
    fontSize: FS.md,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.widest,
  },
});
