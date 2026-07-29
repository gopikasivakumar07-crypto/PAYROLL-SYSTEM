// ============================================================
// MODULE 3 — Payroll Processing Engine, Reporting & Payslip Generation Module
// Contains: Payroll, Payslip, Reports, and the root App (routing for all 3 modules)
// Depends on: api, useAuth, AuthProvider, ProtectedRoute, Navbar, Login, Register
//             from Module1_RegistrationAuth.jsx
//             EmployeeList, Attendance, LeaveRequest from Module2_EmployeeAttendance.jsx
// ============================================================
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { api, useAuth, AuthProvider, ProtectedRoute, Navbar, Login, Register } from "./Module1_RegistrationAuth";
import { EmployeeList, Attendance, LeaveRequest } from "./Module2_EmployeeAttendance";
import "./App.css";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ---------------- Payroll Processing ----------------
export function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api.get("/employees").then(setEmployees).catch((e) => setError(e.message));
  }, []);

  const loadPayrolls = () => {
    api.get(`/payroll?month=${month}&year=${year}`).then(setPayrolls).catch((e) => setError(e.message));
  };

  useEffect(() => {
    loadPayrolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const handleProcessAll = async () => {
    setError("");
    setMessage("");
    setProcessing(true);
    try {
      const result = await api.post("/payroll/process", { month, year });
      setMessage(`Processed payroll for ${result.processed_count} employee(s)`);
      loadPayrolls();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const employeeName = (id) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? emp.full_name : `#${id}`;
  };

  return (
    <div className="page">
      <h2>Payroll Processing</h2>
      {error && <div className="form-error">{error}</div>}
      {message && <div className="form-success">{message}</div>}

      <div className="action-bar">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {monthNames.map((m, idx) => (
            <option key={m} value={idx + 1}>{m}</option>
          ))}
        </select>
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        <button onClick={handleProcessAll} disabled={processing}>
          {processing ? "Processing..." : "Run Payroll for All Employees"}
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Present</th>
            <th>Leave</th>
            <th>Gross</th>
            <th>Deductions</th>
            <th>Net Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((p) => (
            <tr key={p.id}>
              <td>{employeeName(p.employee_id)}</td>
              <td>{p.days_present}</td>
              <td>{p.days_on_leave}</td>
              <td>{p.gross_salary}</td>
              <td>{p.total_deductions}</td>
              <td><strong>{p.net_salary}</strong></td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------- Payslip ----------------
export function Payslip() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.employee_id) return;
    api.get(`/payroll/employee/${user.employee_id}`).then(setHistory).catch((e) => setError(e.message));
  }, [user]);

  const handleDownload = async (payrollId) => {
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/payroll/${payrollId}/payslip`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to download payslip");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${payrollId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h2>My Payslips</h2>
      {error && <div className="form-error">{error}</div>}

      <div className="payslip-layout">
        <table className="data-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((p) => (
              <tr key={p.id}>
                <td>{monthNames[p.month - 1]} {p.year}</td>
                <td>{p.net_salary}</td>
                <td>{p.status}</td>
                <td>
                  <button onClick={() => setSelected(p)}>View</button>
                  <button onClick={() => handleDownload(p.id)}>Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selected && (
          <div className="payslip-detail">
            <h3>Payslip — {monthNames[selected.month - 1]} {selected.year}</h3>
            <table className="detail-table">
              <tbody>
                <tr><td>Base Salary (prorated)</td><td>{selected.base_salary}</td></tr>
                <tr><td>HRA</td><td>{selected.hra}</td></tr>
                <tr><td>DA</td><td>{selected.da}</td></tr>
                <tr><td>Other Allowances</td><td>{selected.other_allowances}</td></tr>
                <tr><td><strong>Gross Salary</strong></td><td><strong>{selected.gross_salary}</strong></td></tr>
                <tr><td>PF Deduction</td><td>{selected.pf_deduction}</td></tr>
                <tr><td>Tax Deduction</td><td>{selected.tax_deduction}</td></tr>
                <tr><td>Other Deductions</td><td>{selected.other_deductions}</td></tr>
                <tr><td><strong>Total Deductions</strong></td><td><strong>{selected.total_deductions}</strong></td></tr>
                <tr><td><strong>Net Salary</strong></td><td><strong>{selected.net_salary}</strong></td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Reports ----------------
export function Reports() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const [byDepartment, setByDepartment] = useState([]);
  const [error, setError] = useState("");

  const loadReport = () => {
    setError("");
    Promise.all([
      api.get(`/payroll/report/summary?month=${month}&year=${year}`),
      api.get(`/payroll/report/by-department?month=${month}&year=${year}`),
    ])
      .then(([s, d]) => {
        setSummary(s);
        setByDepartment(d);
      })
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  return (
    <div className="page">
      <h2>Payroll Reports</h2>
      {error && <div className="form-error">{error}</div>}

      <div className="action-bar">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {monthNames.map((m, idx) => (
            <option key={m} value={idx + 1}>{m}</option>
          ))}
        </select>
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
      </div>

      {summary && (
        <div className="summary-cards">
          <div className="card"><h4>Total Employees Paid</h4><p>{summary.total_employees}</p></div>
          <div className="card"><h4>Total Gross Payout</h4><p>{summary.total_gross}</p></div>
          <div className="card"><h4>Total Deductions</h4><p>{summary.total_deductions}</p></div>
          <div className="card"><h4>Total Net Payout</h4><p>{summary.total_net}</p></div>
        </div>
      )}

      <h3>Breakdown by Department</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Employees</th>
            <th>Total Gross</th>
            <th>Total Net</th>
          </tr>
        </thead>
        <tbody>
          {byDepartment.map((row) => (
            <tr key={row.department}>
              <td>{row.department}</td>
              <td>{row.employee_count}</td>
              <td>{row.total_gross}</td>
              <td>{row.total_net}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------- Root App (wires all 3 modules together) ----------------
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Navigate to="/employees" replace />} />

          <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/leave" element={<ProtectedRoute><LeaveRequest /></ProtectedRoute>} />

          <Route path="/payroll" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><Payroll /></ProtectedRoute>} />
          <Route path="/payslips" element={<ProtectedRoute><Payslip /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><Reports /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
