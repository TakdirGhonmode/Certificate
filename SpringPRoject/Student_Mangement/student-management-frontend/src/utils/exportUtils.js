// CSV Export Utility
export const exportToCSV = (students = [], filename = "student_roster.csv") => {
  if (!students || students.length === 0) {
    alert("No student data available to export.");
    return;
  }

  const headers = ["ID", "Roll No", "Student Name", "Email", "Branch", "Age", "Marks", "Status"];

  const rows = students.map((s) => [
    s.id,
    s.rollNo,
    `"${(s.name || "").replace(/"/g, '""')}"`,
    `"${(s.email || "").replace(/"/g, '""')}"`,
    `"${(s.branch || "").replace(/"/g, '""')}"`,
    s.age,
    s.marks,
    s.isDeleted ? "Soft Deleted" : "Active"
  ]);

  const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// PDF Report Download Utility (High resolution printable PDF window)
export const exportToPDF = (students = [], title = "Student Academic Roster Report") => {
  if (!students || students.length === 0) {
    alert("No student records available for PDF report generation.");
    return;
  }

  const activeCount = students.filter((s) => !s.isDeleted).length;
  const avgMarks = (
    students.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0) / (students.length || 1)
  ).toFixed(1);

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to open the PDF print report window.");
    return;
  }

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0;
            padding: 40px;
            color: #0f172a;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #0284c7;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .header-title h1 {
            margin: 0;
            font-size: 24px;
            color: #0284c7;
          }
          .header-title p {
            margin: 4px 0 0 0;
            font-size: 13px;
            color: #64748b;
          }
          .meta-info {
            text-align: right;
            font-size: 12px;
            color: #475569;
          }
          .stats-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 28px;
          }
          .stat-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 14px 18px;
            border-radius: 10px;
          }
          .stat-box span {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
          }
          .stat-box h2 {
            margin: 4px 0 0 0;
            font-size: 20px;
            color: #0f172a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            background-color: #0284c7;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            text-align: left;
            padding: 10px 12px;
          }
          td {
            padding: 10px 12px;
            font-size: 13px;
            border-bottom: 1px solid #e2e8f0;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 99px;
            font-size: 11px;
            font-weight: 700;
          }
          .active { background: #dcfce7; color: #15803d; }
          .deleted { background: #ffe4e6; color: #be123c; }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #94a3b8;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-title">
            <h1>🎓 Student Management System</h1>
            <p>${title}</p>
          </div>
          <div class="meta-info">
            <strong>Generated Date:</strong> ${dateStr}<br/>
            <strong>Total Students:</strong> ${students.length} Records
          </div>
        </div>

        <div class="stats-cards">
          <div class="stat-box">
            <span>Total Enrolled</span>
            <h2>${students.length}</h2>
          </div>
          <div class="stat-box">
            <span>Active Roster</span>
            <h2>${activeCount}</h2>
          </div>
          <div class="stat-box">
            <span>Average Class Score</span>
            <h2>${avgMarks} / 100</h2>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Roll #</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Age</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${students
              .map(
                (s) => `
              <tr>
                <td>#${s.rollNo}</td>
                <td><strong>${s.name}</strong></td>
                <td>${s.email}</td>
                <td>${s.branch}</td>
                <td>${s.age} yrs</td>
                <td><strong>${s.marks}</strong>/100</td>
                <td><span class="badge ${s.isDeleted ? "deleted" : "active"}">${s.isDeleted ? "Soft Deleted" : "Active"}</span></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <span>Official Academic Report • Confidential</span>
          <span>Page 1 of 1</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 400);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
