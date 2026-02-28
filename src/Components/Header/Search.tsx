import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <TextField
      placeholder="Search skills, topics, or teachers..."
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        width: { xs: 180, sm: 280, md: 400 },
        "& .MuiOutlinedInput-root": {
          bgcolor: "#f8fafc",
          borderRadius: "8px",
          fontSize: 14,
          "& fieldset": { borderColor: "#e2e8f0" },
          "&:hover fieldset": { borderColor: "#94a3b8" },
          "&.Mui-focused fieldset": { borderColor: "#4f46e5" },
          "&.Mui-focused": { bgcolor: "#ffffff" },
        },
      }}
    />
  );
}
