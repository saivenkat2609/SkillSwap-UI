import { useState } from "react";
import { useNavigate } from "react-router";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { forgotPassword } from "../Queries/auth-queries";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f8fafc", p: 3 }}>
        <Paper elevation={0} sx={{ maxWidth: 420, width: "100%", p: 5, borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
            <MarkEmailReadIcon sx={{ fontSize: 32, color: "#4f46e5" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5, letterSpacing: -0.5 }}>
            Check your inbox
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 15, lineHeight: 1.7, mb: 3 }}>
            If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
          </Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
            Remember your password?{" "}
            <Typography component="span" onClick={() => navigate("/login")} sx={{ color: "#4f46e5", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
              Sign in
            </Typography>
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f8fafc", p: 3 }}>
      <Paper elevation={0} sx={{ maxWidth: 420, width: "100%", p: 5, borderRadius: "16px", border: "1px solid #e2e8f0" }}>

        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 1, letterSpacing: -0.5 }}>
          Forgot your password?
        </Typography>
        <Typography sx={{ color: "#64748b", fontSize: 15, mb: 4, lineHeight: 1.6 }}>
          Enter your email and we'll send you a reset link.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, fontSize: 13 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ py: 1.5, fontWeight: 700 }}
          >
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </Box>

        <Typography sx={{ color: "#94a3b8", fontSize: 13, mt: 3, textAlign: "center" }}>
          Back to{" "}
          <Typography component="span" onClick={() => navigate("/login")} sx={{ color: "#4f46e5", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
            Sign in
          </Typography>
        </Typography>

      </Paper>
    </Box>
  );
}
