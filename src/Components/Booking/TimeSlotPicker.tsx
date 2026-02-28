import { Box, Button, Typography } from "@mui/material";
import type { DayAvailability, TimeSlot } from "./CalendarPicker";

interface Props {
  date: Date;
  availability: DayAvailability[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

const formatTime = (timeSpan: string) => {
  const [hours, minutes] = timeSpan.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${minutes} ${ampm}`;
};

export default function TimeSlotPicker({
  date,
  availability,
  selectedTime,
  onSelect,
}: Props) {
  const dayData = availability.find(
    (d) => new Date(d.date).toDateString() === date.toDateString()
  );
  const slots: TimeSlot[] = dayData?.slots || [];

  return (
    <Box>
      <Typography fontWeight={600} fontSize={18} mb={0.5}>
        Pick a time
      </Typography>
      <Typography color="text.secondary" fontSize={14} mb={3}>
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </Typography>

      {slots.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No slots available for this day
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
          }}
        >
          {slots.map((slot) => (
            <Button
              key={slot.startTime}
              variant={selectedTime === slot.startTime ? "contained" : "outlined"}
              disabled={slot.isBooked}
              onClick={() => onSelect(slot.startTime)}
              sx={{ py: 2, borderRadius: 2, flexDirection: "column" }}
            >
              <Typography fontWeight={600} fontSize={14}>
                {formatTime(slot.startTime)}
              </Typography>
              <Typography
                fontSize={11}
                color={slot.isBooked ? "text.disabled" : "success.main"}
              >
                {slot.isBooked ? "Booked" : "Available"}
              </Typography>
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
