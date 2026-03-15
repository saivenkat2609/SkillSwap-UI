import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { getMyBookings } from "../Queries/booking-queries";
import SkillsGrid from "../Skills/SkillsGrid";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

interface MyBooking {
  bookingId: number;
  skillTitle: string;
  teacherName: string;
  scheduledAt: string;
  durationMinutes: number;
  totalPrice: number;
  status: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Confirmed: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  Pending:   { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  Completed: { bg: "#eef2ff", color: "#3730a3", border: "#c7d2fe" },
  Cancelled: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
};

const FILTERS = ["All", "Upcoming", "Completed", "Cancelled"];

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function BookingCard({ booking }: { booking: MyBooking }) {
  const style = STATUS_COLORS[booking.status] ?? STATUS_COLORS["Pending"];
  return (
    <Card
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        bgcolor: "#ffffff",
        p: 2.5,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { sm: "center" },
        gap: 2,
      }}
    >
      {/* Left accent bar */}
      <Box
        sx={{
          width: { xs: "100%", sm: 4 },
          height: { xs: 4, sm: "100%" },
          minHeight: { sm: 60 },
          borderRadius: 4,
          bgcolor: style.color,
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      />

      {/* Main info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a", mb: 0.75 }}>
          {booking.skillTitle}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonOutlineIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
            <Typography sx={{ fontSize: 12, color: "#64748b" }}>{booking.teacherName}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarMonthOutlinedIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
            <Typography sx={{ fontSize: 12, color: "#64748b" }}>{formatDateTime(booking.scheduledAt)}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeOutlinedIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
            <Typography sx={{ fontSize: 12, color: "#64748b" }}>{booking.durationMinutes} min</Typography>
          </Box>
        </Box>
      </Box>

      {/* Right: price + status */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: { sm: "flex-end" }, gap: 1, flexShrink: 0 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#4f46e5" }}>
          ${booking.totalPrice.toFixed(2)}
        </Typography>
        <Chip
          label={booking.status}
          size="small"
          sx={{
            bgcolor: style.bg,
            color: style.color,
            border: `1px solid ${style.border}`,
            fontWeight: 600,
            fontSize: 11,
            height: 22,
          }}
        />
      </Box>
    </Card>
  );
}

export default function MySessions() {
  const [tab, setTab] = useState(1);
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (tab === 1) {
      setLoading(true);
      getMyBookings()
        .then((res) => setBookings(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [tab]);

  const now = new Date();
  const filtered = bookings.filter((b) => {
    if (filter === "Upcoming")  return new Date(b.scheduledAt) > now && b.status !== "Cancelled";
    if (filter === "Completed") return new Date(b.scheduledAt) < now && b.status !== "Cancelled";
    if (filter === "Cancelled") return b.status === "Cancelled";
    return true;
  });

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Tab bar */}
      <Box sx={{ bgcolor: "#ffffff", borderBottom: "1px solid #e2e8f0", px: { xs: 3, md: 6 } }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ "& .MuiTab-root": { fontSize: 13, fontWeight: 600, textTransform: "none", minHeight: 52 } }}
          >
            <Tab label="Browse Skills" />
            <Tab label="My Sessions" />
          </Tabs>
        </Box>
      </Box>

      {/* Tab panels */}
      {tab === 0 && <SkillsGrid />}

      {tab === 1 && (
        <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 3, md: 6 }, py: { xs: 3, md: 5 } }}>
          {/* Filter chips */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {FILTERS.map((f) => (
              <Chip
                key={f}
                label={f}
                onClick={() => setFilter(f)}
                variant={filter === f ? "filled" : "outlined"}
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                  ...(filter === f
                    ? { bgcolor: "#4f46e5", color: "#fff", border: "1px solid #4f46e5" }
                    : { color: "#64748b", borderColor: "#e2e8f0" }),
                }}
              />
            ))}
            <Typography sx={{ fontSize: 13, color: "#94a3b8", ml: "auto", alignSelf: "center" }}>
              {filtered.length} session{filtered.length !== 1 ? "s" : ""}
            </Typography>
          </Box>

          {/* Content */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography sx={{ fontSize: 14, color: "#94a3b8" }}>
                {filter === "All" ? "You haven't booked any sessions yet." : `No ${filter.toLowerCase()} sessions.`}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {filtered.map((b) => (
                <BookingCard key={b.bookingId} booking={b} />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
