import { Box, Chip, Typography } from "@mui/material";
import type { SkillType } from "./SkillsGrid";
import { useNavigate } from "react-router";
import SkillGradientCard from "./SkillGradientCard";
import RatingCard from "../Ratings/RatingCard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function SkillsCard({ skill }: Readonly<{ skill: SkillType }>) {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/skills/${skill.skillId}`)}
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        bgcolor: "white",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(79,70,229,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          borderColor: "#c7d2fe",
        },
      }}
    >
      <SkillGradientCard skill={skill} />

      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
        {/* Category + active badge */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {skill.category?.name && (
            <Chip
              label={skill.category.name}
              size="small"
              sx={{
                bgcolor: "#eef2ff",
                color: "#4338ca",
                border: "1px solid #c7d2fe",
                fontSize: 11,
                fontWeight: 600,
                height: 22,
              }}
            />
          )}
          {skill.isActive && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#10b981",
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: 11, color: "#10b981", fontWeight: 500 }}>
                Available
              </Typography>
            </Box>
          )}
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 15,
            lineHeight: 1.35,
            color: "#0f172a",
            letterSpacing: -0.2,
          }}
        >
          {skill.title}
        </Typography>

        {/* Teacher */}
        <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 400 }}>
          by{" "}
          <Typography component="span" sx={{ fontWeight: 600, color: "#475569", fontSize: 13 }}>
            {skill.teacherName}
          </Typography>
        </Typography>

        {/* Rating */}
        <RatingCard skill={skill} compact />

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "auto",
            pt: 1.5,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography
              component="span"
              sx={{ fontWeight: 800, fontSize: 19, color: "#4f46e5", letterSpacing: -0.5 }}
            >
              ${skill.pricePerHour}
            </Typography>
            <Typography component="span" sx={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
              / hr
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#4f46e5",
              fontWeight: 600,
              fontSize: 12,
              opacity: 0.8,
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#4f46e5" }}>
              View
            </Typography>
            <ArrowForwardIcon sx={{ fontSize: 13, color: "#4f46e5" }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
