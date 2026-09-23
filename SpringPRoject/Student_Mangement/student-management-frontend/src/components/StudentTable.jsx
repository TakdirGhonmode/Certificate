import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Pencil,
  Trash2,
  Eye,
  Award,
  Mail,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { getStudentGrade } from "../services/studentService";

function StudentTable({
  students = [],
  onEdit,
  onDelete,
  onView,
  loading = false,
  selectedIds = [],
  onSelectionChange
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Compute paginated slice
  const totalStudents = students.length;
  const totalPages = Math.max(1, Math.ceil(totalStudents / pageSize));

  // Ensure valid current page if students array size changes
  const validPage = Math.min(currentPage, totalPages);

  const paginatedStudents = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return students.slice(start, start + pageSize);
  }, [students, validPage, pageSize]);

  // Handle select all for current visible page
  const isAllPageSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.every((s) => selectedIds.includes(s.id));

  const handleToggleSelectAll = () => {
    if (!onSelectionChange) return;
    if (isAllPageSelected) {
      const pageIds = paginatedStudents.map((s) => s.id);
      onSelectionChange(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedStudents.map((s) => s.id);
      const combined = Array.from(new Set([...selectedIds, ...pageIds]));
      onSelectionChange(combined);
    }
  };

  const handleToggleRow = (id) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <div className="table-skeleton-wrapper">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-row pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="student-table-container">
      <table className="student-table">
        <thead>
          <tr>
            <th className="select-col">
              <input
                type="checkbox"
                checked={isAllPageSelected}
                onChange={handleToggleSelectAll}
                className="custom-checkbox"
                title="Select all on this page"
              />
            </th>
            <th>ID / Roll</th>
            <th>Student Info</th>
            <th>Branch</th>
            <th>Age</th>
            <th>Performance</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="8" className="empty-table-cell">
                <div className="empty-state-card">
                  <div className="empty-icon-circle">
                    <BookOpen size={28} />
                  </div>
                  <h3>No Students Found</h3>
                  <p>No student records match the current search or filter criteria.</p>
                </div>
              </td>
            </tr>
          ) : (
            paginatedStudents.map((student, index) => {
              const { grade, color } = getStudentGrade(student.marks);
              const isSelected = selectedIds.includes(student.id);

              return (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={isSelected ? "row-selected" : ""}
                  whileHover={{ backgroundColor: "var(--bg-table-hover)", transition: { duration: 0.15 } }}
                >
                  {/* Checkbox */}
                  <td className="select-col">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleRow(student.id)}
                      className="custom-checkbox"
                    />
                  </td>

                  {/* ID / Roll */}
                  <td>
                    <div className="roll-badge">
                      <span className="roll-number">#{student.rollNo}</span>
                      <span className="system-id">ID: {student.id}</span>
                    </div>
                  </td>

                  {/* Name & Email */}
                  <td>
                    <div className="student-profile-cell">
                      <div className="student-avatar-sm">
                        {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                      </div>
                      <div className="student-details">
                        <span className="student-name-text">{student.name}</span>
                        <span className="student-email-text">
                          <Mail size={12} /> {student.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Branch */}
                  <td>
                    <span className="branch-tag">{student.branch}</span>
                  </td>

                  {/* Age */}
                  <td>
                    <span className="age-text">{student.age} yrs</span>
                  </td>

                  {/* Marks & Grade */}
                  <td>
                    <div className="performance-cell">
                      <div className="marks-badge">
                        <Award size={14} />
                        <strong>{student.marks}</strong>
                        <span className="marks-total">/100</span>
                      </div>
                      <span className={`grade-chip ${color}`}>{grade}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`status-badge ${student.isDeleted ? "deleted" : "active"}`}>
                      <span className="status-dot" />
                      {student.isDeleted ? "Soft Deleted" : "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="text-right">
                    <div className="table-actions">
                      <button
                        className="action-btn view"
                        onClick={() => onView && onView(student)}
                        title="View Full Profile"
                      >
                        <Eye size={15} />
                      </button>

                      {!student.isDeleted && (
                        <button
                          className="action-btn edit"
                          onClick={() => onEdit && onEdit(student)}
                          title="Edit Student"
                        >
                          <Pencil size={15} />
                        </button>
                      )}

                      <button
                        className="action-btn delete"
                        onClick={() => onDelete && onDelete(student)}
                        title={student.isDeleted ? "Permanently Delete" : "Soft Delete"}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination Bar */}
      {students.length > 0 && (
        <div className="pagination-bar">
          <div className="pagination-info">
            Showing <strong>{(validPage - 1) * pageSize + 1}</strong> to{" "}
            <strong>{Math.min(validPage * pageSize, totalStudents)}</strong> of{" "}
            <strong>{totalStudents}</strong> students
          </div>

          <div className="pagination-controls">
            {/* Page size selector */}
            <div className="page-size-selector">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="page-select-input"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Page navigation buttons */}
            <div className="pagination-nav-group">
              <button
                className="pag-btn"
                disabled={validPage === 1}
                onClick={() => setCurrentPage(1)}
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                className="pag-btn"
                disabled={validPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="page-pill-badge">
                Page {validPage} of {totalPages}
              </span>

              <button
                className="pag-btn"
                disabled={validPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                className="pag-btn"
                disabled={validPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                title="Last Page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentTable;