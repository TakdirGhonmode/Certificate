import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ShieldCheck,
  Settings,
  GraduationCap,
  Sparkles,
  BookOpen
} from "lucide-react";

function Sidebar({ activeCount = 0 }) {
  return (
    <aside className="sidebar">
      {/* Logo Header */}
      <div className="sidebar-logo">
        <div className="logo-icon-box">
          <GraduationCap size={24} />
        </div>
        <div className="logo-text">
          <h2>StudentMS</h2>
          <span>Student Management System</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/students"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Users size={19} />
          <span>Students</span>
          {activeCount > 0 && <span className="nav-badge">{activeCount}</span>}
        </NavLink>

        <NavLink
          to="/students/add"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <UserPlus size={19} />
          <span>Add Student</span>
        </NavLink>

        <NavLink
          to="/admin"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <ShieldCheck size={19} />
          <span>Admin</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* 3D Illustration Card */}
      <div className="sidebar-illustration-card">
        <div className="illustration-glow">
          <GraduationCap size={36} className="cap-3d" />
          <BookOpen size={28} className="books-3d" />
        </div>
      </div>

      {/* Bottom Status Pill */}
      <div className="sidebar-status-box">
        <div className="status-indicator">
          <span className="pulse-green-dot" />
          <span>System Online</span>
        </div>
        <span className="version-tag">v1.0.0</span>
      </div>
    </aside>
  );
}

export default Sidebar;