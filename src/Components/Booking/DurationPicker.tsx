import { Box, Button, Typography } from "@mui/material";

const durations = [
  { label: "1 Hour", minutes: 60 },
  { label: "1.5 Hours", minutes: 90 },
  { label: "2 Hours", minutes: 120 },
];

interface Props {
  selectedDuration: number | null;
  onSelect: (duration: number) => void;
}

export default function DurationPicker({ selectedDuration, onSelect }: Props) {
  return (
    <Box>
      <Typography fontWeight={600} fontSize={18} mb={0.5}>
        How long is your session?
      </Typography>
      <Typography color="text.secondary" fontSize={14} mb={3}>
        Select the duration that works best for you
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {durations.map(({ label, minutes }) => (
          <Button
            key={minutes}
            variant={selectedDuration === minutes ? "contained" : "outlined"}
            size="large"
            onClick={() => onSelect(minutes)}
            sx={{ justifyContent: "flex-start", px: 3, py: 2, borderRadius: 2 }}
          >
            <Typography fontWeight={600}>{label}</Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
}
