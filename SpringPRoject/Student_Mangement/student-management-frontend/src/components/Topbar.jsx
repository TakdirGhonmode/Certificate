import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle2,
  Settings,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";

function Topbar({ searchQuery = "", setSearchQuery, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="topbar-container">
      {/* Search Input Box */}
      <div className="topbar-search-wrapper">
        <Search size={17} className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          placeholder="Search students, roll numbers, or names..."
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
            ×
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="topbar-actions">
        {/* Theme Toggle */}
        <button
          className="icon-action-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notification Bell */}
        <div className="popover-container" ref={notifRef}>
          <button
            className="icon-action-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="notif-badge-count">9</span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="popover-dropdown notif-dropdown"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className="popover-header">
                  <h4>Notifications</h4>
                  <span className="live-tag">9 New</span>
                </div>
                <div className="popover-body">
                  <div className="notif-row">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <div>
                      <strong>Spring Boot Connected</strong>
                      <p>Backend API active on port 8080</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Pill */}
        <div className="popover-container" ref={profileRef}>
          <button
            className="topbar-profile-pill"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar-circle">
              <span>TG</span>
            </div>
            <div className="profile-text-box">
              <strong className="profile-user-name">Takdir Ghonmode</strong>
              <span className="profile-user-role">Administrator</span>
            </div>
            <ChevronDown size={14} className={`chevron-down ${showProfileMenu ? "rotate" : ""}`} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                className="popover-dropdown profile-dropdown"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className="profile-dropdown-header">
                  <div className="avatar-lg">TG</div>
                  <div>
                    <h4>Takdir Ghonmode</h4>
                    <p>administrator@studentms.com</p>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => { setShowProfileMenu(false); navigate("/admin"); }}>
                  <ShieldCheck size={16} /> Admin Panel
                </button>
                <button className="dropdown-item" onClick={() => { setShowProfileMenu(false); navigate("/settings"); }}>
                  <Settings size={16} /> System Settings
                </button>
                <button className="dropdown-item" onClick={() => { toggleTheme(); setShowProfileMenu(false); }}>
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Topbar;