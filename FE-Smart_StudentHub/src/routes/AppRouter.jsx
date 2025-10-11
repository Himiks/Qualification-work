import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../auth/components/Login";
import Signup from "../auth/components/Signup";
import AdminDashboard from "../modules/admin/components/AdminDashboard";
import EmployeeDashboard from "../modules/employee/components/EmployeeDashboard";
import AdminUsers from "../modules/admin/components/AdminPostTask";
import Navbar from "../layout/Navbar";
import AdminPostTask from "../modules/admin/components/AdminPostTask";

function AppRouter() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin/task" element={<AdminPostTask />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
