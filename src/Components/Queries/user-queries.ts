import api from "../../lib/api";

export async function registerUser({
  firstName,
  lastName,
  email,
  password,
  isTeacher,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isTeacher: boolean;
}) {
  const res = await api.post("/api/auth/register", {
    firstName,
    lastName,
    email,
    password,
    isTeacher,
  });
  return res;
}
export async function loginUser({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe: boolean;
}) {
  const res = await api.post(`/api/auth/login`, {
    email,
    password,
    rememberMe,
  });
  return res;
}
export async function logoutUser() {
  const res = await api.post(`/api/auth/logout`);
  return res;
}
