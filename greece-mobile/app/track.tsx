import { Feather } from "@expo/vector-icons";
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
import { fmt } from "@/constants/products";
import { BD, BTN_H, FS, GRID_PAD, LS, RD, SHADOW, SP } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";
import { apiGet } from "@/lib/api";

type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "confirmed"
  | "cancelled"
  | "refunded";

/**
 * Keep every real DB status represented — missing ones previously fell back to
 * the "PENDING" badge, so a cancelled/refunded order looked pending.
 */
const STATUS_META: Record<
  OrderStatus | string,
  { label: string; icon: "clock" | "check-circle" | "truck" | "package" | "x-circle" | "rotate-ccw"; color: string }
> = {
  pending:   { label: "PENDING",   icon: "clock",         color: "#C89D29" },
  confirmed: { label: "CONFIRMED", icon: "check-circle",  color: "#2E7D32" },
  paid:      { label: "PAID",      icon: "check-circle",  color: "#2E7D32" },
  processing:{ label: "PROCESSING",icon: "package",       color: "#C89D29" },
  shipped:   { label: "SHIPPED",   icon: "truck",         color: "#1D4D4F" },
  delivered: { label: "DELIVERED", icon: "package",       color: "#1D4D4F" },
  cancelled: { label: "CANCELLED", icon: "x-circle",      color: "#AE1C1C" },
  refunded:  { label: "REFUNDED",  icon: "rotate-ccw",    color: "#AE1C1C" },
};

interface LocalOrder {
  id: string;
  status: OrderStatus | string;
  createdAt?: string;
  total?: number;
  items?: Array<{ product?: { name?: string }; quantity: number }>;
}

export default function TrackScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<LocalOrder | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!orderId.trim() || !email.trim()) {
      setError("Order ID and email are required.");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const data = await apiGet<{ order: LocalOrder }>(
        `/track-order?id=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(email.trim())}`,
      );
      setOrder(data.order);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Order not found. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const statusMeta = order
    ? (STATUS_META[order.status] ?? { label: `UNKNOWN (${String(order.status)})`, icon: "clock" as const, color: "#AE1C1C" })
    : null;

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
        <Text style={[styles.headerTitle, { color: colors.background }]}>TRACK ORDER</Text>
        <Text style={[styles.headerSub, { color: colors.primary }]}>𓂀 SACRED DELIVERY</Text>
      </View>

      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <GoldDivider />
        <Text style={[styles.formTitle, { color: colors.foreground }]}>FIND YOUR ORDER</Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>ORDER ID</Text>
          <TextInput
            value={orderId}
            onChangeText={setOrderId}
            placeholder="e.g. OHN-1234567"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card, fontFamily: "Inter_400Regular" },
            ]}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>EMAIL ADDRESS</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card, fontFamily: "Inter_400Regular" },
            ]}
            autoCapitalize="none"
            keyboardType="email-address"
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
            styles.trackBtn,
            { ...SHADOW.sm },
            { backgroundColor: colors.foreground, opacity: pressed || loading ? 0.85 : 1 },
          ]}
          onPress={handleTrack}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <>
              <Feather name="search" size={16} color={colors.background} />
              <Text style={[styles.trackBtnText, { color: colors.background }]}>TRACK ORDER</Text>
            </>
          )}
        </Pressable>

        {order && (
          <View
            style={[
              styles.orderCard,
              { ...SHADOW.md },
              { backgroundColor: colors.card, borderColor: colors.primary + "50" },
            ]}
          >
            <GoldDivider />
            <View style={styles.orderHeader}>
              <View>
                <Text style={[styles.orderId, { color: colors.foreground }]}>{order.id}</Text>
                <Text style={[styles.orderDate, { color: colors.mutedForeground }]}>
                  {/* The API returns camelCase `createdAt` — the previous
                      snake_case read was always undefined, so the date never
                      rendered. */}
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                </Text>
              </View>
              {statusMeta && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusMeta.color + "20", borderColor: statusMeta.color + "60" },
                  ]}
                >
                  <Feather name={statusMeta.icon} size={12} color={statusMeta.color} />
                  <Text style={[styles.statusText, { color: statusMeta.color }]}>
                    {statusMeta.label}
                  </Text>
                </View>
              )}
            </View>

            {order.items && order.items.length > 0 && (
              <View style={styles.orderItems}>
                {order.items.map((item, i) => (
                  <Text key={i} style={[styles.orderItem, { color: colors.mutedForeground }]}>
                    • {item.product?.name ?? "Item"} × {item.quantity}
                  </Text>
                ))}
              </View>
            )}

            {order.total != null && (
              <Text style={[styles.orderTotal, { color: colors.primary }]}>
                TOTAL: {fmt(order.total)}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={{ height: Platform.OS === "web" ? 100 : 60 }} />
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  header: { padding: GRID_PAD, paddingBottom: SP.xxl, gap: SP.xs },
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
  headerSub: { fontSize: FS.xs, fontFamily: "Cinzel_700Bold", letterSpacing: LS.ultra },
  content: { padding: GRID_PAD, gap: SP.md, flex: 1 },
  formTitle: { fontSize: FS.base, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
  fieldGroup: { gap: SP.xs + 2 },
  fieldLabel: { fontSize: FS.xxs, fontFamily: "Cinzel_700Bold", letterSpacing: LS.wider },
  input: {
    borderWidth: BD.thin,
    borderRadius: RD.sm,
    paddingHorizontal: SP.md,
    paddingVertical: SP.md + 1,
    fontSize: FS.lg,
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
  trackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SP.md,
    paddingVertical: SP.lg,
    minHeight: BTN_H.lg,
    borderRadius: RD.sm,
  },
  trackBtnText: { fontSize: FS.sm, fontFamily: "Cinzel_700Bold", letterSpacing: LS.widest },
  orderCard: {
    borderWidth: BD.thin,
    borderRadius: RD.md,
    padding: GRID_PAD,
    gap: SP.md,
    marginTop: SP.sm,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderId: { fontSize: FS.lg, fontFamily: "Cinzel_700Bold", letterSpacing: LS.wide },
  orderDate: { fontSize: FS.sm, fontFamily: "Inter_400Regular", marginTop: SP.xs - 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: SP.xs,
    paddingHorizontal: SP.md,
    paddingVertical: SP.xs + 1,
    borderRadius: RD.pill,
    borderWidth: BD.thin,
  },
  statusText: { fontSize: FS.xxs, fontFamily: "Inter_700Bold", letterSpacing: LS.wide },
  orderItems: { gap: SP.xs },
  orderItem: { fontSize: FS.base, fontFamily: "Inter_400Regular", lineHeight: 20 },
  orderTotal: { fontSize: FS.lg, fontFamily: "Inter_700Bold" },
});
