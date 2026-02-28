import axios from "axios";

const successFn = (response: any) => response;
const errorFn = (error: any) => {
  if (error.response?.status === 401) {
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/register"
    ) {
      window.location.href = "/login";
    }
  }
  return Promise.reject(error);
};
const api = axios.create({
  baseURL: import.meta.env.VITE_BFF_URL || "http://localhost:5000",
  withCredentials: true,
});
api.interceptors.response.use(successFn, errorFn);
export default api;
