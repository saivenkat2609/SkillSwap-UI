import { Box, CircularProgress, Typography, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import SkillsCard from "./SkillsCard";
import { getSkills } from "../Queries/skill-queries";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

export interface SkillType {
  skillId: number;
  title: string;
  description: string;
  pricePerHour: number;
  teacherId: string;
  category: { categoryId: number; name: string };
  createdAt: string;
  isActive: boolean;
  teacherName: string;
  numberOfReviews: number;
  rating: number;
}

const FILTER_CHIPS = ["All", "Programming", "Design", "Music", "Language", "Business", "Marketing"];

export default function SkillsGrid() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    getSkills()
      .then((response) => setSkills(response.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeFilter === "All"
      ? skills
      : skills.filter((s) => s.category?.name === activeFilter);

  const stats = [
    { icon: <TrendingUpIcon sx={{ fontSize: 18 }} />, value: `${skills.length}+`, label: "Skills" },
    { icon: <PeopleAltIcon sx={{ fontSize: 18 }} />, value: "200+", label: "Teachers" },
    { icon: <StarRoundedIcon sx={{ fontSize: 18 }} />, value: "4.8", label: "Avg Rating" },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
          py: { xs: 5, md: 8 },
          px: { xs: 3, sm: 5, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <Box
          sx={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
            top: -100,
            right: -50,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)",
            bottom: -80,
            left: "30%",
            pointerEvents: "none",
          }}
        />

        <Box sx={{ position: "relative", maxWidth: 1400, mx: "auto" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "100px",
              px: 2,
              py: 0.75,
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#10b981",
                boxShadow: "0 0 0 2px rgba(16,185,129,0.3)",
              }}
            />
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
              Live marketplace — skills updated daily
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{
              color: "#ffffff",
              fontWeight: 800,
              letterSpacing: -1,
              mb: 1.5,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
            }}
          >
            Find Your Next Skill
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.65)",
              fontSize: { xs: 14, md: 16 },
              fontWeight: 400,
              mb: 4,
              maxWidth: 480,
            }}
          >
            Connect with expert teachers and book one-on-one sessions tailored to your learning goals.
          </Typography>

          {/* Stats */}
          <Box sx={{ display: "flex", gap: { xs: 2, md: 4 }, flexWrap: "wrap" }}>
            {stats.map((stat) => (
              <Box key={stat.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ color: "#818cf8" }}>{stat.icon}</Box>
                <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: 16 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Filter Chips */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          px: { xs: 3, sm: 5, md: 10 },
          py: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            display: "flex",
            gap: 1,
            overflowX: "auto",
            pb: 0.5,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {FILTER_CHIPS.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() => setActiveFilter(filter)}
              sx={{
                cursor: "pointer",
                flexShrink: 0,
                fontWeight: activeFilter === filter ? 700 : 500,
                fontSize: 13,
                height: 32,
                bgcolor: activeFilter === filter ? "#eef2ff" : "transparent",
                color: activeFilter === filter ? "#4338ca" : "#64748b",
                border: "1px solid",
                borderColor: activeFilter === filter ? "#c7d2fe" : "#e2e8f0",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: "#f5f3ff",
                  borderColor: "#c7d2fe",
                  color: "#4338ca",
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Grid Content */}
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 3, sm: 5, md: 10 },
          py: { xs: 4, md: 5 },
        }}
      >
        {/* Section header */}
        {!loading && !error && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography sx={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>
              Showing{" "}
              <Typography component="span" sx={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>
                {filtered.length}
              </Typography>{" "}
              {activeFilter === "All" ? "skills" : `${activeFilter} skills`}
            </Typography>
          </Box>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 14 }}>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress size={36} sx={{ color: "#4f46e5", mb: 2 }} />
              <Typography sx={{ color: "#64748b", fontSize: 14 }}>Loading skills...</Typography>
            </Box>
          </Box>
        )}

        {error && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 14,
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 40, mb: 1 }}>⚠️</Typography>
            <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: 18 }}>
              Failed to load skills
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 14 }}>
              Please check your connection and try again.
            </Typography>
          </Box>
        )}

        {!loading && !error && filtered.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 14,
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 40, mb: 1 }}>🔍</Typography>
            <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: 18 }}>
              No skills found
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 14 }}>
              Try a different category filter.
            </Typography>
          </Box>
        )}

        {!loading && !error && filtered.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {filtered.map((skill) => (
              <SkillsCard skill={skill} key={skill.skillId} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
