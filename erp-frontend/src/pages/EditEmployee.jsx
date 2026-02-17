import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditEmployee() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role !== "admin") {
        alert("Access denied. Admins only.");
        navigate("/employees");
      }
    } else {
      navigate("/");
    }
    fetchEmployee();
  }, [navigate, id]);

  const fetchEmployee = async () => {
    try {
      const res = await API.get(`/employees/${id}`);
      setName(res.data.name);
      setPhone(res.data.phone);
      setIsActive(res.data.isActive);
    } catch (err) {
      alert("Failed to fetch employee details");
      navigate("/employees");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put(`/employees/${id}`, { name, phone, isActive });
      alert("Employee updated successfully!");
      navigate("/employees");
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to update employee";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">ERP System</div>
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/employees">Employees</Link>
          <Link to="/add-employee">Add Employee</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="add-employee-container">
        <h2>Edit Employee</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Phone:</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              &nbsp; Active Account
            </label>
          </div>

          <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Employee"}</button>
        </form>
      </div>
    </div>
  );
}

export default EditEmployee;