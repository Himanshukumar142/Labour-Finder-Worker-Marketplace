import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginAgent";
import Register from "./pages/RegisterAgent";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import WorkerSearch from "./pages/SearchWorkers.jsx";
import HowItWorks from "./pages/how-its-work.jsx"
import LandingPage from './pages/LandingPage.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
     <Route path="/search" element={<WorkerSearch />} />
     <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
