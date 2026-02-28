import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./Components/Header/Header";
import SkillsGrid from "./Components/Skills/SkillsGrid";
import SkillDetails from "./Components/Skills/SkillDetails";
import CreateSkill from "./Components/Skills/CreateSkill";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<ProtectedRoute />}>
              <Route path="/" element={<SkillsGrid />} />
            <Route path="/skills/create" element={<CreateSkill />} />
            <Route path="/skills/:id" element={<SkillDetails />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
