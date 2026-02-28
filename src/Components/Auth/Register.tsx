import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate } from "react-router";
import { registerUser } from "../Queries/user-queries";
import { useAuth } from "../../context/AuthContext";

interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

function checkRequirements(value: string): PasswordRequirements {
  return {
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[!@#$%^&*]/.test(value),
  };
}

function getStrength(reqs: PasswordRequirements): "weak" | "medium" | "strong" {
  const count = Object.values(reqs).filter(Boolean).length;
  if (count >= 5) return "strong";
  if (count >= 3) return "medium";
  return "weak";
}

const strengthConfig = {
  weak: { width: "33%", color: "#ef4444", label: "Weak" },
  medium: { width: "66%", color: "#f59e0b", label: "Medium" },
  strong: { width: "100%", color: "#10b981", label: "Strong" },
};

const requirementLabels: Record<keyof PasswordRequirements, string> = {
  length: "At least 8 characters",
  uppercase: "One uppercase letter",
  lowercase: "One lowercase letter",
  number: "One number",
  special: "One special character (!@#$%^&*)",
};

const sidePoints = [
  "Book 1-on-1 sessions with expert teachers",
  "Learn at your own pace, on your schedule",
  "Cancel or reschedule up to 24 hours before",
  "Money-back guarantee on your first session",
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const requirements = checkRequirements(password);
  const strength = getStrength(requirements);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const confirmMatch = confirmPassword.length > 0 && confirmPassword === password;
  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || confirmMismatch || !terms) return;
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
    try {
      const res = await registerUser({ firstName, lastName, email, password, isTeacher });
      login(res.data);
      navigate("/");
    } catch (err: any) {
      const errors: { code: string; description: string }[] = err.response?.data ?? [];
      errors.forEach(({ code, description }) => {
        if (code.toLowerCase().includes("email") || code.toLowerCase().includes("username")) {
          setEmailError(description);
        } else if (code.toLowerCase().includes("password")) {
          setPasswordError(description);
        } else {
          setGeneralError(description);
        }
      });
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
          width: "38%",
          flexShrink: 0,
          background: "linear-gradient(155deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
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
              fontSize: { lg: "2rem", xl: "2.5rem" },
              letterSpacing: -1.5,
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Start your
            <br />
            learning journey
          </Typography>
          <Typography
            sx={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.6, mb: 5 }}
          >
            Join over 10,000 learners who have already accelerated their careers with SkillSwap.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sidePoints.map((point) => (
              <Box key={point} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: "rgba(99,102,241,0.3)",
                    border: "1px solid rgba(129,140,248,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  <Typography sx={{ color: "#818cf8", fontSize: 11, fontWeight: 700 }}>✓</Typography>
                </Box>
                <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 13.5, lineHeight: 1.5 }}>
                  {point}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            bgcolor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            p: 2.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Typography key={n} sx={{ color: "#f59e0b", fontSize: 14 }}>★</Typography>
            ))}
          </Box>
          <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 13.5, lineHeight: 1.6, mb: 1.5, fontStyle: "italic" }}>
            "I went from beginner to job-ready in 3 months. The teachers on SkillSwap are truly exceptional."
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
            Alex K. · Software Engineer
          </Typography>
        </Box>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          bgcolor: "#f8fafc",
          p: { xs: 3, sm: 5 },
          overflowY: "auto",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 460, pt: { xs: 2, sm: 3 }, pb: 4 }}>
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
            Create your account
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 15, mb: 4 }}>
            Already have an account?{" "}
            <Typography
              component="span"
              onClick={() => navigate("/login")}
              sx={{ color: "#4f46e5", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              Sign in
            </Typography>
          </Typography>

          {generalError && (
            <Alert severity="error" sx={{ mb: 3, fontSize: 13 }}>{generalError}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Name row */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="First name"
                fullWidth
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
              />
              <TextField
                label="Last name"
                fullWidth
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
              />
            </Box>

            <TextField
              label="Email address"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              onBlur={() => setEmailTouched(true)}
              placeholder="you@example.com"
              error={!!emailError}
              helperText={emailError || undefined}
              color={!emailError && emailTouched && emailValid ? "success" : undefined}
              focused={!emailError && emailTouched && emailValid ? true : undefined}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
              placeholder="Create a strong password"
              error={!!passwordError}
              helperText={passwordError || undefined}
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

            {/* Password strength */}
            {password.length > 0 && (
              <Box sx={{ mt: -1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ flex: 1, height: 4, bgcolor: "#e2e8f0", borderRadius: "100px", overflow: "hidden" }}>
                    <Box
                      sx={{
                        height: "100%",
                        width: strengthConfig[strength].width,
                        bgcolor: strengthConfig[strength].color,
                        borderRadius: "100px",
                        transition: "width 0.35s ease, background-color 0.35s ease",
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: strengthConfig[strength].color, minWidth: 44 }}>
                    {strengthConfig[strength].label}
                  </Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5 }}>
                  {(Object.entries(requirements) as [keyof PasswordRequirements, boolean][]).map(([key, met]) => (
                    <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      {met ? (
                        <CheckCircleIcon sx={{ fontSize: 13, color: "#10b981" }} />
                      ) : (
                        <RadioButtonUncheckedIcon sx={{ fontSize: 13, color: "#cbd5e1" }} />
                      )}
                      <Typography sx={{ fontSize: 11.5, color: met ? "#10b981" : "#94a3b8" }}>
                        {requirementLabels[key]}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            <TextField
              label="Confirm password"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              error={confirmMismatch}
              helperText={confirmMismatch ? "Passwords do not match" : undefined}
              color={confirmMatch ? "success" : undefined}
              focused={confirmMatch ? true : undefined}
            />

            {/* Role toggle */}
            <Box
              sx={{
                border: "1px solid",
                borderColor: isTeacher ? "#c7d2fe" : "#e2e8f0",
                borderRadius: "10px",
                p: 2,
                bgcolor: isTeacher ? "#f5f3ff" : "#ffffff",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onClick={() => setIsTeacher(!isTeacher)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Checkbox
                  checked={isTeacher}
                  onChange={(e) => setIsTeacher(e.target.checked)}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  sx={{ p: 0, "& .MuiSvgIcon-root": { color: isTeacher ? "#4f46e5" : "#94a3b8" } }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: "#0f172a" }}>
                    Register as a Teacher
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                    Create and sell your own skill sessions
                  </Typography>
                </Box>
              </Box>
            </Box>

            <FormControlLabel
              sx={{ alignItems: "flex-start", mx: 0 }}
              control={
                <Checkbox
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                  size="small"
                  sx={{ pt: 0, pr: 1, "& .MuiSvgIcon-root": { color: terms ? "#4f46e5" : "#94a3b8" } }}
                />
              }
              label={
                <Typography sx={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                  I agree to the{" "}
                  <Typography component="span" sx={{ color: "#4f46e5", fontWeight: 500, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                    Terms of Service
                  </Typography>{" "}
                  and{" "}
                  <Typography component="span" sx={{ color: "#4f46e5", fontWeight: 500, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                    Privacy Policy
                  </Typography>
                </Typography>
              }
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !terms}
              sx={{ py: 1.5, fontSize: 15, fontWeight: 700 }}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography sx={{ fontSize: 12, color: "#94a3b8", px: 1 }}>OR</Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            sx={{
              borderColor: "#e2e8f0",
              color: "#0f172a",
              bgcolor: "#ffffff",
              py: 1.25,
              fontWeight: 600,
              fontSize: 14,
              gap: 1.5,
              "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20">
              <path fill="#4285F4" d="M19.8 10.2c0-.6-.1-1.3-.2-1.9H10v3.6h5.5c-.2 1.2-1 2.2-2.1 2.9v2.3h3.4c2-1.8 3-4.5 3-7.9z" />
              <path fill="#34A853" d="M10 20c2.8 0 5.2-.9 6.9-2.5l-3.4-2.3c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H.7v2.4C2.4 17.8 5.9 20 10 20z" />
              <path fill="#FBBC05" d="M4.2 11.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V5.7H.7C.3 6.9 0 8.4 0 10s.2 3.1.7 4.3l3.5-2.4z" />
              <path fill="#EA4335" d="M10 4c1.5 0 2.9.5 4 1.5l3-3C15.2.9 12.8 0 10 0 5.9 0 2.4 2.2.7 5.7l3.5 2.4C5 5.8 7.3 4 10 4z" />
            </svg>
            Continue with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
