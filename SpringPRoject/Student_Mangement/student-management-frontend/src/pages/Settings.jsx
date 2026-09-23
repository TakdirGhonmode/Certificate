import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Bell, Moon, Sun, Shield, Database, Activity, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

import Topbar from "../components/Topbar";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";
import { checkBackendHealth } from "../services/studentService";

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [health, setHealth] = useState({ loading: false, status: null });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info", title = "Settings") => {
    setToast({ message, type, title });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const runHealthCheck = async () => {
    setHealth({ loading: true, status: null });
    const startTime = performance.now();
    const res = await checkBackendHealth();
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    setHealth({
      loading: false,
      status: res.online,
      latency,
      count: res.count,
      error: res.error
    });
  };

  return (
    <div className="page">
      <Topbar />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <main className="dashboard-content">
        <motion.div
          className="welcome-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="welcome-banner">
            <div>
              <h2>Application Settings</h2>
              <p>Configure theme preferences, monitor backend connection, and system status.</p>
            </div>
          </div>
        </motion.div>

        <div className="settings-grid">
          {/* Theme Control */}
          <motion.div
            className="setting-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="setting-icon-box purple">
              {theme === "dark" ? <Moon size={22} /> : <Sun size={22} />}
            </div>
            <div className="setting-content">
              <h3>Appearance Theme</h3>
              <p>Switch between Light Mode and Dark Mode visual themes.</p>
            </div>
            <button className="btn-toggle-theme" onClick={toggleTheme}>
              {theme === "dark" ? "Dark Theme Active" : "Light Theme Active"}
            </button>
          </motion.div>

          {/* Backend Connection Health Check */}
          <motion.div
            className="setting-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="setting-icon-box blue">
              <Activity size={22} />
            </div>
            <div className="setting-content">
              <h3>Spring Boot Backend Connection</h3>
              <p>REST API Endpoint: <code>http://localhost:8080/api/students</code></p>
              {health.status !== null && (
                <div className="health-ping-box">
                  {health.status ? (
                    <span className="health-status online">
                      <CheckCircle2 size={15} /> Backend Online ({health.latency}ms latency · {health.count} students)
                    </span>
                  ) : (
                    <span className="health-status offline">
                      <XCircle size={15} /> Server Offline or CORS error ({health.error})
                    </span>
                  )}
                </div>
              )}
            </div>
            <button className="btn-secondary" onClick={runHealthCheck} disabled={health.loading}>
              <RefreshCw size={15} className={health.loading ? "spin" : ""} /> Test Ping
            </button>
          </motion.div>

          {/* Notifications */}
          <motion.div
            className="setting-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="setting-icon-box emerald">
              <Bell size={22} />
            </div>
            <div className="setting-content">
              <h3>System Notifications</h3>
              <p>Show floating toast alerts when records are registered, edited, or deleted.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => {
                  setNotificationsEnabled(!notificationsEnabled);
                  showToast(
                    !notificationsEnabled ? "Toast notifications enabled" : "Toast notifications muted",
                    "info"
                  );
                }}
              />
              <span className="slider round"></span>
            </label>
          </motion.div>

          {/* Security Info */}
          <motion.div
            className="setting-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="setting-icon-box amber">
              <Shield size={22} />
            </div>
            <div className="setting-content">
              <h3>Security & Validation</h3>
              <p>Validation constraints enforced on both Client and Spring Boot DTO (@Min(16), @Max(60), @DecimalMax(100)).</p>
            </div>
            <span className="status-badge-sm active">Enforced</span>
          </motion.div>

          {/* Database Stack Card */}
          <motion.div
            className="setting-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="setting-icon-box indigo">
              <Database size={22} />
            </div>
            <div className="setting-content">
              <h3>System Architecture</h3>
              <p>React 19 + Vite 8 + Framer Motion 13 Frontend paired with Spring Boot 3 Java Backend.</p>
            </div>
            <span className="status-badge-sm active">Full Stack</span>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Settings;