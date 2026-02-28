import api from "../../lib/api";

export default function VerifyUser() {
  const res = api.get("/api/auth/me");
  return res;
}
