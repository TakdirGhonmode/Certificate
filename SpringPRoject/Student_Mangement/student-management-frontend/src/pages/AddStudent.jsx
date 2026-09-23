import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { UserPlus, ArrowLeft, Wand2, Check } from "lucide-react";

import Topbar from "../components/Topbar";
import StudentForm from "../components/StudentForm";
import Toast from "../components/Toast";
import { createStudent } from "../services/studentService";

function AddStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    email: "",
    branch: "",
    age: "",
    marks: ""
  });

  const showToast = (message, type = "success", title = "Success") => {
    setToast({ message, type, title });
    setTimeout(() => setToast(null), 4000);
  };

  // Quick preset helper
  const handleQuickFill = () => {
    const randomRoll = Math.floor(100 + Math.random() * 900);
    setFormData({
      rollNo: randomRoll.toString(),
      name: "Marcus Vance",
      email: `marcus${randomRoll}@university.edu`,
      branch: "Computer Science",
      age: "21",
      marks: "92.5"
    });
    showToast("Sample data filled! Feel free to edit.", "info", "Quick Preset");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await createStudent({
        rollNo: Number(formData.rollNo),
        name: formData.name,
        email: formData.email,
        branch: formData.branch,
        age: Number(formData.age),
        marks: Number(formData.marks)
      });

      showToast(`Student '${formData.name}' created successfully!`, "success", "Registration Complete");
      setTimeout(() => {
        navigate("/students");
      }, 1000);
    } catch (error) {
      console.error("Error creating student:", error);
      showToast(
        error.response?.data?.message || "Failed to create student. Please verify values.",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Topbar />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <main className="dashboard-content">
        <motion.div
          className="welcome-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="welcome-banner">
            <div>
              <h2>Register New Student</h2>
              <p>Add a new student record directly into your Spring Boot database.</p>
            </div>
            <div className="welcome-actions">
              <button className="btn-secondary" onClick={() => navigate("/students")}>
                <ArrowLeft size={16} /> Back to Roster
              </button>
              <button className="btn-secondary glow" onClick={handleQuickFill}>
                <Wand2 size={16} /> Fill Demo Data
              </button>
            </div>
          </div>
        </motion.div>

        {/* Embedded Card Form */}
        <motion.div
          className="form-wrapper-standalone"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StudentForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/students")}
            isEditing={false}
            loading={loading}
          />
        </motion.div>
      </main>
    </div>
  );
}

export default AddStudent;