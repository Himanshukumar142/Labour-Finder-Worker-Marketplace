import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "personal") {
      navigate("/login");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>

      <p>Welcome, User 👋</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserDashboard;
