import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, User, ShieldCheck, LogIn } from "lucide-react";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Please provide both username and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        username,
        role,
        token: "jwt_token_simulated_xyz_98765"
      });
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="dialog-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="student-form-card login-card"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="form-header">
            <div>
              <span className="form-tag">SYSTEM AUTHENTICATION</span>
              <h2>Staff & Admin Portal</h2>
              <p>Sign in to access management administrative privileges</p>
            </div>
            <button type="button" className="close-form-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-body">
            {errorMsg && <div className="login-error-alert">{errorMsg}</div>}

            <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
              {/* Username */}
              <div className="form-group">
                <label>
                  <User size={14} /> Username / Staff ID
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter staff username..."
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label>
                  <Lock size={14} /> Account Password
                </label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              {/* Role selector */}
              <div className="form-group">
                <label>
                  <ShieldCheck size={14} /> Account Role
                </label>
                <div className="role-toggle-group">
                  <button
                    type="button"
                    className={`role-toggle-btn ${role === "ADMIN" ? "active" : ""}`}
                    onClick={() => setRole("ADMIN")}
                  >
                    System Administrator
                  </button>
                  <button
                    type="button"
                    className={`role-toggle-btn ${role === "STAFF" ? "active" : ""}`}
                    onClick={() => setRole("STAFF")}
                  >
                    Faculty / Staff
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: "20px" }}>
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn size={16} /> Sign In
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LoginModal;
