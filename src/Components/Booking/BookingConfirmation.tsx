import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { createBooking } from "../Queries/booking-queries";

interface Props {
  skillId: number;
  skillTitle: string;
  date: Date;
  time: string;
  duration: number;
  pricePerHour: number;
  onClose: () => void;
}

const formatTime = (timeSpan: string) => {
  const [hours, minutes] = timeSpan.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${minutes} ${ampm}`;
};

export default function BookingConfirmation({
  skillId,
  skillTitle,
  date,
  time,
  duration,
  pricePerHour,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = ((pricePerHour * duration) / 60).toFixed(2);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const scheduledAt = new Date(date);
      scheduledAt.setHours(hours, minutes, seconds || 0, 0);
      await createBooking({
        skillId,
        scheduledAt: scheduledAt.toISOString(),
        durationInMinutes: duration,
      });
      setSuccess(true);
    } catch (e: any) {
      setError(e.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography fontSize={56}>🎉</Typography>
        <Typography fontWeight={700} fontSize={20} mt={2}>
          Booking Requested!
        </Typography>
        <Typography color="text.secondary" mt={1} mb={3}>
          Your session has been requested. The teacher will confirm shortly.
        </Typography>
        <Button variant="contained" onClick={onClose}>
          Done
        </Button>
      </Box>
    );
  }

  const summaryItems = [
    {
      label: "Skill",
      value: skillTitle,
    },
    {
      label: "Date",
      value: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    { label: "Time", value: formatTime(time) },
    {
      label: "Duration",
      value: `${duration / 60} hour${duration > 60 ? "s" : ""}`,
    },
    { label: "Total Price", value: `$${totalPrice}` },
  ];

  return (
    <Box>
      <Typography fontWeight={600} fontSize={18} mb={3}>
        Review your booking
      </Typography>

      <Box sx={{ bgcolor: "grey.50", borderRadius: 2, p: 3, mb: 3 }}>
        {summaryItems.map(({ label, value }, i) => (
          <Box key={label}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}
            >
              <Typography fontSize={14} color="text.secondary">
                {label}
              </Typography>
              <Typography
                fontSize={14}
                fontWeight={label === "Total Price" ? 700 : 400}
                color={label === "Total Price" ? "primary.main" : "text.primary"}
              >
                {value}
              </Typography>
            </Box>
            {i < summaryItems.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>

      {error && (
        <Typography color="error" fontSize={14} mb={2}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleConfirm}
        disabled={loading}
        sx={{ borderRadius: 2, py: 1.5 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Confirm Booking"
        )}
      </Button>
    </Box>
  );
}
