import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../Queries/auth-queries";
import {
  Box,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../Queries/user-queries";

const features = [
  { icon: "🎯", title: "Expert Teachers", desc: "Learn from vetted professionals" },
  { icon: "📅", title: "Flexible Booking", desc: "Schedule sessions that fit your calendar" },
  { icon: "⭐", title: "Verified Reviews", desc: "Transparent ratings from real students" },
];

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20">
    <path fill="#4285F4" d="M19.8 10.2c0-.6-.1-1.3-.2-1.9H10v3.6h5.5c-.2 1.2-1 2.2-2.1 2.9v2.3h3.4c2-1.8 3-4.5 3-7.9z" />
    <path fill="#34A853" d="M10 20c2.8 0 5.2-.9 6.9-2.5l-3.4-2.3c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H.7v2.4C2.4 17.8 5.9 20 10 20z" />
    <path fill="#FBBC05" d="M4.2 11.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V5.7H.7C.3 6.9 0 8.4 0 10s.2 3.1.7 4.3l3.5-2.4z" />
    <path fill="#EA4335" d="M10 4c1.5 0 2.9.5 4 1.5l3-3C15.2.9 12.8 0 10 0 5.9 0 2.4 2.2.7 5.7l3.5 2.4C5 5.8 7.3 4 10 4z" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser({ email, password, rememberMe });
      login(res.data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* Left branding panel */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          width: "42%",
          flexShrink: 0,
          background: "linear-gradient(155deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 15% 85%, rgba(99,102,241,0.2) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(79,70,229,0.15) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        <Box sx={{ position: "relative" }}>
          {/* Logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", mb: 6 }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>S</Typography>
            </Box>
            <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>
              SkillSwap
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              color: "#ffffff",
              fontWeight: 800,
              fontSize: { lg: "2.25rem", xl: "2.75rem" },
              letterSpacing: -1.5,
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Learn anything
            <br />
            from experts
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.6, mb: 5 }}>
            Join thousands of learners discovering skills through personalized one-on-one sessions.
          </Typography>

          {/* Feature list */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {features.map((f) => (
              <Box key={f.title} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    bgcolor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </Box>
                <Box>
                  <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: 14, mb: 0.25 }}>
                    {f.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                    {f.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Bottom testimonial */}
        <Box
          sx={{
            position: "relative",
            bgcolor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            p: 2.5,
          }}
        >
          <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6, mb: 1.5, fontStyle: "italic" }}>
            "SkillSwap helped me learn React from a senior developer in just 2 weeks. The personalized approach made all the difference."
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #818cf8, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>JD</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: "#ffffff", fontSize: 13, fontWeight: 600 }}>Jamie Davis</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>Frontend Developer</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8fafc",
          p: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: { xs: "flex", lg: "none" },
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              mb: 4,
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>S</Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>SkillSwap</Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.75, letterSpacing: -0.5 }}>
            Welcome back
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 15, mb: 4 }}>
            Don't have an account?{" "}
            <Typography
              component="span"
              onClick={() => navigate("/register")}
              sx={{
                color: "#4f46e5",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign up free
            </Typography>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, fontSize: 13 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    sx={{ "& .MuiSvgIcon-root": { color: "#4f46e5" } }}
                  />
                }
                label={<Typography sx={{ fontSize: 13, color: "#64748b" }}>Remember me</Typography>}
              />
              <Typography
                onClick={() => navigate("/forgot-password")}
                sx={{
                  fontSize: 13,
                  color: "#4f46e5",
                  fontWeight: 500,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.5, mt: 0.5, fontSize: 15, fontWeight: 700 }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography sx={{ fontSize: 12, color: "#94a3b8", px: 1 }}>OR CONTINUE WITH</Typography>
          </Divider>

          <Box sx={{ "& > div": { width: "100% !important" } }}>
            <GoogleLogin
              width="420"
              text="continue_with"
              theme="outline"
              size="large"
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await googleLogin(credentialResponse.credential!);
                  login(res.data);
                  if (res.data.isNewUser) {
                    navigate("/onboarding");
                  } else {
                    navigate("/");
                  }
                } catch {
                  setError("Google sign-in failed. Please try again.");
                }
              }}
              onError={() => setError("Google sign-in failed. Please try again.")}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
