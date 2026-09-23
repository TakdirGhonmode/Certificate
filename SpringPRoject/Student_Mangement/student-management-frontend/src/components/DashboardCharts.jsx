import { useMemo } from "react";
import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { UserCheck, BarChart3 } from "lucide-react";
import { getStudentGrade } from "../services/studentService";

const DONUT_COLORS = ["#3b82f6", "#10b981", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4"];

const GRADE_COLOR_MAP = {
  "A+": "#10b981",
  "A": "#3b82f6",
  "B": "#8b5cf6",
  "C": "#f59e0b",
  "F": "#ef4444"
};

function DashboardCharts({ students = [], branchDistribution = {} }) {
  // Process Branch Donut Data
  const branchData = useMemo(() => {
    if (branchDistribution && Object.keys(branchDistribution).length > 0) {
      return Object.keys(branchDistribution).map((branch) => ({
        name: branch,
        value: branchDistribution[branch]
      }));
    }

    const counts = {};
    students.forEach((student) => {
      const branch = student.branch || "Other";
      counts[branch] = (counts[branch] || 0) + 1;
    });

    return Object.keys(counts).map((branch) => ({
      name: branch,
      value: counts[branch]
    }));
  }, [students, branchDistribution]);

  const totalStudentsCount = useMemo(() => {
    return branchData.reduce((acc, item) => acc + item.value, 0);
  }, [branchData]);

  // Process Grade Bar Chart Data
  const gradeData = useMemo(() => {
    const gradeCounts = { "A+": 0, "A": 0, "B": 0, "C": 0, "F": 0 };

    students.forEach((student) => {
      const { grade } = getStudentGrade(student.marks);
      if (gradeCounts[grade] !== undefined) {
        gradeCounts[grade] += 1;
      }
    });

    return [
      { grade: "A+", count: gradeCounts["A+"], fill: GRADE_COLOR_MAP["A+"] },
      { grade: "A", count: gradeCounts["A"], fill: GRADE_COLOR_MAP["A"] },
      { grade: "B", count: gradeCounts["B"], fill: GRADE_COLOR_MAP["B"] },
      { grade: "C", count: gradeCounts["C"], fill: GRADE_COLOR_MAP["C"] },
      { grade: "F", count: gradeCounts["F"], fill: GRADE_COLOR_MAP["F"] }
    ];
  }, [students]);

  return (
    <div className="dashboard-charts-grid">
      {/* Left Chart: Grade Performance Distribution (replaces Growth) */}
      <motion.div
        className="dashboard-chart-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="chart-card-header">
          <div className="chart-card-title">
            <div className="chart-header-icon blue">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3>Grade Performance Distribution</h3>
              <p>Student score distribution by academic grades</p>
            </div>
          </div>
          <span className="chart-time-filter">All Enrolled</span>
        </div>

        <div className="chart-card-body">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gradeData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <XAxis dataKey="grade" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "#fff"
                }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {gradeData.map((entry, index) => (
                  <Cell key={`grade-cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Right Chart: Branch Distribution Donut Chart */}
      <motion.div
        className="dashboard-chart-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="chart-card-header">
          <div className="chart-card-title">
            <div className="chart-header-icon cyan">
              <UserCheck size={18} />
            </div>
            <div>
              <h3>Branch Distribution</h3>
            </div>
          </div>
        </div>

        <div className="chart-card-body donut-layout">
          {/* Donut Chart with Center Count */}
          <div className="donut-chart-wrapper">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={branchData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {branchData.map((entry, index) => (
                    <Cell key={`branch-cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center-label">
              <span className="donut-total-val">{totalStudentsCount}</span>
              <span className="donut-total-lbl">Total</span>
            </div>
          </div>

          {/* Right Side Branch Legend */}
          <div className="donut-legend-list">
            {branchData.map((item, idx) => {
              const percent = totalStudentsCount > 0 ? Math.round((item.value / totalStudentsCount) * 100) : 0;
              const color = DONUT_COLORS[idx % DONUT_COLORS.length];

              return (
                <div key={item.name} className="legend-item-row">
                  <div className="legend-label-box">
                    <span className="legend-dot" style={{ backgroundColor: color }} />
                    <span className="legend-name">{item.name}</span>
                  </div>
                  <span className="legend-value">{item.value} ({percent}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardCharts;
