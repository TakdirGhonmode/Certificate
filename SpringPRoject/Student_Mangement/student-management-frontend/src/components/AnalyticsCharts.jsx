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
  ResponsiveContainer,
  Legend
} from "recharts";
import { PieChart as PieIcon, BarChart2, Award, BookOpen } from "lucide-react";
import { getStudentGrade } from "../services/studentService";

// Colors for charts
const BRANCH_COLORS = ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#f43f5e", "#c084fc", "#a7f3d0"];

const GRADE_COLOR_MAP = {
  "A+": "#34d399",
  "A": "#818cf8",
  "B": "#38bdf8",
  "C": "#fbbf24",
  "F": "#f43f5e"
};

// Custom Glassmorphic Tooltip
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-chart-tooltip">
        <strong className="tooltip-title">{data.name || label}</strong>
        <p className="tooltip-value">
          <span>Count:</span> <strong>{data.value} Students</strong>
        </p>
      </div>
    );
  }
  return null;
};

function AnalyticsCharts({ students = [] }) {
  // Compute Branch Data for Donut Chart
  const branchData = useMemo(() => {
    const counts = {};
    students.forEach((student) => {
      const branch = student.branch || "Other";
      counts[branch] = (counts[branch] || 0) + 1;
    });

    return Object.keys(counts).map((branch) => ({
      name: branch,
      value: counts[branch]
    }));
  }, [students]);

  // Compute Grade Distribution Data for Bar Chart
  const gradeData = useMemo(() => {
    const gradeCounts = { "A+": 0, "A": 0, "B": 0, "C": 0, "F": 0 };

    students.forEach((student) => {
      const { grade } = getStudentGrade(student.marks);
      if (gradeCounts[grade] !== undefined) {
        gradeCounts[grade] += 1;
      }
    });

    return [
      { grade: "A+", label: "A+ (90-100%)", count: gradeCounts["A+"], fill: GRADE_COLOR_MAP["A+"] },
      { grade: "A", label: "A (80-89%)", count: gradeCounts["A"], fill: GRADE_COLOR_MAP["A"] },
      { grade: "B", label: "B (70-79%)", count: gradeCounts["B"], fill: GRADE_COLOR_MAP["B"] },
      { grade: "C", label: "C (50-69%)", count: gradeCounts["C"], fill: GRADE_COLOR_MAP["C"] },
      { grade: "F", label: "F (<50%)", count: gradeCounts["F"], fill: GRADE_COLOR_MAP["F"] }
    ];
  }, [students]);

  if (students.length === 0) {
    return null;
  }

  return (
    <div className="analytics-charts-grid">
      {/* Branch Distribution Donut Chart */}
      <motion.div
        className="chart-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="chart-header">
          <div className="chart-header-title">
            <div className="chart-icon-box cyan">
              <PieIcon size={18} />
            </div>
            <div>
              <h3>Branch Enrollment Distribution</h3>
              <p>Percentage of students per department</p>
            </div>
          </div>
          <span className="chart-badge">{branchData.length} Branches</span>
        </div>

        <div className="chart-body">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={branchData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {branchData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BRANCH_COLORS[index % BRANCH_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomChartTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Grade Performance Bar Chart */}
      <motion.div
        className="chart-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="chart-header">
          <div className="chart-header-title">
            <div className="chart-icon-box emerald">
              <BarChart2 size={18} />
            </div>
            <div>
              <h3>Grade Performance Breakdown</h3>
              <p>Student count grouped by academic grades</p>
            </div>
          </div>
          <span className="chart-badge green">Academic Score</span>
        </div>

        <div className="chart-body">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={gradeData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <XAxis dataKey="grade" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} tickLine={false} />
              <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {gradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

export default AnalyticsCharts;
