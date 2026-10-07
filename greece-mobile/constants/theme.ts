import { Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const SP = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 32,
} as const;

// ─── Border widths ────────────────────────────────────────────────────────────
export const BD = {
  thin:  1,
  md:    1.5,
  thick: 2,
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────
// Applied per element type — see comments for usage guide
export const RD = {
  none:   0,    // intentional hard edge (brand section dividers only)
  xs:     2,    // tiny indicators, dot markers
  sm:     6,    // buttons, inputs, small chips
  md:     10,   // cards, panels, containers
  lg:     14,   // category chips, filter pills
  xl:     18,   // hero/image frames, large surfaces
  pill:   28,   // full pill (for wide chips)
  circle: 999,  // circular icon wrappers, avatar rings
} as const;

// ─── Font sizes ───────────────────────────────────────────────────────────────
export const FS = {
  micro: 8,
  xxs:   9,
  xs:    10,
  sm:    11,
  md:    12,
  base:  13,
  lg:    14,
  xl:    16,
  xxl:   18,
  xxxl:  20,
  h3:    22,
  h2:    24,
  h1:    28,
  hero:  32,
} as const;

// ─── Line heights ─────────────────────────────────────────────────────────────
export const LH = {
  tight:   1.2,   // headings
  snug:    1.35,  // subheadings
  normal:  1.5,   // body copy
  relaxed: 1.65,  // captions, descriptions
} as const;

// Absolute line heights for common combos
export const lineHeight = (fs: number, ratio = LH.normal) => Math.round(fs * ratio);

// ─── Letter spacing ───────────────────────────────────────────────────────────
export const LS = {
  tight:  0,
  normal: 0.5,
  wide:   1,
  wider:  1.5,
  widest: 2,
  ultra:  3,
} as const;

// ─── Shadows / elevation ──────────────────────────────────────────────────────
// Use spread syntax: { ...SHADOW.sm }
export const SHADOW = {
  none: {},
  xs: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: { elevation: 1 },
    default: {},
  }) as object,
  sm: Platform.select({
    ios: {
      shadowColor: "#1B1B1B",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: {},
  }) as object,
  md: Platform.select({
    ios: {
      shadowColor: "#1B1B1B",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: {},
  }) as object,
  lg: Platform.select({
    ios: {
      shadowColor: "#1B1B1B",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.13,
      shadowRadius: 14,
    },
    android: { elevation: 7 },
    default: {},
  }) as object,
  gold: Platform.select({
    ios: {
      shadowColor: "#C89D29",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.22,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
    default: {},
  }) as object,
} as const;

// ─── Grid ─────────────────────────────────────────────────────────────────────
export const GRID_PAD = SP.xl;           // 20px horizontal screen padding
export const GRID_GAP = SP.md;           // 12px gap between grid columns

/**
 * @deprecated Width is sampled once at module load, so on rotation/resize/web
 * the card widths go stale. Callers should compute their own via
 * `useWindowDimensions()`. This constant is kept for import compatibility.
 */
export const COL2 = (width - GRID_PAD * 2 - GRID_GAP) / 2;  // 2-column card width

// ─── Button heights ───────────────────────────────────────────────────────────
export const BTN_H = {
  sm: 40,
  md: 48,
  lg: 52,
} as const;

// ─── Convenience shorthands ───────────────────────────────────────────────────
export const CARD_PAD   = SP.lg;     // 16px — standard card inner padding
export const SECTION_PAD = SP.xl;   // 20px — screen section padding
export const SECTION_GAP = SP.lg;   // 16px — gap between section elements
