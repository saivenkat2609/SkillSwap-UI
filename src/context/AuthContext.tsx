import { createContext, useContext, useEffect, useState } from "react";
import VerifyUser from "../Components/Queries/auth-queries";
import { logoutUser } from "../Components/Queries/user-queries";
export interface User {
  id: string;
  email: string;
  role: string;
}
interface AuthContextType {
  userData: User | null;
  isLoading: boolean;
  login: (data: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    function verify() {
      VerifyUser()
        .then((res) => {
          setUserData(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setUserData(null);
          setIsLoading(false);
        });
    }
    verify();
  }, []);
  const login = (data: User) => {
    setUserData(data);
  };
  const logout = async () => {
    await logoutUser();
    setUserData(null);
  };
  return (
    <AuthContext.Provider value={{ userData, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
