import { motion } from "motion/react";

function StatCard({ title, value, icon: Icon, color = "indigo", trend, subtitle }) {
  return (
    <motion.div
      className={`stat-card ${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        <div className={`stat-icon-wrapper ${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="stat-card-body">
        <h2 className="stat-value">{value}</h2>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>

      {trend && (
        <div className="stat-card-footer">
          <span className="stat-trend">{trend}</span>
        </div>
      )}
    </motion.div>
  );
}

export default StatCard;