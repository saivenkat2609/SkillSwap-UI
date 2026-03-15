import { useState } from "react";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { updateRole } from "../Queries/auth-queries";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

const OPTIONS = [
  {
    role: "Student",
    icon: <MenuBookOutlinedIcon sx={{ fontSize: 28 }} />,
    title: "I want to learn",
    desc: "Book 1-on-1 sessions with expert teachers",
  },
  {
    role: "Teacher",
    icon: <SchoolOutlinedIcon sx={{ fontSize: 28 }} />,
    title: "I want to teach",
    desc: "Share your skills and earn money",
  },
];

export default function Onboarding() {
  const [selected, setSelected] = useState<"Student" | "Teacher" | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await updateRole(selected);
      login(res.data);
      navigate("/");
    } catch {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        bgcolor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 480, width: "100%" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "#0f172a", mb: 1, letterSpacing: -0.5 }}
        >
          What brings you to SkillBridge?
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mb: 4 }}>
          This helps us personalise your experience. You can change this later.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          {OPTIONS.map(({ role, icon, title, desc }) => (
            <Card
              key={role}
              onClick={() => setSelected(role as "Student" | "Teacher")}
              sx={{
                flex: 1,
                p: 3,
                cursor: "pointer",
                borderRadius: "12px",
                border: selected === role ? "2px solid #4f46e5" : "1px solid #e2e8f0",
                bgcolor: selected === role ? "#eef2ff" : "#ffffff",
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: selected === role ? "#4f46e5" : "#94a3b8",
                },
              }}
            >
              <Box
                sx={{
                  color: selected === role ? "#4f46e5" : "#94a3b8",
                  mb: 1.5,
                  transition: "color 0.15s",
                }}
              >
                {icon}
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a", mb: 0.5 }}
              >
                {title}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#64748b" }}>{desc}</Typography>
            </Card>
          ))}
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={!selected || loading}
          onClick={handleContinue}
          sx={{ fontWeight: 700, py: 1.5 }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Continue"}
        </Button>
      </Box>
    </Box>
  );
}
