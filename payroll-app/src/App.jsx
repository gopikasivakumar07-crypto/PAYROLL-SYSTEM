import { BrowserRouter } from "react-router-dom";

import {
  AuthProvider,
  Login,
  Register,
} from "./Module1_RegistrationAuth";

import {
  EmployeeList,
  Attendance,
  LeaveRequest,
} from "./Module2_EmployeeAttendance";

import {
  Payroll,
  Payslip,
  Reports,
} from "./Module3_PayrollReporting";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ padding: "20px" }}>

          <h1>Login Page</h1>
          <Login />

          <hr />

          <h1>Register Page</h1>
          <Register />

          <hr />

          <h1>Employee Management</h1>
          <EmployeeList />

          <hr />

          <h1>Attendance Management</h1>
          <Attendance />

          <hr />

          <h1>Leave Request Management</h1>
          <LeaveRequest />

          <hr />

          <h1>Payroll Processing</h1>
          <Payroll />

          <hr />

          <h1>Payslip Generation</h1>
          <Payslip />

          <hr />

          <h1>Payroll Reports</h1>
          <Reports />

        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;