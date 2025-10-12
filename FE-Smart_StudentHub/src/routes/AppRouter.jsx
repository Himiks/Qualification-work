import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../auth/components/Login";
import Signup from "../auth/components/Signup";
import AdminDashboard from "../modules/admin/components/AdminDashboard";
import EmployeeDashboard from "../modules/employee/components/EmployeeDashboard";
import AdminPostTask from "../modules/admin/components/AdminPostTask";
import AdminUpdateTask from "../modules/admin/components/AdminUpdateTask"; 
import EmployeeUpdateTask from "../modules/employee/components/EmployeeUpdateTask";
import Navbar from "../layout/Navbar";

function AppRouter() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* 👑 Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/task" element={<AdminPostTask />} />
        <Route path="/admin/task/:id/edit" element={<AdminUpdateTask />} /> {/* ✅ Новый маршрут */}

        {/* 👷 Employee */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/task/:id/edit" element={<EmployeeUpdateTask />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
