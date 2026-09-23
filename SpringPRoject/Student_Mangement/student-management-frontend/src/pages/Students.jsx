import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  ArrowUpDown,
  Filter,
  Search,
  RefreshCw,
  Download,
  FileSpreadsheet,
  FileText,
  Trash2,
  X
} from "lucide-react";

import Topbar from "../components/Topbar";
import StudentTable from "../components/StudentTable";
import ViewStudentModal from "../components/ViewStudentModal";
import StudentForm from "../components/StudentForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import CustomSelect from "../components/CustomSelect";

import {
  getAllStudents,
  updateStudent,
  softDeleteStudent,
  createStudent
} from "../services/studentService";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [sortBy, setSortBy] = useState("rollNo"); // rollNo, name, marks, age
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc

  // Selection & Batch Actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    rollNo: "", name: "", email: "", branch: "", age: "", marks: ""
  });
  const [editLoading, setEditLoading] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    rollNo: "", name: "", email: "", branch: "", age: "", marks: ""
  });
  const [addLoading, setAddLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success", title = "Success") => {
    setToast({ message, type, title });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      setStudents(response.data || []);
      setSelectedIds([]);
    } catch (error) {
      console.error("Error loading students:", error);
      showToast("Could not load student list from server.", "error", "API Error");
    } finally {
      setLoading(false);
    }
  };

  // Branch options formatted for CustomSelect
  const branchSelectOptions = useMemo(() => {
    const branches = new Set(students.map((s) => s.branch).filter(Boolean));
    const list = Array.from(branches);
    return [
      { label: "All Branches", value: "ALL" },
      ...list.map((b) => ({ label: b, value: b }))
    ];
  }, [students]);

  // Sort Options for CustomSelect
  const sortSelectOptions = [
    { label: "Sort by Roll Number", value: "rollNo" },
    { label: "Sort by Student Name", value: "name" },
    { label: "Sort by Performance Score", value: "marks" },
    { label: "Sort by Age", value: "age" }
  ];

  // Processed Students list (Filter + Sort)
  const processedStudents = useMemo(() => {
    let list = [...students];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.branch?.toLowerCase().includes(q) ||
          s.rollNo?.toString().includes(q)
      );
    }

    // Branch filter
    if (selectedBranch !== "ALL") {
      list = list.filter((s) => s.branch === selectedBranch);
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [students, searchQuery, selectedBranch, sortBy, sortOrder]);

  // Bulk Export Handlers
  const handleExportCSV = () => {
    const targetList =
      selectedIds.length > 0
        ? students.filter((s) => selectedIds.includes(s.id))
        : processedStudents;
    exportToCSV(targetList, `students_export_${new Date().getTime()}.csv`);
    showToast(`Exported ${targetList.length} student records to CSV.`, "success", "CSV Downloaded");
  };

  const handleExportPDF = () => {
    const targetList =
      selectedIds.length > 0
        ? students.filter((s) => selectedIds.includes(s.id))
        : processedStudents;
    exportToPDF(targetList, "Enrolled Students Summary Report");
    showToast("Opened PDF report print window.", "info", "PDF Ready");
  };

  const handleBulkSoftDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await Promise.all(selectedIds.map((id) => softDeleteStudent(id)));
      showToast(`Soft-deleted ${selectedIds.length} students!`, "success", "Batch Complete");
      setSelectedIds([]);
      loadStudents();
    } catch (err) {
      showToast("Error processing batch soft-delete.", "error", "Batch Error");
      setLoading(false);
    }
  };

  // Handlers
  const handleView = (student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      rollNo: student.rollNo,
      name: student.name,
      email: student.email,
      branch: student.branch,
      age: student.age,
      marks: student.marks
    });
    setEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      setEditLoading(true);
      await updateStudent(selectedStudent.id, {
        rollNo: Number(editFormData.rollNo),
        name: editFormData.name,
        email: editFormData.email,
        branch: editFormData.branch,
        age: Number(editFormData.age),
        marks: Number(editFormData.marks)
      });
      showToast(`Updated '${editFormData.name}' successfully!`, "success", "Record Saved");
      setEditModalOpen(false);
      loadStudents();
    } catch (error) {
      showToast("Error updating student details.", "error", "Update Error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setAddLoading(true);
      await createStudent({
        rollNo: Number(addFormData.rollNo),
        name: addFormData.name,
        email: addFormData.email,
        branch: addFormData.branch,
        age: Number(addFormData.age),
        marks: Number(addFormData.marks)
      });
      showToast(`Student '${addFormData.name}' registered!`, "success", "Student Added");
      setAddModalOpen(false);
      setAddFormData({ rollNo: "", name: "", email: "", branch: "", age: "", marks: "" });
      loadStudents();
    } catch (error) {
      showToast("Error creating student record.", "error", "Registration Error");
    } finally {
      setAddLoading(false);
    }
  };

  const handleOpenDelete = (student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    try {
      setDeleteLoading(true);
      await softDeleteStudent(selectedStudent.id);
      showToast(`Student '${selectedStudent.name}' deleted!`, "success", "Record Soft Deleted");
      setDeleteModalOpen(false);
      loadStudents();
    } catch (error) {
      showToast("Error deleting student.", "error", "Delete Failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Toast toast={toast} onClose={() => setToast(null)} />

      <main className="dashboard-content">
        {/* Page Header */}
        <motion.div
          className="welcome-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="welcome-banner">
            <div>
              <h2>All Active Students</h2>
              <p>Browse, search, filter, export, and manage student academic records.</p>
            </div>
            <div className="welcome-actions">
              <button className="btn-secondary" onClick={handleExportCSV} title="Export CSV Data">
                <FileSpreadsheet size={16} /> CSV
              </button>
              <button className="btn-secondary" onClick={handleExportPDF} title="Download PDF Report">
                <FileText size={16} /> PDF Report
              </button>
              <button className="btn-secondary" onClick={loadStudents}>
                <RefreshCw size={16} /> Refresh
              </button>
              <button className="btn-primary" onClick={() => setAddModalOpen(true)}>
                <Plus size={18} /> Register Student
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters & Sorting Control Bar */}
        <motion.section
          className="controls-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="controls-row">
            {/* Search Box */}
            <div className="search-field-wrapper">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by name, roll, email, branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Custom Branch Select Dropdown */}
            <CustomSelect
              options={branchSelectOptions}
              value={selectedBranch}
              onChange={setSelectedBranch}
              icon={Filter}
            />

            {/* Custom Sort Select Dropdown */}
            <CustomSelect
              options={sortSelectOptions}
              value={sortBy}
              onChange={setSortBy}
              icon={ArrowUpDown}
            />

            {/* Sort Direction Toggle Button */}
            <button
              className="btn-icon-toggle"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title={`Sort Direction: ${sortOrder.toUpperCase()}`}
            >
              {sortOrder === "asc" ? "↑ ASC" : "↓ DESC"}
            </button>
          </div>
        </motion.section>

        {/* Floating Batch Action Toolbar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              className="batch-actions-bar"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <div className="batch-info">
                <span className="batch-count-badge">{selectedIds.length}</span>
                <span>Students Selected</span>
              </div>
              <div className="batch-buttons">
                <button className="btn-batch export" onClick={handleExportCSV}>
                  <FileSpreadsheet size={15} /> Export CSV ({selectedIds.length})
                </button>
                <button className="btn-batch export" onClick={handleExportPDF}>
                  <FileText size={15} /> Print PDF ({selectedIds.length})
                </button>
                <button className="btn-batch delete" onClick={handleBulkSoftDelete}>
                  <Trash2 size={15} /> Soft Delete ({selectedIds.length})
                </button>
                <button className="btn-batch close" onClick={() => setSelectedIds([])}>
                  <X size={15} /> Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Section */}
        <motion.section
          className="dashboard-students-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StudentTable
            students={processedStudents}
            onView={handleView}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            loading={loading}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </motion.section>
      </main>

      {/* View Modal */}
      {viewModalOpen && selectedStudent && (
        <ViewStudentModal
          student={selectedStudent}
          onClose={() => setViewModalOpen(false)}
          onEdit={(s) => {
            setViewModalOpen(false);
            handleOpenEdit(s);
          }}
          onDelete={(s) => {
            setViewModalOpen(false);
            handleOpenDelete(s);
          }}
        />
      )}

      {/* Edit Form Modal */}
      {editModalOpen && (
        <StudentForm
          formData={editFormData}
          setFormData={setEditFormData}
          onSubmit={handleUpdateSubmit}
          onCancel={() => setEditModalOpen(false)}
          isEditing={true}
          loading={editLoading}
        />
      )}

      {/* Add Form Modal */}
      {addModalOpen && (
        <StudentForm
          formData={addFormData}
          setFormData={setAddFormData}
          onSubmit={handleCreateSubmit}
          onCancel={() => setAddModalOpen(false)}
          isEditing={false}
          loading={addLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedStudent && (
        <ConfirmDialog
          title={`Soft Delete '${selectedStudent.name}'?`}
          message={`Confirm soft-delete for Roll #${selectedStudent.rollNo}. Student can be restored or audited anytime in the Admin view.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

export default Students;