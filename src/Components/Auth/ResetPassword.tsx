import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Alert, Box, Button, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { resetPassword } from "../Queries/auth-queries";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId") ?? "";
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const confirmMatch = confirmPassword.length > 0 && confirmPassword === newPassword;
  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmMismatch) return;
    setLoading(true);
    setError("");
    try {
      await resetPassword(userId, token, newPassword);
      setSuccess(true);
    } catch {
      setError("This reset link may have expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f8fafc", p: 3 }}>
        <Paper elevation={0} sx={{ maxWidth: 420, width: "100%", p: 5, borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 36, color: "#16a34a" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5, letterSpacing: -0.5 }}>
            Password reset!
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 15, mb: 3 }}>
            Your password has been updated. You can now sign in with your new password.
          </Typography>
          <Button variant="contained" fullWidth size="large" onClick={() => navigate("/login")} sx={{ py: 1.5, fontWeight: 700 }}>
            Go to Sign In
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f8fafc", p: 3 }}>
      <Paper elevation={0} sx={{ maxWidth: 420, width: "100%", p: 5, borderRadius: "16px", border: "1px solid #e2e8f0" }}>

        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 1, letterSpacing: -0.5 }}>
          Set new password
        </Typography>
        <Typography sx={{ color: "#64748b", fontSize: 15, mb: 4 }}>
          Choose a strong password for your account.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, fontSize: 13 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="New password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
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

          <TextField
            label="Confirm new password"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            error={confirmMismatch}
            helperText={confirmMismatch ? "Passwords do not match" : undefined}
            color={confirmMatch ? "success" : undefined}
            focused={confirmMatch ? true : undefined}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || confirmMismatch || newPassword.length === 0}
            sx={{ py: 1.5, fontWeight: 700 }}
          >
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </Box>

      </Paper>
    </Box>
  );
}
