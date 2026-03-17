import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router";
import Header from "./Components/Header/Header";
import HomePage from "./Components/Home/HomePage";
import SkillsGrid from "./Components/Skills/SkillsGrid";
import SkillDetails from "./Components/Skills/SkillDetails";
import CreateSkill from "./Components/Skills/CreateSkill";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Onboarding from "./Components/Auth/Onboarding";
import ConfirmEmail from "./Components/Auth/ConfirmEmail";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import ChatProvider from "./context/ChatContext";
import ChatPage from "./Components/Chat/ChatPage";
import TeacherDashboard from "./Components/Teacher/TeacherDashboard";
import MySessions from "./Components/Sessions/MySessions";

// Lives inside BrowserRouter so it can use useNavigate
function OnboardingGuard() {
  const { userData, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      !isLoading &&
      userData &&
      !userData.isOnboardingComplete &&
      location.pathname !== "/onboarding"
    ) {
      navigate("/onboarding");
    }
  }, [userData, isLoading, location.pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <OnboardingGuard />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/skills" element={<SkillsGrid />} />
              <Route path="/skills/create" element={<CreateSkill />} />
              <Route path="/skills/:id" element={<SkillDetails />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:userId" element={<ChatPage />} />
              <Route path="/my-sessions" element={<MySessions />} />
            </Route>
            <Route element={<ProtectedRoute role="Teacher" />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            </Route>
            <Route path="/" element={<SkillsGrid />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
