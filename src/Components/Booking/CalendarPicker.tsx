import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Box, LinearProgress, Typography } from "@mui/material";
import { getTeacherAvailability } from "../Queries/booking-queries";

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface DayAvailability {
  date: string;
  slots: TimeSlot[];
}

interface Props {
  teacherId: string;
  duration: number;
  onSelect: (date: Date, availability: DayAvailability[]) => void;
}

export default function CalendarPicker({ teacherId, duration, onSelect }: Props) {
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  useEffect(() => {
    fetchAvailability(activeStartDate);
  }, [activeStartDate, duration]);

  const fetchAvailability = async (startDate: Date) => {
    setAvailability([]); // Clear stale data immediately before new fetch
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const fromDate = startDate < today ? today : startDate;
      const localDateStr = [
        fromDate.getFullYear(),
        String(fromDate.getMonth() + 1).padStart(2, "0"),
        String(fromDate.getDate()).padStart(2, "0"),
      ].join("-");
      const res = await getTeacherAvailability(
        teacherId,
        localDateStr,
        duration
      );
      setAvailability(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isDateAvailable = (date: Date) => {
    const dayData = availability.find(
      (d) => new Date(d.date).toDateString() === date.toDateString()
    );
    return dayData ? dayData.slots.some((s) => !s.isBooked) : false;
  };

  const isPastDate = (date: Date) =>
    date < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <Box>
      <Typography fontWeight={600} fontSize={18} mb={0.5}>
        Pick a date
      </Typography>
      <Typography color="text.secondary" fontSize={14} mb={2}>
        Only dates with available slots are selectable
      </Typography>
      <Box
        sx={{
          "& .react-calendar": {
            width: "100%",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            fontFamily: "inherit",
            padding: "8px",
          },
          "& .react-calendar__tile--active": {
            background: "#2563eb !important",
            borderRadius: "8px",
          },
          "& .react-calendar__tile:enabled:hover": {
            background: "#dbeafe",
            borderRadius: "8px",
          },
        }}
      >
        <Calendar
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) =>
            setActiveStartDate(activeStartDate!)
          }
          onClickDay={(date) => onSelect(date, availability)}
          tileDisabled={({ date }) =>
            isPastDate(date) || loading || !isDateAvailable(date)
          }
        />
        {loading && <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />}
      </Box>
    </Box>
  );
}
