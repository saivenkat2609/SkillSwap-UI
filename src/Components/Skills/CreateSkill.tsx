import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Chip,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router";
import { createSkill, getCategories } from "../Queries/skill-queries";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type Category = { categoryId: number; name: string };

type SkillFormData = {
  title: string;
  categoryId: number;
  description: string;
  pricePerHour: string;
  image: File | null;
};

const STEPS = [
  { label: "Basic Info", desc: "Title & category" },
  { label: "Description", desc: "What you'll teach" },
  { label: "Pricing", desc: "Set your rate" },
  { label: "Cover Image", desc: "Upload a photo" },
  { label: "Review", desc: "Preview & publish" },
];

export default function CreateSkill() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SkillFormData>({
    title: "",
    categoryId: 0,
    description: "",
    pricePerHour: "",
    image: null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (
    field: keyof SkillFormData,
    value: SkillFormData[keyof SkillFormData]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    handleChange("image", null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setSubmitError("");
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("pricePerHour", formData.pricePerHour);
    data.append("categoryId", String(formData.categoryId));
    if (formData.image) data.append("image", formData.image);

    createSkill(data)
      .then((res) => navigate(`/skills/${res.data.skillId}`))
      .catch(() => setSubmitError("Failed to publish skill. Please try again."))
      .finally(() => setIsLoading(false));
  };

  const isStep1Valid = formData.title.trim() !== "" && formData.categoryId !== 0;
  const isStep2Valid = formData.description.trim() !== "";
  const isStep3Valid = formData.pricePerHour !== "" && Number(formData.pricePerHour) > 0;
  const selectedCategory = categories.find((c) => c.categoryId === formData.categoryId);

  const isCurrentStepValid = () => {
    if (currentStep === 0) return isStep1Valid;
    if (currentStep === 1) return isStep2Valid;
    if (currentStep === 2) return isStep3Valid;
    return true;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#0f172a", mb: 0.5 }}>
                Basic Information
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#64748b" }}>
                Give your skill a clear, descriptive title and choose a category.
              </Typography>
            </Box>
            <TextField
              label="Skill Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              fullWidth
              placeholder="e.g., React for Beginners"
              inputProps={{ maxLength: 80 }}
              helperText={
                <Typography component="span" sx={{ fontSize: 12, color: formData.title.length > 70 ? "#ef4444" : "#94a3b8" }}>
                  {formData.title.length}/80 characters
                </Typography>
              }
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId || ""}
                label="Category"
                onChange={(e) => handleChange("categoryId", Number(e.target.value))}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#0f172a", mb: 0.5 }}>
                Describe Your Skill
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#64748b" }}>
                Help students understand what they'll learn and what makes you unique.
              </Typography>
            </Box>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              multiline
              rows={8}
              fullWidth
              placeholder="Describe what students will learn, your teaching approach, prerequisites, and what makes your skill unique..."
              helperText={
                <Typography component="span" sx={{ fontSize: 12, color: "#94a3b8" }}>
                  {formData.description.length} characters · Aim for at least 150 characters
                </Typography>
              }
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#0f172a", mb: 0.5 }}>
                Set Your Rate
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#64748b" }}>
                Choose a competitive price based on your expertise and market rates.
              </Typography>
            </Box>
            <TextField
              label="Price Per Hour (USD)"
              type="number"
              value={formData.pricePerHour}
              onChange={(e) => handleChange("pricePerHour", e.target.value)}
              fullWidth
              inputProps={{ min: 1 }}
              helperText="Recommended: $30–$100/hr depending on expertise and demand"
              slotProps={{
                input: {
                  startAdornment: (
                    <Typography sx={{ color: "#64748b", mr: 0.5, fontWeight: 600 }}>$</Typography>
                  ),
                },
              }}
            />
            {formData.pricePerHour && Number(formData.pricePerHour) > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  bgcolor: "#f5f3ff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "10px",
                  p: 2.5,
                }}
              >
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Typography sx={{ fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", mb: 0.5 }}>
                    1 hr session
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 22, color: "#4338ca" }}>
                    ${formData.pricePerHour}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Typography sx={{ fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", mb: 0.5 }}>
                    2 hr session
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 22, color: "#4338ca" }}>
                    ${Number(formData.pricePerHour) * 2}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Typography sx={{ fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", mb: 0.5 }}>
                    3 hr session
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 22, color: "#4338ca" }}>
                    ${Number(formData.pricePerHour) * 3}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#0f172a", mb: 0.5 }}>
                Cover Image
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#64748b" }}>
                A great cover image increases your skill's visibility. This step is optional.
              </Typography>
            </Box>

            {imagePreview ? (
              <Box>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Box
                    component="img"
                    src={imagePreview}
                    sx={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(0,0,0,0.0)",
                      transition: "background 0.2s",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.15)" },
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5 }}>
                  <Typography sx={{ fontSize: 13, color: "#64748b" }}>{formData.image?.name}</Typography>
                  <Button
                    onClick={handleRemoveImage}
                    startIcon={<DeleteOutlineIcon fontSize="small" />}
                    size="small"
                    color="error"
                    variant="text"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button
                component="label"
                variant="outlined"
                sx={{
                  py: 7,
                  border: "2px dashed #c7d2fe",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  color: "#4f46e5",
                  bgcolor: "#fafbff",
                  "&:hover": {
                    borderColor: "#4f46e5",
                    bgcolor: "#f5f3ff",
                  },
                }}
              >
                <CloudUploadOutlinedIcon sx={{ fontSize: 44, color: "#a5b4fc" }} />
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#4338ca" }}>
                  Click to upload image
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
                  PNG or JPG · Max 5MB · Optional
                </Typography>
                <input type="file" hidden accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
              </Button>
            )}
          </Box>
        );

      case 4:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#0f172a", mb: 0.5 }}>
                Review & Publish
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#64748b" }}>
                This is how your skill will appear to students. Make sure everything looks right.
              </Typography>
            </Box>

            <Card sx={{ borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  sx={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                />
              ) : (
                <Box
                  sx={{
                    height: 120,
                    background: "linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                    No image uploaded
                  </Typography>
                </Box>
              )}
              <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {selectedCategory && (
                  <Chip
                    label={selectedCategory.name}
                    size="small"
                    sx={{ alignSelf: "flex-start", bgcolor: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe", fontWeight: 600 }}
                  />
                )}
                <Typography sx={{ fontWeight: 800, fontSize: 19, color: "#0f172a", letterSpacing: -0.3 }}>
                  {formData.title || "—"}
                </Typography>
                <Typography sx={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {formData.description || "—"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mt: 0.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 22, color: "#4f46e5", letterSpacing: -0.5 }}>
                    ${formData.pricePerHour || "0"}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>/hour</Typography>
                </Box>
              </Box>
            </Card>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                p: 2,
              }}
            >
              <CheckCircleIcon sx={{ color: "#10b981", fontSize: 22, flexShrink: 0 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, color: "#166534", fontSize: 14 }}>
                  Ready to publish
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#15803d" }}>
                  Your skill will be immediately visible to students after publishing.
                </Typography>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Page header */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          px: { xs: 3, md: 8 },
          py: 3,
        }}
      >
        <Box sx={{ maxWidth: 720, mx: "auto" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: -0.5, mb: 0.5 }}
          >
            Create a New Skill
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 15 }}>
            Share your expertise and start earning from 1-on-1 teaching sessions.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 720,
          mx: "auto",
          px: { xs: 3, md: 4 },
          py: { xs: 3, md: 5 },
        }}
      >
        {/* Progress */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
              Step {currentStep + 1} of {STEPS.length}
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#4f46e5" }}>
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}% complete
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={((currentStep + 1) / STEPS.length) * 100}
            sx={{
              height: 5,
              borderRadius: "100px",
              bgcolor: "#e2e8f0",
              "& .MuiLinearProgress-bar": {
                borderRadius: "100px",
                background: "linear-gradient(90deg, #4f46e5, #6366f1)",
              },
            }}
          />
        </Box>

        {/* Stepper */}
        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {STEPS.map((step, idx) => (
            <Step key={step.label} completed={idx < currentStep}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    fontSize: 12,
                    fontWeight: idx === currentStep ? 700 : 400,
                    color: idx === currentStep ? "#4f46e5 !important" : undefined,
                  },
                  "& .MuiStepIcon-root.Mui-active": { color: "#4f46e5" },
                  "& .MuiStepIcon-root.Mui-completed": { color: "#10b981" },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form card */}
        <Card
          sx={{
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            overflow: "visible",
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            {renderStep()}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 5,
                pt: 3,
                borderTop: "1px solid #f1f5f9",
                gap: 2,
              }}
            >
              <Button
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 0}
                variant="outlined"
                sx={{ px: 3, fontWeight: 600 }}
              >
                Previous
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  variant="contained"
                  disabled={!isCurrentStepValid()}
                  sx={{ px: 3, fontWeight: 600 }}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={15} color="inherit" /> : null}
                  sx={{ px: 3, fontWeight: 700 }}
                >
                  {isLoading ? "Publishing..." : "Publish Skill"}
                </Button>
              )}
            </Box>

            {submitError && (
              <Alert severity="error" sx={{ mt: 2, fontSize: 13 }}>
                {submitError}
              </Alert>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

function Divider({ orientation, flexItem }: { orientation?: string; flexItem?: boolean }) {
  return (
    <Box
      sx={{
        width: orientation === "vertical" ? "1px" : "100%",
        height: orientation === "vertical" ? (flexItem ? "auto" : 40) : "1px",
        bgcolor: "#c7d2fe",
        mx: orientation === "vertical" ? 1 : 0,
        my: orientation === "vertical" ? 0 : 1,
        alignSelf: flexItem ? "stretch" : "auto",
      }}
    />
  );
}
