import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, getProductsByCategory } from "@/constants/products";
import { BD, FS, GRID_GAP, GRID_PAD, LS, RD, SHADOW, SP } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const params = useLocalSearchParams<{ category?: string }>();

  const [activeCategory, setActiveCategory] = useState(params.category ?? "All");
  const [search, setSearch] = useState("");

  // Tabs that are already visited stay mounted and keep their old state, so the
  // useState initializer alone does not react to new `?category=` params — the
  // home screen's category chips silently did nothing after first mount.
  useEffect(() => {
    if (params.category && params.category !== activeCategory) {
      setActiveCategory(params.category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category]);

  const filtered = useMemo(() => {
    const byCategory = getProductsByCategory(activeCategory);
    if (!search.trim()) return byCategory;
    const q = search.toLowerCase();
    return byCategory.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [activeCategory, search]);

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>SACRED COLLECTION</Text>
        <Text style={[styles.headerSub, { color: colors.primary }]}>𓂀 {PRODUCTS.length} PIECES</Text>

        {/* Search bar */}
        <View
          style={[
            styles.searchRow,
            { ...SHADOW.xs },
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={14} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search pieces..."
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.searchInput,
              { color: colors.foreground, fontFamily: "Inter_400Regular" },
            ]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            return (
              <Pressable
                key={cat}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.foreground : colors.card,
                    borderColor: active ? colors.foreground : colors.border,
                  },
                  !active && SHADOW.xs,
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? colors.background : colors.mutedForeground },
                  ]}
                >
                  {cat.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="search" size={28} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No pieces found
            </Text>
          </View>
        ) : (
          <View style={styles.gridInner}>
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onPress={() => router.push(`/product/${p.slug}`)}
              />
            ))}
          </View>
        )}
        <View style={{ height: Platform.OS === "web" ? 100 : 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: GRID_PAD,
    paddingBottom: SP.md,
    borderBottomWidth: BD.thin,
    gap: SP.sm,
  },
  headerTitle: {
    fontSize: FS.xxl,
    fontFamily: "Cinzel_900Black",
    letterSpacing: LS.widest,
  },
  headerSub: {
    fontSize: FS.xs,
    fontFamily: "Inter_500Medium",
    letterSpacing: LS.wide,
    marginTop: -SP.xs,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SP.sm,
    paddingHorizontal: SP.md,
    paddingVertical: SP.sm + 2,
    borderWidth: BD.thin,
    borderRadius: RD.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: FS.base,
    paddingVertical: 0,
  },
  chips: {
    marginHorizontal: -GRID_PAD,
    paddingHorizontal: GRID_PAD,
  },
  chip: {
    paddingHorizontal: SP.md,
    paddingVertical: SP.xs + 2,
    borderWidth: BD.thin,
    borderRadius: RD.pill,
    marginRight: SP.sm,
  },
  chipText: {
    fontSize: FS.xxs,
    fontFamily: "Cinzel_700Bold",
    letterSpacing: LS.wide,
  },
  grid: {
    flexGrow: 1,
  },
  gridInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
    padding: GRID_PAD,
    justifyContent: "space-between",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: SP.md,
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: RD.circle,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: FS.lg,
    fontFamily: "Inter_400Regular",
  },
});
