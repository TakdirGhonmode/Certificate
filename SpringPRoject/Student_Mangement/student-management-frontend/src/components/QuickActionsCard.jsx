import { motion } from "motion/react";
import { Zap, PlusCircle, Users, ShieldCheck, Settings, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function QuickActionsCard({ onAddStudent }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="dashboard-section-card quick-actions-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <div className="card-header-bar">
        <div className="card-header-title">
          <div className="title-icon-circle purple">
            <Zap size={18} />
          </div>
          <div>
            <h3>Quick Actions</h3>
          </div>
        </div>
      </div>

      <div className="quick-actions-list">
        {/* Glowing Blue Primary Button */}
        <button
          className="quick-action-btn primary-glowing"
          onClick={() => onAddStudent ? onAddStudent() : navigate("/students/add")}
        >
          <div className="btn-label-group">
            <PlusCircle size={18} />
            <span>Add New Student</span>
          </div>
          <ArrowRight size={16} />
        </button>

        {/* View All Students */}
        <button className="quick-action-btn" onClick={() => navigate("/students")}>
          <div className="btn-label-group">
            <Users size={18} />
            <span>View All Students</span>
          </div>
          <ArrowRight size={16} />
        </button>

        {/* Admin Panel */}
        <button className="quick-action-btn" onClick={() => navigate("/admin")}>
          <div className="btn-label-group">
            <ShieldCheck size={18} />
            <span>Admin Panel</span>
          </div>
          <ArrowRight size={16} />
        </button>

        {/* Settings */}
        <button className="quick-action-btn" onClick={() => navigate("/settings")}>
          <div className="btn-label-group">
            <Settings size={18} />
            <span>Settings</span>
          </div>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default QuickActionsCard;
