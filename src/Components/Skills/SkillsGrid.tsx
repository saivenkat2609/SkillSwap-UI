import {
  Box,
  CircularProgress,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Slider,
  Pagination,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SkillsCard from "./SkillsCard";
import { getSkills, getCategories } from "../Queries/skill-queries";
import { useSearchParams } from "react-router";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import SearchIcon from "@mui/icons-material/Search";

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

interface Category {
  categoryId: number;
  name: string;
}

const PAGE_SIZE = 12;
const MAX_PRICE = 500;

const SORT_OPTIONS = [
  { value: "Rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function chipSx(active: boolean) {
  return {
    cursor: "pointer",
    flexShrink: 0,
    fontWeight: active ? 700 : 500,
    fontSize: 13,
    height: 32,
    bgcolor: active ? "#eef2ff" : "transparent",
    color: active ? "#4338ca" : "#64748b",
    border: "1px solid",
    borderColor: active ? "#c7d2fe" : "#e2e8f0",
    transition: "all 0.15s ease",
    "&:hover": { bgcolor: "#f5f3ff", borderColor: "#c7d2fe", color: "#4338ca" },
  };
}

export default function SkillsGrid() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("searchTerm") ?? "");
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice") || 0),
    Number(searchParams.get("maxPrice") || MAX_PRICE),
  ]);

  const activeCategoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : null;
  const sortBy = searchParams.get("sortBy") || "Rating";
  const page = Number(searchParams.get("page") || 1);

  const updateParams = (updates: Record<string, string | null>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) next.delete(key);
        else next.set(key, value);
      });
      return next;
    });
  };

  // Fetch categories once on mount
  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const prevInputRef = useRef(inputValue);

  // Debounce search input → update URL after 400ms (only when input actually changes)
  useEffect(() => {
    if (prevInputRef.current === inputValue) return;
    prevInputRef.current = inputValue;
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (inputValue) next.set("searchTerm", inputValue);
        else next.delete("searchTerm");
        next.set("page", "1");
        return next;
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchParams]);

  // Fetch skills whenever URL params change
  useEffect(() => {
    setLoading(true);
    setError(false);
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || MAX_PRICE);
    getSkills({
      searchTerm: searchParams.get("searchTerm") || undefined,
      categoryId: activeCategoryId ?? undefined,
      sortBy,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < MAX_PRICE ? maxPrice : undefined,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((res) => {
        setSkills(res.data.skills);
        setTotalCount(res.data.totalCount);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const stats = [
    { icon: <TrendingUpIcon sx={{ fontSize: 18 }} />, value: `${totalCount}+`, label: "Skills" },
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

      {/* Search + Sort */}
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
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search skills, topics, or teachers..."
            variant="outlined"
            size="small"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              flex: 1,
              maxWidth: 480,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#f8fafc",
                borderRadius: "8px",
                fontSize: 14,
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused fieldset": { borderColor: "#4f46e5" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={sortBy}
              onChange={(e) => updateParams({ sortBy: e.target.value, page: "1" })}
              sx={{
                fontSize: 14,
                bgcolor: "#f8fafc",
                borderRadius: "8px",
                "& fieldset": { borderColor: "#e2e8f0" },
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 14 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Category Chips */}
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
          <Chip
            label="All"
            onClick={() => updateParams({ categoryId: null, page: "1" })}
            sx={chipSx(activeCategoryId === null)}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.categoryId}
              label={cat.name}
              onClick={() => updateParams({ categoryId: activeCategoryId === cat.categoryId ? null : String(cat.categoryId), page: "1" })}
              sx={chipSx(activeCategoryId === cat.categoryId)}
            />
          ))}
        </Box>
      </Box>

      {/* Price Range */}
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
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#475569", flexShrink: 0 }}>
            Price range
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, v) => setPriceRange(v as [number, number])}
            onChangeCommitted={(_, v) => {
              const [min, max] = v as [number, number];
              updateParams({
                minPrice: min > 0 ? String(min) : null,
                maxPrice: max < MAX_PRICE ? String(max) : null,
                page: "1",
              });
            }}
            min={0}
            max={MAX_PRICE}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `$${v}`}
            sx={{ flex: 1, maxWidth: 300, color: "#4f46e5" }}
          />
          <Typography sx={{ fontSize: 13, color: "#64748b", flexShrink: 0, minWidth: 90 }}>
            ${priceRange[0]} –{" "}
            {priceRange[1] >= MAX_PRICE ? "Any price" : `$${priceRange[1]}`}
          </Typography>
        </Box>
      </Box>

      {/* Skills Grid */}
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 3, sm: 5, md: 10 },
          py: { xs: 4, md: 5 },
        }}
      >
        {!loading && !error && (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography sx={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>
              Showing{" "}
              <Typography component="span" sx={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>
                {totalCount}
              </Typography>{" "}
              skills
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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 14, gap: 1 }}>
            <Typography sx={{ fontSize: 40, mb: 1 }}>⚠️</Typography>
            <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: 18 }}>
              Failed to load skills
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 14 }}>
              Please check your connection and try again.
            </Typography>
          </Box>
        )}

        {!loading && !error && skills.length === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 14, gap: 1 }}>
            <Typography sx={{ fontSize: 40, mb: 1 }}>🔍</Typography>
            <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: 18 }}>
              No skills found
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 14 }}>
              Try adjusting your search or filters.
            </Typography>
          </Box>
        )}

        {!loading && !error && skills.length > 0 && (
          <>
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
              {skills.map((skill) => (
                <SkillsCard skill={skill} key={skill.skillId} />
              ))}
            </Box>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, p) => {
                    updateParams({ page: String(p) });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  color="primary"
                  size="large"
                  sx={{ "& .MuiPaginationItem-root": { fontSize: 14, fontWeight: 500 } }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
