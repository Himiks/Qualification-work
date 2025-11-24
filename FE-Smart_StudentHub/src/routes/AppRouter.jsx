import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../auth/components/Login";
import Signup from "../auth/components/Signup";
import AdminDashboard from "../modules/admin/components/AdminDashboard";
import EmployeeDashboard from "../modules/employee/components/EmployeeDashboard";
import AdminPostTask from "../modules/admin/components/AdminPostTask";
import AdminUpdateTask from "../modules/admin/components/AdminUpdateTask"; 
import EmployeeUpdateTask from "../modules/employee/components/EmployeeUpdateTask";
import AdminViewTaskDetails from "../modules/admin/components/AdminViewTaskDetails";
import EmployeeViewTaskDetails from "../modules/employee/components/EmployeeViewTaskDetails";
import Navbar from "../layout/Navbar";
import EmployeePostTask from "../modules/employee/components/EmployeePostTask";
import TechniquesPage from "../layout/TechniquesPage";
import TechniqueDetail from "../layout/TechniqueDetail";
import Eisenhower from "../modules/components/Eisenhower";
import ExpensesDashboard from "../modules/expense/components/ExpensesDashboard";
import FoldersDashboard from "../modules/folder/components/FoldersDashboard";
import AdminViewAllUsers from "../modules/admin/components/AdminViewAllUsers";
import EmployeeProfile from "../modules/employee/components/EmployeeProfile";
import AdminProfile from "../modules/admin/components/AdminProfile";
import AdminEditUser from "../modules/admin/components/AdminEditUser";

function AppRouter() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/techniques" element={<TechniquesPage />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/task" element={<AdminPostTask />} />
        <Route path="/admin/task/:id/edit" element={<AdminUpdateTask />} />
        <Route path="/admin/task/:id/details" element={<AdminViewTaskDetails />} />
        <Route path="/admin/users" element={<AdminViewAllUsers />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/user/:id/edit" element={<AdminEditUser />} />
        



        {/* Employee */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
         <Route path="/employee/task" element={<EmployeePostTask />} />
        <Route path="/employee/task/:id/edit" element={<EmployeeUpdateTask />} />
        <Route path="/employee/task/:id/details" element={<EmployeeViewTaskDetails />} />
        <Route path="/techniques/:techniqueName/:taskId" element={<TechniqueDetail />} />
        <Route path="/techniques/:techniqueName" element={<Eisenhower />} />
        <Route path="/expenses" element={<ExpensesDashboard />} />
        <Route path="/folders" element={<FoldersDashboard />} />
        <Route path="/employee/profile" element={<EmployeeProfile />} />
        
      </Routes>
    </Router>
  );
}

export default AppRouter;
