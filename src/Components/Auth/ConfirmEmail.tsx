import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { confirmEmail } from "../Queries/auth-queries";

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");
    if (!userId || !token) {
      setStatus("error");
      return;
    }

    confirmEmail(userId, token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f8fafc", p: 3 }}>
      <Paper elevation={0} sx={{ maxWidth: 420, width: "100%", p: 5, borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "center" }}>

        {status === "loading" && (
          <>
            <CircularProgress sx={{ color: "#4f46e5", mb: 3 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Confirming your email...
            </Typography>
          </>
        )}

        {status === "success" && (
          <>
            <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 36, color: "#16a34a" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5, letterSpacing: -0.5 }}>
              Email confirmed!
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 15, mb: 3 }}>
              Your account is now active. You can sign in.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate("/login")}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              Go to Sign In
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
              <ErrorOutlineIcon sx={{ fontSize: 36, color: "#dc2626" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5, letterSpacing: -0.5 }}>
              Confirmation failed
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 15, mb: 3 }}>
              This link may have expired or already been used. Try registering again.
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => navigate("/register")}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              Back to Register
            </Button>
          </>
        )}

      </Paper>
    </Box>
  );
}
