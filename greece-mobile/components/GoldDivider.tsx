import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  glyph?: string;
}

export function GoldDivider({ glyph = "𓂀" }: Props) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <View style={[styles.line, { backgroundColor: colors.primary }]} />
      <Text style={[styles.glyph, { color: colors.primary }]}>{glyph}</Text>
      <View style={[styles.line, { backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1.5,
    opacity: 0.5,
  },
  glyph: {
    fontSize: 16,
    opacity: 0.8,
  },
});
