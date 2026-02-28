import { Box, Rating, Typography } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import type { SkillType } from "../Skills/SkillsGrid";

export default function RatingCard({
  skill,
  compact = false,
}: Readonly<{ skill: SkillType; compact?: boolean }>) {
  const rating = skill.rating ?? 0;
  const count = skill.numberOfReviews ?? 0;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <Rating
        value={rating}
        precision={0.5}
        readOnly
        size="small"
        icon={<StarRoundedIcon sx={{ color: "#f59e0b", fontSize: compact ? 14 : 16 }} />}
        emptyIcon={<StarBorderRoundedIcon sx={{ color: "#e2e8f0", fontSize: compact ? 14 : 16 }} />}
      />
      <Typography
        sx={{
          fontSize: compact ? 12 : 13,
          color: "#64748b",
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        {rating > 0 ? rating.toFixed(1) : "—"}
      </Typography>
      {!compact && (
        <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
          ({count})
        </Typography>
      )}
    </Box>
  );
}
