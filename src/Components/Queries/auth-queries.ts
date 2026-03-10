import api from "../../lib/api";

export default function VerifyUser() {
  const res = api.get("/api/auth/me");
  return res;
}

export const googleLogin = (idToken: string) =>
  api.post("/api/auth/google", { idToken });

export const updateRole = (role: string) =>
  api.patch("/api/auth/role", { role });
export const confirmEmail = (userId: string, token: string) =>
  api.get(`/api/auth/confirm-email?userId=${userId}&token=${token}`);

export const forgotPassword = (email: string) =>
  api.post("/api/auth/forgot-password", { email });

export const resetPassword = (userId: string, token: string, newPassword: string) =>
  api.post("/api/auth/reset-password", { userId, token, newPassword });
