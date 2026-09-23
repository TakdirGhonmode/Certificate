import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Helper for Grade calculation
export const getStudentGrade = (marks) => {
  const score = Number(marks);
  if (isNaN(score)) return { grade: "N/A", color: "gray" };
  if (score >= 90) return { grade: "A+", color: "emerald", label: "Outstanding" };
  if (score >= 80) return { grade: "A", color: "indigo", label: "Excellent" };
  if (score >= 70) return { grade: "B", color: "blue", label: "Good" };
  if (score >= 50) return { grade: "C", color: "amber", label: "Average" };
  return { grade: "F", color: "rose", label: "Needs Improvement" };
};

// API Methods
export const getDashboardStats = () => {
  return api.get("/students/dashboard-stats");
};

export const getAllStudents = () => {
  return api.get("/students");
};

export const getStudentById = (id) => {
  return api.get(`/students/${id}`);
};

export const createStudent = (studentData) => {
  return api.post("/students", studentData);
};

export const updateStudent = (id, studentData) => {
  return api.put(`/students/${id}`, studentData);
};

export const softDeleteStudent = (id) => {
  return api.patch(`/students/soft-delete/${id}`);
};

export const hardDeleteStudent = (id) => {
  return api.delete(`/students/delete/${id}`);
};

export const getAllStudentsForAdmin = () => {
  return api.get("/admin/students");
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get("/students");
    return { online: true, count: response.data.length };
  } catch (error) {
    return { online: false, error: error.message };
  }
};