import { motion, AnimatePresence } from "motion/react";
import { X, Hash, User, Mail, BookOpen, Calendar, Award, Check } from "lucide-react";

function StudentForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false,
  errors = {}
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
          className="student-form-card"
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Form Header */}
          <div className="form-header">
            <div>
              <span className="form-tag">{isEditing ? "UPDATE MODE" : "NEW RECORD"}</span>
              <h2>{isEditing ? "Edit Student Details" : "Add New Student"}</h2>
              <p>{isEditing ? "Update student information & performance marks" : "Enter complete information for student registration"}</p>
            </div>
            <button type="button" className="close-form-btn" onClick={onCancel}>
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={onSubmit} className="form-body">
            <div className="form-grid">
              {/* Roll Number */}
              <div className="form-group">
                <label>
                  <Hash size={14} /> Roll Number
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    placeholder="e.g. 101"
                    min="1"
                    required
                    className={errors.rollNo ? "input-error" : ""}
                  />
                </div>
                {errors.rollNo && <span className="field-error-text">{errors.rollNo}</span>}
              </div>

              {/* Student Name */}
              <div className="form-group">
                <label>
                  <User size={14} /> Student Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Rivera"
                    required
                    className={errors.name ? "input-error" : ""}
                  />
                </div>
                {errors.name && <span className="field-error-text">{errors.name}</span>}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label>
                  <Mail size={14} /> Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@university.edu"
                    required
                    className={errors.email ? "input-error" : ""}
                  />
                </div>
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>

              {/* Branch */}
              <div className="form-group">
                <label>
                  <BookOpen size={14} /> Branch / Department
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    required
                    className={errors.branch ? "input-error" : ""}
                  />
                </div>
                {errors.branch && <span className="field-error-text">{errors.branch}</span>}
              </div>

              {/* Age */}
              <div className="form-group">
                <label>
                  <Calendar size={14} /> Age (16 - 60)
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 21"
                    min="16"
                    max="60"
                    required
                    className={errors.age ? "input-error" : ""}
                  />
                </div>
                {errors.age && <span className="field-error-text">{errors.age}</span>}
              </div>

              {/* Marks */}
              <div className="form-group">
                <label>
                  <Award size={14} /> Score / Marks (0.0 - 100.0)
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="marks"
                    value={formData.marks}
                    onChange={handleChange}
                    placeholder="e.g. 88.5"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                    className={errors.marks ? "input-error" : ""}
                  />
                </div>
                {errors.marks && <span className="field-error-text">{errors.marks}</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <span className="btn-spinner">Saving...</span>
                ) : (
                  <>
                    <Check size={16} /> {isEditing ? "Save Changes" : "Register Student"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StudentForm;