import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { GoldDivider } from "@/components/GoldDivider";
import { BD, BTN_H, FS, GRID_PAD, LS, RD, SHADOW, SP } from "@/constants/theme";
import { useCart } from "@/contexts/CartContext";
import { useColors } from "@/hooks/useColors";

export default function CheckoutSuccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { clearCart } = useCart();
  const params = useLocalSearchParams<{ order_id?: string; session_id?: string; total?: string; pending?: string }>();
  const orderId = params.order_id ?? params.session_id ?? "—";

  // `pending=1` is set when the user came back from the Stripe payment page
  // without us having proof of success. In that state we must NOT clear the
  // cart or claim the order is confirmed — the visitor may have cancelled.
  const isPending = params.pending === "1";

  useEffect(() => {
    if (isPending) return;
    clearCart();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [isPending, clearCart]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.foreground,
          paddingTop: Platform.OS === "web" ? 67 + SP.xxxl : insets.top + SP.xxxl,
        },
      ]}
    >
      <Text style={[styles.glyphs, { color: colors.primary }]}>𓂀 𓋹 𓇯</Text>

      {/* Success ring */}
      <View
        style={[
          styles.iconRing,
          { ...SHADOW.gold },
          { borderColor: colors.primary },
        ]}
      >
        <View style={[styles.iconInner, { backgroundColor: colors.primary + "18" }]}>
          <Feather name={isPending ? "clock" : "check"} size={36} color={colors.primary} />
        </View>
      </View>

      <Text style={[styles.title, { color: colors.background }]}>
        {isPending ? "PAYMENT PENDING" : "ORDER CONFIRMED"}
      </Text>
      <Text style={[styles.sub, { color: "rgba(253,248,239,0.7)" }]}>
        {isPending
          ? "You left the payment page before it finished.\nCheck your email, or track the order below."
          : `Your order has been placed,${"\n"}Pharaoh.`}
      </Text>

      <GoldDivider />

      {/* Order summary box */}
      <View
        style={[
          styles.orderBox,
          { backgroundColor: "rgba(200,157,41,0.07)", borderColor: "rgba(200,157,41,0.25)" },
        ]}
      >
        <Text style={[styles.orderLabel, { color: "rgba(253,248,239,0.45)" }]}>ORDER ID</Text>
        <Text style={[styles.orderId, { color: colors.primary }]}>{orderId}</Text>
        {params.total && (
          <>
            <View style={[styles.orderDivider, { backgroundColor: "rgba(200,157,41,0.2)" }]} />
            <Text style={[styles.orderLabel, { color: "rgba(253,248,239,0.45)" }]}>TOTAL PAID</Text>
            <Text style={[styles.orderId, { color: colors.background }]}>EGP {params.total}</Text>
          </>
        )}
      </View>

      <Text style={[styles.note, { color: "rgba(253,248,239,0.5)" }]}>
        {isPending
          ? "We'll email you once Stripe confirms the payment. Your card is not charged until then."
          : "A confirmation email will be sent shortly. Track your order using the ID above."}
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.trackBtn,
            { borderColor: colors.primary + "60", opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => router.push("/track")}
        >
          <Feather name="package" size={14} color={colors.primary} />
          <Text style={[styles.trackBtnText, { color: colors.primary }]}>TRACK ORDER</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.shopBtn,
            { ...SHADOW.gold },
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.replace("/(tabs)/shop")}
        >
          <Text style={[styles.shopBtnText, { color: colors.primaryForeground }]}>
            CONTINUE SHOPPING
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: GRID_PAD + SP.md,
    gap: GRID_PAD,
  },
  glyphs: { fontSize: FS.xxxl, letterSpacing: 8 },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: RD.circle,
    borderWidth: BD.thick,
    alignItems: "center",
    justifyContent: "center",
  },
  iconInner: {
    width: 72,
    height: 72,
    borderRadius: RD.circle,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FS.h1,
    fontFamily: "Cinzel_900Black",
    letterSpacing: LS.widest,
    textAlign: "center",
  },
  sub: {
    fontSize: FS.xl - 1,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 23,
  },
  orderBox: {
    width: "100%",
    borderWidth: BD.thin,
    borderRadius: RD.md,
    padding: GRID_PAD,
    alignItems: "center",
    gap: SP.xs,
  },
  orderLabel: { fontSize: FS.xxs, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
  orderId: { fontSize: FS.xxl, fontFamily: "Cinzel_700Bold", letterSpacing: LS.wide },
  orderDivider: { width: "60%", height: 1, marginVertical: SP.xs },
  note: {
    fontSize: FS.md,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 19,
  },
  actions: { width: "100%", gap: SP.md, marginTop: SP.xs },
  trackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SP.sm,
    paddingVertical: SP.lg,
    borderWidth: BD.thin,
    borderRadius: RD.sm,
    minHeight: BTN_H.lg,
  },
  trackBtnText: { fontSize: FS.sm, fontFamily: "Cinzel_700Bold", letterSpacing: LS.wider },
  shopBtn: {
    paddingVertical: SP.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: BTN_H.lg,
    borderRadius: RD.sm,
  },
  shopBtnText: { fontSize: FS.sm, fontFamily: "Cinzel_700Bold", letterSpacing: LS.wider },
});
