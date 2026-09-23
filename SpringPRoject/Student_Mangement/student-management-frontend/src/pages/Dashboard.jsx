import { useEffect, useState, useMemo } from "react";
import { Users, UserX, GraduationCap, Star, Sparkles, Calendar, Clock, Plus, Filter, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import DashboardCharts from "../components/DashboardCharts";
import RecentActivitiesCard from "../components/RecentActivitiesCard";
import QuickActionsCard from "../components/QuickActionsCard";
import StudentTable from "../components/StudentTable";
import ViewStudentModal from "../components/ViewStudentModal";
import StudentForm from "../components/StudentForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";

import {
  getDashboardStats,
  getAllStudents,
  updateStudent,
  softDeleteStudent,
  createStudent
} from "../services/studentService";

function Dashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("ALL");

  // Live Date & Time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    rollNo: "", name: "", email: "", branch: "", age: "", marks: ""
  });
  const [editLoading, setEditLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    rollNo: "", name: "", email: "", branch: "", age: "", marks: ""
  });
  const [addLoading, setAddLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success", title = "Success") => {
    setToast({ message, type, title });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    loadDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, studentsRes] = await Promise.all([
        getDashboardStats().catch(() => null),
        getAllStudents().catch(() => ({ data: [] }))
      ]);

      if (statsRes?.data) {
        setDashboardStats(statsRes.data);
      }
      setStudents(studentsRes.data || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showToast("Could not load backend analytics.", "error", "Connection Error");
    } finally {
      setLoading(false);
    }
  };

  // Branch options for quick filter
  const branchOptions = useMemo(() => {
    const branches = new Set(students.map((s) => s.branch).filter(Boolean));
    return ["ALL", ...Array.from(branches)];
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        searchQuery === "" ||
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo?.toString().includes(searchQuery);

      const matchesBranch = selectedBranch === "ALL" || student.branch === selectedBranch;

      return matchesSearch && matchesBranch;
    });
  }, [students, searchQuery, selectedBranch]);

  // Metrics from Backend API
  const totalStudents = dashboardStats?.totalStudents ?? students.length;
  const deletedStudents = dashboardStats?.deletedStudents ?? 0;
  const totalBranches = dashboardStats?.totalBranches ?? branchOptions.length - 1;
  const averageMarks = dashboardStats?.averageMarks ?? (
    students.length > 0
      ? (students.reduce((acc, s) => acc + Number(s.marks || 0), 0) / students.length).toFixed(2)
      : "0.00"
  );

  // Formatted date & time
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  // Handlers for View, Edit, Delete
  const handleViewStudent = (student) => {
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

      showToast(`Student '${editFormData.name}' updated successfully!`, "success", "Record Updated");
      setEditModalOpen(false);
      loadDashboardData();
    } catch (error) {
      showToast("Failed to update student.", "error", "Update Failed");
    } finally {
      setEditLoading(false);
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
      loadDashboardData();
    } catch (error) {
      showToast("Failed to delete student record.", "error", "Delete Failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
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
      showToast(`Student '${addFormData.name}' created!`, "success", "Student Registered");
      setAddModalOpen(false);
      setAddFormData({ rollNo: "", name: "", email: "", branch: "", age: "", marks: "" });
      loadDashboardData();
    } catch (error) {
      showToast("Failed to create student. Check values.", "error", "Registration Error");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="page">
      <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Toast toast={toast} onClose={() => setToast(null)} />

      <main className="dashboard-content">
        {/* Welcome Header Section */}
        <motion.div
          className="welcome-hero-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="hero-left-box">
            <div className="hero-title-row">
              <span className="wave-emoji">👋</span>
              <h2>Good Morning, Takdir!</h2>
            </div>
            <p>Here's what's happening with your student management system today.</p>
          </div>

          <div className="hero-right-box">
            <span className="quote-text">~ "Better Students Brighter Future" ~</span>
            <div className="date-time-card">
              <div className="date-row">
                <Calendar size={14} className="hero-icon" />
                <span>{formattedDate}</span>
              </div>
              <div className="time-row">
                <Clock size={14} className="hero-icon" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Analytics Metric Cards Grid */}
        <section className="dashboard-metrics-grid">
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            color="indigo"
            trend="↑ +0 this week"
          />
          <StatCard
            title="Deleted Students"
            value={deletedStudents}
            icon={UserX}
            color="rose"
            trend="→ 0 this week"
          />
          <StatCard
            title="Total Branches"
            value={totalBranches}
            icon={GraduationCap}
            color="emerald"
            trend="↑ +0 this week"
          />
          <StatCard
            title="Average Marks"
            value={averageMarks}
            icon={Star}
            color="purple"
            trend="↑ +2.14% this week"
          />
        </section>

        {/* Analytics Charts Grid */}
        <DashboardCharts
          students={students}
          branchDistribution={dashboardStats?.branchDistribution}
        />

        {/* Bottom Split Grid: Recent Activities + Quick Actions */}
        <div className="dashboard-bottom-grid">
          <RecentActivitiesCard activities={dashboardStats?.recentActivities} />
          <QuickActionsCard onAddStudent={() => setAddModalOpen(true)} />
        </div>

        {/* Active Students Data Table */}
        <motion.section
          className="dashboard-students-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="section-heading">
            <div className="section-title-box">
              <h2>Active Student Roster</h2>
              <span className="count-pill">{filteredStudents.length} Students</span>
            </div>

            <div className="filter-pill-container">
              <Filter size={14} className="filter-icon" />
              {branchOptions.map((branch) => (
                <button
                  key={branch}
                  className={`filter-chip ${selectedBranch === branch ? "active" : ""}`}
                  onClick={() => setSelectedBranch(branch)}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>

          <StudentTable
            students={filteredStudents}
            onView={handleViewStudent}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            loading={loading}
          />
        </motion.section>
      </main>

      {/* Modals */}
      {viewModalOpen && selectedStudent && (
        <ViewStudentModal
          student={selectedStudent}
          onClose={() => setViewModalOpen(false)}
          onEdit={(s) => { setViewModalOpen(false); handleOpenEdit(s); }}
          onDelete={(s) => { setViewModalOpen(false); handleOpenDelete(s); }}
        />
      )}

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

      {addModalOpen && (
        <StudentForm
          formData={addFormData}
          setFormData={setAddFormData}
          onSubmit={handleCreateStudent}
          onCancel={() => setAddModalOpen(false)}
          isEditing={false}
          loading={addLoading}
        />
      )}

      {deleteModalOpen && selectedStudent && (
        <ConfirmDialog
          title={`Soft Delete ${selectedStudent.name}?`}
          message={`Are you sure you want to soft delete roll #${selectedStudent.rollNo} (${selectedStudent.name})? You can view or restore deleted records in the Admin panel.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

export default Dashboard;