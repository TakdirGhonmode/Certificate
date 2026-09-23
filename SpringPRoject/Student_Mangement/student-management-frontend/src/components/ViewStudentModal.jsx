import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Hash, BookOpen, User, Award, Calendar, Edit3, Trash2 } from "lucide-react";
import { getStudentGrade } from "../services/studentService";

function ViewStudentModal({ student, onClose, onEdit, onDelete }) {
  if (!student) return null;

  const { grade, color, label } = getStudentGrade(student.marks);

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
          className="view-student-card"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Banner */}
          <div className="view-modal-header">
            <div className="student-profile-badge">
              <div className="avatar-large">
                {student.name ? student.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="student-profile-title">
                <h2>{student.name}</h2>
                <p><Mail size={14} /> {student.email}</p>
              </div>
            </div>
            <button className="dialog-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Body Info Grid */}
          <div className="view-modal-body">
            <div className="info-cards-grid">
              <div className="info-tile">
                <div className="info-tile-icon purple">
                  <Hash size={18} />
                </div>
                <div>
                  <span className="info-tile-label">Roll Number</span>
                  <p className="info-tile-val">#{student.rollNo}</p>
                </div>
              </div>

              <div className="info-tile">
                <div className="info-tile-icon blue">
                  <BookOpen size={18} />
                </div>
                <div>
                  <span className="info-tile-label">Branch</span>
                  <p className="info-tile-val">{student.branch}</p>
                </div>
              </div>

              <div className="info-tile">
                <div className="info-tile-icon emerald">
                  <User size={18} />
                </div>
                <div>
                  <span className="info-tile-label">Age</span>
                  <p className="info-tile-val">{student.age} Years</p>
                </div>
              </div>

              <div className="info-tile">
                <div className="info-tile-icon amber">
                  <Award size={18} />
                </div>
                <div>
                  <span className="info-tile-label">Overall Score</span>
                  <p className="info-tile-val">{student.marks} / 100</p>
                </div>
              </div>
            </div>

            {/* Performance Grade Section */}
            <div className="performance-card">
              <div className="performance-header">
                <div>
                  <span className="perf-subtitle">Performance Grade</span>
                  <h4 className="perf-title">{label}</h4>
                </div>
                <div className={`grade-pill ${color}`}>
                  {grade}
                </div>
              </div>

              {/* Score Progress bar */}
              <div className="score-progress-wrapper">
                <div className="score-progress-label">
                  <span>Marks Percentage</span>
                  <strong>{student.marks}%</strong>
                </div>
                <div className="score-progress-bg">
                  <motion.div
                    className={`score-progress-fill ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, student.marks))}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Additional info if admin DTO */}
            {(student.createdAt || student.isDeleted !== undefined) && (
              <div className="meta-info-row">
                {student.createdAt && (
                  <span className="meta-item">
                    <Calendar size={13} /> Added: {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                )}
                {student.isDeleted !== undefined && (
                  <span className={`status-badge-sm ${student.isDeleted ? "deleted" : "active"}`}>
                    {student.isDeleted ? "Soft Deleted" : "Active Record"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="view-modal-footer">
            <button
              className="action-btn-secondary"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(student);
              }}
            >
              <Edit3 size={16} /> Edit Student
            </button>
            <button
              className="action-btn-danger"
              onClick={() => {
                onClose();
                if (onDelete) onDelete(student);
              }}
            >
              <Trash2 size={16} /> Delete Record
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ViewStudentModal;
