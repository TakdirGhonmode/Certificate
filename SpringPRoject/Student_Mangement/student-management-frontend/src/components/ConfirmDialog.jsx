import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X, Trash2, RotateCcw } from "lucide-react";

function ConfirmDialog({
  title = "Delete Student Record?",
  message = "Are you sure you want to delete this student? Soft deletion preserves data for recovery in Admin Panel.",
  onConfirm,
  onCancel,
  loading = false,
  isHardDelete = false
}) {
  return (
    <AnimatePresence>
      <motion.div
        className="dialog-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="confirm-dialog"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="dialog-close" onClick={onCancel} type="button">
            <X size={18} />
          </button>

          <div className={`warning-icon ${isHardDelete ? "hard-delete" : ""}`}>
            <AlertTriangle size={26} />
          </div>

          <div className="dialog-content">
            <h2>{title}</h2>
            <p>{message}</p>
          </div>

          <div className="dialog-actions">
            <button
              className="dialog-cancel"
              onClick={onCancel}
              type="button"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className={`dialog-confirm ${isHardDelete ? "btn-hard-delete" : ""}`}
              onClick={onConfirm}
              type="button"
              disabled={loading}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <Trash2 size={16} /> {isHardDelete ? "Permanently Delete" : "Soft Delete"}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ConfirmDialog;