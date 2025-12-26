import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import employeeService from "../services/employeeService";

function EmployeeViewTaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTask();
    fetchComments();
  }, []);

  const fetchTask = async () => {
    try {
      const res = await employeeService.getTaskById(id);
      setTask(res);
    } catch (err) {
      console.error("Error fetching task details:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await employeeService.getCommentsByTaskId(id);
      setComments(res);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return alert("Comment cannot be empty");
    try {
      setSending(true);
      const newComment = await employeeService.createComment(id, comment);
      setComments((prev) => [...prev, newComment]);
      setComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSending(false);
    }
  };

  if (!task) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        <i className="fa-solid fa-spinner animate-spin mr-2"></i>
        Loading task details...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Task Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
          <i className="fa-solid fa-clipboard-check text-blue-500"></i>
          Task Details
        </h2>
        <span className="px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
          {task.taskStatus}
        </span>
      </div>

      {/* Task Info Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">{task.title}</h3>
        <p className="text-gray-600 leading-relaxed">{task.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm">
          <InfoItem
            icon="fa-calendar-days"
            label="Due Date"
            value={new Date(task.dueDate).toLocaleDateString()}
          />
          <InfoItem
            icon="fa-user"
            label="Employee"
            value={task.employeeName}
          />
          <InfoItem
            icon="fa-star"
            label="Priority"
            value={task.priority}
          />
          <InfoItem
            icon="fa-cog"
            label="Status"
            value={task.taskStatus}
          />
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <i className="fa-solid fa-comments text-blue-500"></i>
          Comments
        </h3>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-4"
              >
                <p className="text-gray-800">{c.content}</p>
                <p className="text-xs text-gray-500 text-right mt-2">
                  <i className="fa-regular fa-clock mr-1"></i>
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No comments yet. Be the first to comment.
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddComment}
            disabled={sending}
            className={`px-5 rounded-xl text-white font-semibold transition ${
              sending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
      <i className={`fa-solid ${icon} text-blue-500 text-lg`}></i>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default EmployeeViewTaskDetails;
