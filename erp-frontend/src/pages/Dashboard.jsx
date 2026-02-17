import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">ERP System</div>
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/employees">Employees</Link>
          <Link to="/add-employee">Add Employee</Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="dashboard">
        <h1>Welcome, {user.name}!</h1>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Role: <strong>{user.role}</strong>
        </p>

        <div className="nav-links">
          <Link to="/employees">View Employees</Link>
          <Link to="/add-employee">Add New Employee</Link>
        </div>

        <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '10px' }}>
          <h3>Quick Stats</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Manage your employees efficiently with this ERP system.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
