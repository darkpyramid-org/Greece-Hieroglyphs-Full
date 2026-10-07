import { useTheme } from "@/contexts/theme-context";

export type ColorToken = "paper" | "sand" | "ink" | "gold";

const LIGHT: Record<ColorToken, string> = {
  paper: "#FDF8EF",
  sand:  "#E4D5B7",
  ink:   "#1B1B1B",
  gold:  "#C89D29",
};

const DARK: Record<ColorToken, string> = {
  paper: "#1A1410",
  sand:  "#2A1E14",
  ink:   "#0D0B09",
  gold:  "#C89D29",
};

const H = 120;

const PATHS: Record<number, string> = {
  1: `M0,60 C360,${H} 1080,10 1440,60 L1440,${H} L0,${H}Z`,
  2: `M0,30 C200,90 500,5 780,75 C1060,${H+10} 1280,20 1440,55 L1440,${H} L0,${H}Z`,
  3: `M0,80 C180,20 420,${H} 660,35 C900,0 1200,90 1440,45 L1440,${H} L0,${H}Z`,
  4: `M0,15 C350,${H} 700,5 1050,85 C1230,${H} 1380,50 1440,30 L1440,${H} L0,${H}Z`,
  5: `M0,50 C280,0 560,${H} 840,38 C1120,0 1320,85 1440,60 L1440,${H} L0,${H}Z`,
};

interface WaveDividerProps {
  from: ColorToken;
  to: ColorToken;
  variant?: 1 | 2 | 3 | 4 | 5;
  flip?: boolean;
  height?: number;
}

export default function WaveDivider({
  from,
  to,
  variant = 1,
  flip = false,
  height = H,
}: WaveDividerProps) {
  const { theme } = useTheme();
  const palette = theme === "dark" ? DARK : LIGHT;

  return (
    <div
      aria-hidden="true"
      style={{
        background: palette[from],
        display: "block",
        lineHeight: 0,
        fontSize: 0,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox={`0 0 1440 ${H}`}
        preserveAspectRatio="none"
        style={{
          display: "block",
          width: "100%",
          height: height,
          transform: flip ? "scaleX(-1)" : undefined,
          verticalAlign: "bottom",
        }}
      >
        <path fill={palette[to]} d={PATHS[variant]} />
      </svg>
    </div>
  );
}
