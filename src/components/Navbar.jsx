import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/properties", label: "Properties" },
  { to: "/tenants", label: "Tenants" },
  { to: "/rent-payments", label: "Rent Payments" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">P</span>
        <span className="brand-text">PropertyHub</span>
      </div>
      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? "active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="navbar-user">
        <span className="user-badge">{user?.username?.[0]?.toUpperCase()}</span>
        <span className="user-name">{user?.username}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
