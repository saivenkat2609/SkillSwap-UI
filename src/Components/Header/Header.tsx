import { AppBar, Avatar, Badge, Box, Button, Chip, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export default function Header() {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();
  const { unreadCount } = useChat();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid",
        borderColor: "grey.200",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        sx={{
          gap: 2,
          px: { xs: 2, md: 4 },
          height: 64,
          minHeight: "64px !important",
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            flexShrink: 0,
            userSelect: "none",
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
              flexShrink: 0,
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1 }}>
              S
            </Typography>
          </Box>
          <Typography
            fontWeight={700}
            fontSize={17}
            sx={{ color: "#0f172a", letterSpacing: -0.4 }}
          >
            SkillBridge
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
          {userData ? (
            <>
              {userData.role !== "Teacher" && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate("/my-sessions")}
                  sx={{ color: "#64748b", px: 2, "&:hover": { color: "#4f46e5" } }}
                >
                  My Sessions
                </Button>
              )}
              {userData.role === "Teacher" && (
                <>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate("/teacher/dashboard")}
                    sx={{ color: "#64748b", px: 2, "&:hover": { color: "#4f46e5" } }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon sx={{ fontSize: "16px !important" }} />}
                    onClick={() => navigate("/skills/create")}
                    sx={{ px: 2 }}
                  >
                    Create Skill
                  </Button>
                </>
              )}

              <Tooltip title="Messages">
                <IconButton
                  onClick={() => navigate("/chat")}
                  sx={{
                    color: "#64748b",
                    "&:hover": { bgcolor: "#f5f3ff", color: "#4f46e5" },
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error" max={99}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: 22 }} />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  pl: 1.5,
                  borderLeft: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                        color: "#fff !important",
                        fontWeight: 700,
                        fontSize: "11px !important",
                      }}
                    >
                      {initials || "U"}
                    </Avatar>
                  }
                  label={userData.name || "Account"}
                  variant="outlined"
                  sx={{
                    borderColor: "grey.200",
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: 13,
                    height: 34,
                    cursor: "default",
                  }}
                />
                <Button
                  variant="text"
                  size="small"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon sx={{ fontSize: "15px !important" }} />}
                  sx={{
                    color: "text.secondary",
                    px: 1.5,
                    "&:hover": { color: "error.main", bgcolor: "error.light" },
                  }}
                >
                  Log out
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/login")}
                sx={{ color: "text.secondary", px: 2, "&:hover": { color: "primary.main" } }}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/register")}
                sx={{ px: 2.5 }}
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
