import { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import { RefreshCw, Shield, Trash2, CheckCircle2, UserX, AlertTriangle, Eye } from "lucide-react";

import Topbar from "../components/Topbar";
import StudentTable from "../components/StudentTable";
import ViewStudentModal from "../components/ViewStudentModal";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";

import {
  getAllStudentsForAdmin,
  hardDeleteStudent,
  softDeleteStudent
} from "../services/studentService";

function Admin() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab filter: 'ALL', 'ACTIVE', 'DELETED'
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success", title = "Admin Log") => {
    setToast({ message, type, title });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    loadAdminStudents();
  }, []);

  const loadAdminStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudentsForAdmin();
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error loading admin records:", error);
      showToast("Failed to fetch admin audit records.", "error", "Access Error");
    } finally {
      setLoading(false);
    }
  };

  // Filtered list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Status filter
      if (statusFilter === "ACTIVE" && s.isDeleted) return false;
      if (statusFilter === "DELETED" && !s.isDeleted) return false;

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.branch?.toLowerCase().includes(q) ||
          s.rollNo?.toString().includes(q)
        );
      }

      return true;
    });
  }, [students, statusFilter, searchQuery]);

  const activeCount = students.filter((s) => !s.isDeleted).length;
  const deletedCount = students.filter((s) => s.isDeleted).length;

  const handleOpenDelete = (student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    try {
      setDeleteLoading(true);
      if (selectedStudent.isDeleted) {
        // Permanent Hard Delete
        await hardDeleteStudent(selectedStudent.id);
        showToast(`Student #${selectedStudent.rollNo} permanently deleted from database.`, "info", "Hard Delete Completed");
      } else {
        // Soft Delete
        await softDeleteStudent(selectedStudent.id);
        showToast(`Student #${selectedStudent.rollNo} moved to soft deleted status.`, "success", "Soft Delete Completed");
      }

      setDeleteModalOpen(false);
      loadAdminStudents();
    } catch (error) {
      showToast("Operation failed on server.", "error", "Admin Error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Toast toast={toast} onClose={() => setToast(null)} />

      <main className="dashboard-content">
        {/* Welcome Section */}
        <motion.div
          className="welcome-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="welcome-banner admin-theme">
            <div>
              <span className="form-tag purple">ADMINISTRATION CONTROL</span>
              <h2>Database Audit & Record Control</h2>
              <p>Audit all active and soft-deleted student records stored in your Spring Boot database.</p>
            </div>
            <div className="welcome-actions">
              <button className="btn-secondary" onClick={loadAdminStudents}>
                <RefreshCw size={16} /> Sync Audit
              </button>
            </div>
          </div>
        </motion.div>

        {/* Audit Stats Banner */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <div className="admin-stat-icon purple">
              <Shield size={20} />
            </div>
            <div>
              <span className="admin-stat-num">{students.length}</span>
              <p className="admin-stat-lbl">Total Database Rows</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon green">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="admin-stat-num">{activeCount}</span>
              <p className="admin-stat-lbl">Active Visible Records</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon red">
              <UserX size={20} />
            </div>
            <div>
              <span className="admin-stat-num">{deletedCount}</span>
              <p className="admin-stat-lbl">Soft-Deleted Rows</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <motion.section
          className="dashboard-students-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="section-heading">
            <div className="tab-pill-group">
              <button
                className={`tab-pill ${statusFilter === "ALL" ? "active" : ""}`}
                onClick={() => setStatusFilter("ALL")}
              >
                All Records ({students.length})
              </button>
              <button
                className={`tab-pill ${statusFilter === "ACTIVE" ? "active" : ""}`}
                onClick={() => setStatusFilter("ACTIVE")}
              >
                Active Only ({activeCount})
              </button>
              <button
                className={`tab-pill ${statusFilter === "DELETED" ? "active" : ""}`}
                onClick={() => setStatusFilter("DELETED")}
              >
                Soft Deleted ({deletedCount})
              </button>
            </div>
          </div>

          {/* Student Table */}
          <StudentTable
            students={filteredStudents}
            onView={(student) => {
              setSelectedStudent(student);
              setViewModalOpen(true);
            }}
            onDelete={handleOpenDelete}
            loading={loading}
            isAdminView={true}
          />
        </motion.section>
      </main>

      {/* View Modal */}
      {viewModalOpen && selectedStudent && (
        <ViewStudentModal
          student={selectedStudent}
          onClose={() => setViewModalOpen(false)}
          onDelete={(student) => {
            setViewModalOpen(false);
            handleOpenDelete(student);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedStudent && (
        <ConfirmDialog
          title={selectedStudent.isDeleted ? `PERMANENTLY DELETE ${selectedStudent.name}?` : `Soft Delete ${selectedStudent.name}?`}
          message={
            selectedStudent.isDeleted
              ? `WARNING: Hard-deleting will permanently wipe Roll #${selectedStudent.rollNo} from PostgreSQL/H2 database. This action CANNOT be undone!`
              : `Soft deleting will hide Roll #${selectedStudent.rollNo} from public rosters.`
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          loading={deleteLoading}
          isHardDelete={selectedStudent.isDeleted}
        />
      )}
    </div>
  );
}

export default Admin;