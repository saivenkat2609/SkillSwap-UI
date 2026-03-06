import { Box, Typography } from "@mui/material";
import type { SkillType } from "./SkillsGrid";

const categoryConfig: Record<string, { gradient: string; emoji: string }> = {
  Programming: {
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
    emoji: "💻",
  },
  Design: {
    gradient: "linear-gradient(135deg, #831843 0%, #9d174d 50%, #be185d 100%)",
    emoji: "🎨",
  },
  Music: {
    gradient: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
    emoji: "🎵",
  },
  Language: {
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #2563eb 100%)",
    emoji: "🌐",
  },
  Photography: {
    gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)",
    emoji: "📷",
  },
  Marketing: {
    gradient: "linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #c2410c 100%)",
    emoji: "📈",
  },
  Business: {
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)",
    emoji: "💼",
  },
  Fitness: {
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    emoji: "💪",
  },
  Cooking: {
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)",
    emoji: "🍳",
  },
  Writing: {
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #1d4ed8 100%)",
    emoji: "✍️",
  },
};

const defaultGradients = [
  "linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)",
  "linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)",
  "linear-gradient(135deg, #064e3b 0%, #047857 100%)",
  "linear-gradient(135deg, #4a1942 0%, #7e22ce 100%)",
  "linear-gradient(135deg, #1c1917 0%, #44403c 100%)",
  "linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)",
  "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
];

const defaultEmojis = ["🎯", "⚡", "🔑", "🚀", "📐", "🎓", "🌟", "💡"];

export const getSkillGradientColor = (skillId: number) => {
  return defaultGradients[skillId % defaultGradients.length];
};

export default function SkillGradientCard({
  skill,
  styles = {},
}: Readonly<{ skill: SkillType; styles?: React.CSSProperties & { height?: number | string; width?: number | string } }>) {
  const categoryName = skill.category?.name ?? "";
  const config = categoryConfig[categoryName];
  const gradient = config?.gradient ?? defaultGradients[skill.skillId % defaultGradients.length];
  const emoji = config?.emoji ?? defaultEmojis[skill.skillId % defaultEmojis.length];
  const isLarge = !!(styles as any)?.height;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        height: isLarge ? (styles as any).height : 180,
        width: (styles as any)?.width ?? "100%",
        background: gradient,
        position: "relative",
        overflow: "hidden",
        ...(styles as any),
        borderRadius: isLarge ? "12px" : "12px 12px 0 0",
      }}
    >
      {/* Subtle texture overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)",
        }}
      />

      {/* Emoji */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          fontSize: isLarge ? 64 : 40,
          opacity: 0.9,
          userSelect: "none",
        }}
      >
        {emoji}
      </Box>

      {/* Bottom info strip */}
      <Box
        sx={{
          position: "relative",
          px: isLarge ? 3 : 2,
          py: isLarge ? 2.5 : 1.5,
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
        }}
      >
        {categoryName && (
          <Typography
            sx={{
              color: "rgba(255,255,255,0.75)",
              fontSize: isLarge ? 12 : 11,
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            {categoryName}
          </Typography>
        )}
        <Typography
          sx={{
            color: "#ffffff",
            fontSize: isLarge ? 22 : 15,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: -0.3,
            textShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          {skill.title ?? "Untitled Skill"}
        </Typography>
      </Box>
    </Box>
  );
}
