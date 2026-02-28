import api from "../../lib/api";

export const getTeacherAvailability = (
  teacherId: string,
  fromDate: string,
  durationInMinutes: number
) =>
  api.get(`/api/teachers/${teacherId}/availability`, {
    params: { fromDate, durationInMinutes },
  });

export const createBooking = (data: {
  skillId: number;
  scheduledAt: string;
  durationInMinutes: number;
}) => api.post("/api/bookings", data);
