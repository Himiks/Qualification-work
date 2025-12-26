import React from "react";
import { Link, useNavigate } from "react-router-dom";
import storageService from "../auth/services/storageService";

function MainPage() {
  const navigate = useNavigate();

  const token = storageService.getToken();
  const role = storageService.getUserRole(); 

  const isAuthenticated = !!token;

  const handleDashboardRedirect = () => {
    if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (role === "EMPLOYEE") {
      navigate("/employee/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
          Smart <span className="text-cyan-500">Student</span> Hub
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          One place to manage your <b>studies</b>, <b>tasks</b>, <b>finances</b> and
          <b> shared resources</b> — designed specially for students.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          {isAuthenticated ? (
            <button
              onClick={handleDashboardRedirect}
              className="px-10 py-3 rounded-xl bg-cyan-500 text-white font-semibold shadow-lg hover:bg-cyan-600 transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-rocket"></i> Go to Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-8 py-3 rounded-xl bg-cyan-500 text-white font-semibold shadow-lg hover:bg-cyan-600 transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-sign-in-alt"></i> Get Started
              </Link>

              <Link
                to="/register"
                className="px-8 py-3 rounded-xl border border-cyan-500 text-cyan-600 font-semibold hover:bg-cyan-50 transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-user-plus"></i> Create Account
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<i className="fa-solid fa-folder-open text-cyan-500"></i>}
            title="File Storage"
            text="Organize your study materials in folders, upload and share files easily."
          />
          <FeatureCard
            icon={<i className="fa-solid fa-tasks text-yellow-500"></i>}
            title="Task Management"
            text="Plan assignments, deadlines and personal goals in one system."
          />
          <FeatureCard
            icon={<i className="fa-solid fa-wallet text-green-500"></i>}
            title="Finance Tracking"
            text="Track student expenses and manage your budget responsibly."
          />
          <FeatureCard
            icon={<i className="fa-solid fa-handshake text-purple-500"></i>}
            title="Collaboration"
            text="Share public folders and resources with other students."
          />
        </div>
      </section>

      <section className="bg-white py-20 border-t">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Why Smart Student Hub?
          </h2>

          <p className="mt-6 text-gray-600 text-lg">
            Students often use multiple apps for notes, files, finances and tasks.
            This leads to chaos, lost data and wasted time.
          </p>

          <p className="mt-4 text-gray-600 text-lg">
            <b>Smart Student Hub</b> unifies everything into one simple,
            clean and student-focused platform.
          </p>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-500 text-sm">
        {new Date().getFullYear()} Smart Student Hub — Built for students
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}

export default MainPage;
