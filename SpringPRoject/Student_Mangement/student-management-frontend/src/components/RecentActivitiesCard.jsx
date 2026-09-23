import { motion } from "motion/react";
import { PlusCircle, Edit3, Trash2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecentActivitiesCard({ activities = [] }) {
  const navigate = useNavigate();

  // Fallback demo activities matching user screenshot if empty
  const displayActivities = activities.length > 0 ? activities : [
    {
      title: "New student added: Takdir Mahendra Ghonmode (Roll No: 101)",
      timeAgo: "2 hours ago",
      type: "Created"
    },
    {
      title: "Student updated: Tanmay Patil (Roll No: 102)",
      timeAgo: "4 hours ago",
      type: "Updated"
    },
    {
      title: "Student deleted: Rohit Kumar (Roll No: 104)",
      timeAgo: "1 day ago",
      type: "Deleted"
    },
    {
      title: "New student added: Akash Singh (Roll No: 103)",
      timeAgo: "1 day ago",
      type: "Created"
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case "Created":
        return <PlusCircle size={18} className="activity-icon green" />;
      case "Updated":
        return <Edit3 size={18} className="activity-icon blue" />;
      case "Deleted":
        return <Trash2 size={18} className="activity-icon red" />;
      default:
        return <Clock size={18} className="activity-icon purple" />;
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case "Created":
        return "badge-created";
      case "Updated":
        return "badge-updated";
      case "Deleted":
        return "badge-deleted";
      default:
        return "badge-default";
    }
  };

  return (
    <motion.div
      className="dashboard-section-card recent-activities-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="card-header-bar">
        <div className="card-header-title">
          <div className="title-icon-circle">
            <Clock size={18} />
          </div>
          <div>
            <h3>Recent Activities</h3>
            <p>Latest student activities and system updates</p>
          </div>
        </div>
        <button className="btn-link-action" onClick={() => navigate("/admin")}>
          View All →
        </button>
      </div>

      <div className="activity-list">
        {displayActivities.map((act, index) => (
          <div key={index} className="activity-item-row">
            <div className="activity-left">
              {getIcon(act.type)}
              <span className="activity-title-text">{act.title}</span>
            </div>
            <div className="activity-right">
              <span className="activity-time-text">{act.timeAgo}</span>
              <span className={`activity-badge ${getBadgeClass(act.type)}`}>
                {act.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default RecentActivitiesCard;
