import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      alert("Failed to fetch employees. You may not have permission.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await API.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
        alert("Employee deleted successfully");
      } catch (err) {
        alert("Failed to delete employee");
      }
    }
  };

  const handleActivate = async (id) => {
    try {
      await API.put(`/employees/${id}`, { isActive: true });
      setEmployees(employees.map(emp => 
        emp._id === id ? { ...emp, isActive: true } : emp
      ));
      alert("Employee activated successfully");
    } catch (err) {
      alert("Failed to activate employee");
    }
  };

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

      {/* Employees List */}
      <div className="employees-container">
        <h2>Employees List</h2>
        
        {loading ? (
          <p>Loading employees...</p>
        ) : employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <div className="employee-list">
            {employees.map((emp) => (
              <div key={emp._id} className="employee-card">
                <div className="employee-info">
                  <span className="employee-name">{emp.name}</span>
                  <span className="employee-email">{emp.email}</span>
                  <span className="employee-phone">{emp.phone}</span>
                </div>
                <div>
                  <span style={{ 
                    padding: '5px 10px', 
                    backgroundColor: emp.isActive ? '#27ae60' : '#e74c3c',
                    color: 'white',
                    borderRadius: '5px',
                    fontSize: '12px'
                  }}>
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {user.role === 'admin' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '15px' }}>
                    <button 
                      onClick={() => navigate(`/employees/edit/${emp._id}`)}
                      style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      Edit
                    </button>
                    {emp.isActive ? (
                      <button 
                        onClick={() => handleDelete(emp._id)}
                        style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        Delete
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleActivate(emp._id)}
                        style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        Activate
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Employees;
