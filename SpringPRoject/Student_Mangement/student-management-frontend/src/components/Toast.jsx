import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="toast-icon success" size={20} />,
    error: <AlertCircle className="toast-icon error" size={20} />,
    info: <Info className="toast-icon info" size={20} />
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`toast-notification ${toast.type || "info"}`}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="toast-content">
          {icons[toast.type] || icons.info}
          <div className="toast-text">
            <h4>{toast.title || "Notification"}</h4>
            <p>{toast.message}</p>
          </div>
        </div>
        <button className="toast-close" onClick={onClose}>
          <X size={16} />
        </button>
        <motion.div 
          className="toast-progress" 
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 4, ease: "linear" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default Toast;
