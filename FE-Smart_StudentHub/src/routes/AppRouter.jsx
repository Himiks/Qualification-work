import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../auth/components/Login";
import Signup from "../auth/components/Signup";
import Navbar from "../layout/Navbar";

function AppRouter() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
