import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginAgent";
import Register from "./pages/RegisterAgent";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import WorkerSearch from "./pages/SearchWorkers.jsx";
import HowItWorks from "./pages/how-its-work.jsx"
import LandingPage from './pages/LandingPage.jsx';
import FreelancerMarketplace from "./pages/FreelancerMarketplace.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import FreelancerDashboard from "./pages/FreelancerDashboard.jsx";

import FreelancerLogin from "./pages/FreelancerLogin";
import FreelancerSignup from "./pages/FreelancerSignup";
import FreelancerProfilePage from "./pages/FreelancerProfilePage";


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
        <Route path="/freelancers" element={<FreelancerMarketplace />} />
        <Route path="/freelancer/login" element={<AuthPage />} />
        <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />

        {/* <Route path="/freelancer/login" element={<FreelancerLogin />} /> */}
        {/* <Route path="/freelancer/signup" element={<FreelancerSignup />} /> */}
        <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
        <Route path="/freelancer/profile" element={<FreelancerProfilePage />} />
        {/* <Route path="/client/dashboard" element={<ClientDashboard />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
