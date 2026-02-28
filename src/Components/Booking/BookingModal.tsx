import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DurationPicker from "./DurationPicker";
import CalendarPicker, { type DayAvailability } from "./CalendarPicker";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingConfirmation from "./BookingConfirmation";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  skillId: number;
  teacherId: string;
  pricePerHour: number;
  skillTitle: string;
}

const steps = ["Duration", "Date", "Time", "Confirm"];

export default function BookingModal({
  open,
  onClose,
  skillId,
  teacherId,
  pricePerHour,
  skillTitle,
}: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleClose = () => {
    setCurrentStep(0);
    setSelectedDuration(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailability([]);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <DurationPicker
            selectedDuration={selectedDuration}
            onSelect={(d) => {
              setSelectedDuration(d);
              handleNext();
            }}
          />
        );
      case 1:
        return (
          <CalendarPicker
            teacherId={teacherId}
            duration={selectedDuration!}
            onSelect={(date, avail) => {
              setSelectedDate(date);
              setAvailability(avail);
              handleNext();
            }}
          />
        );
      case 2:
        return (
          <TimeSlotPicker
            date={selectedDate!}
            availability={availability}
            selectedTime={selectedTime}
            onSelect={(time) => {
              setSelectedTime(time);
              handleNext();
            }}
          />
        );
      case 3:
        return (
          <BookingConfirmation
            skillId={skillId}
            skillTitle={skillTitle}
            date={selectedDate!}
            time={selectedTime!}
            duration={selectedDuration!}
            pricePerHour={pricePerHour}
            onClose={handleClose}
          />
        );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={600} fontSize={18}>
            Book a Session
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStep()}

        {currentStep > 0 && currentStep < 3 && (
          <Button onClick={handleBack} sx={{ mt: 2 }} size="small">
            ← Back
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
