import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginAgent";
import Register from "./pages/RegisterAgent";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 PROTECTED ROUTE */}
        {/* Agent Dashboard */}
    <Route
      path="/agent/dashboard"
      element={
        <ProtectedRoute>
          <AgentDashboard />
        </ProtectedRoute>
      }
    />

    {/* Personal/User Dashboard */}
    <Route
      path="/personal/dashboard"
      element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      }
    />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
