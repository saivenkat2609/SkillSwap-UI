import { useEffect, useState } from "react";
import { getSkillById } from "../Queries/skill-queries";
import type { SkillType } from "./SkillsGrid";
import BookingModal from "../Booking/BookingModal";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import SkillGradientCard, { getSkillGradientColor } from "./SkillGradientCard";
import RatingCard from "../Ratings/RatingCard";
import { useParams, useNavigate } from "react-router";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const mockReviews = [
  {
    name: "Sarah M.",
    initials: "SM",
    stars: 5,
    date: "2 days ago",
    text: "Excellent teacher! Explained concepts in a very clear and understandable way. Would definitely recommend to anyone starting out.",
  },
  {
    name: "Mike L.",
    initials: "ML",
    stars: 4,
    date: "1 week ago",
    text: "Great introduction to the subject. Highly recommend for beginners. Sessions were well-structured and engaging.",
  },
];

const pricingFeatures = [
  { icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />, text: "Instant booking available" },
  { icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} />, text: "Cancel up to 24 hours before" },
  { icon: <VerifiedOutlinedIcon sx={{ fontSize: 16 }} />, text: "Money-back guarantee" },
];

export default function SkillDetails() {
  const [skillDetails, setSkillDetails] = useState<SkillType>({} as SkillType);
  const [bookingOpen, setBookingOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const skillId = params.id;

  useEffect(() => {
    getSkillById(skillId as string)
      .then((response) => setSkillDetails(response.data))
      .catch((err) => console.error(err));
  }, [skillId]);

  const teacherInitials = skillDetails.teacherName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        skillId={skillDetails.skillId}
        teacherId={skillDetails.teacherId}
        pricePerHour={skillDetails.pricePerHour}
        skillTitle={skillDetails.title}
      />

      <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
        {/* Breadcrumb bar */}
        <Box
          sx={{
            bgcolor: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            px: { xs: 3, md: 6 },
            py: 1.5,
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: "16px !important" }} />}
              onClick={() => navigate("/")}
              sx={{
                color: "#64748b",
                fontSize: 13,
                fontWeight: 500,
                px: 1.5,
                "&:hover": { color: "#4f46e5", bgcolor: "#f5f3ff" },
              }}
            >
              Browse Skills
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 3, md: 5 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 6 },
          }}
        >
          {/* Left sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: 340 },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Skill image */}
            <Box sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
              <SkillGradientCard skill={skillDetails} styles={{ height: 320, width: "100%", borderRadius: 0 }} />
            </Box>

            {/* Teacher card */}
            <Card
              sx={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  bgcolor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase" }}>
                  About the Teacher
                </Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      background: getSkillGradientColor(skillDetails.skillId ?? 0),
                      fontSize: 18,
                      fontWeight: 700,
                      border: "2px solid #e2e8f0",
                    }}
                  >
                    {teacherInitials}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                      {skillDetails.teacherName}
                    </Typography>
                    <RatingCard skill={skillDetails} compact />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ fontSize: 13, fontWeight: 600 }}
                  >
                    View Full Profile
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ fontSize: 13, fontWeight: 600 }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>

          {/* Main content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Header section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {skillDetails.category?.name && (
                  <Chip
                    label={skillDetails.category.name}
                    size="small"
                    sx={{
                      bgcolor: "#eef2ff",
                      color: "#4338ca",
                      border: "1px solid #c7d2fe",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  />
                )}
                <Chip
                  label="Beginner Friendly"
                  size="small"
                  sx={{
                    bgcolor: "#f0fdf4",
                    color: "#166534",
                    border: "1px solid #bbf7d0",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: -0.5,
                  lineHeight: 1.2,
                  mb: 1.5,
                }}
              >
                {skillDetails.title}
              </Typography>
              <RatingCard skill={skillDetails} />
            </Box>

            {/* Pricing card */}
            <Card
              sx={{
                border: "1.5px solid #c7d2fe",
                borderRadius: "12px",
                bgcolor: "#fafafa",
                mb: 4,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 34,
                        color: "#4f46e5",
                        letterSpacing: -1,
                        lineHeight: 1,
                      }}
                    >
                      ${skillDetails.pricePerHour}
                    </Typography>
                    <Typography sx={{ fontSize: 15, color: "#64748b", fontWeight: 500 }}>
                      / hour
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: "#94a3b8", mt: 0.5 }}>
                    Billed per session
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 200 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => setBookingOpen(true)}
                    sx={{ fontWeight: 700, fontSize: 14 }}
                  >
                    Book a Session
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    Message Teacher
                  </Button>
                </Box>
              </Box>

              <Box sx={{ px: 3, py: 2, display: "flex", flexWrap: "wrap", gap: 2.5 }}>
                {pricingFeatures.map((f) => (
                  <Box key={f.text} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ color: "#10b981" }}>{f.icon}</Box>
                    <Typography sx={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
                      {f.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  mb: 1.5,
                }}
              >
                About this skill
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "#334155",
                  fontWeight: 400,
                }}
              >
                {skillDetails.description}
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Reviews */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Reviews
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    bgcolor: "#fefce8",
                    border: "1px solid #fef08a",
                    borderRadius: "8px",
                    px: 1.5,
                    py: 0.5,
                  }}
                >
                  <StarRoundedIcon sx={{ fontSize: 15, color: "#f59e0b" }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>
                    {skillDetails.rating?.toFixed(1) ?? "—"}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#a16207" }}>
                    ({skillDetails.numberOfReviews ?? 0} reviews)
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {mockReviews.map(({ name, initials, stars, date, text }) => (
                  <Card
                    key={name}
                    sx={{
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                      p: 2.5,
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "#eef2ff",
                            color: "#4338ca",
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>
                            {name}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.25 }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <StarRoundedIcon
                                key={i}
                                sx={{ fontSize: 13, color: i < stars ? "#f59e0b" : "#e2e8f0" }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>{date}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13.5, lineHeight: 1.65, color: "#475569" }}>
                      {text}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
