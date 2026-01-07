import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService from "../services/adminService";
import storageService from "../../../auth/services/storageService";


function AdminViewTaskDetails() {
  const { id } = useParams(); // Get task ID from URL
  const [task, setTask] = useState(null); // Task state
  const [comment, setComment] = useState(""); // New comment state
  const [comments, setComments] = useState([]); // Comments state
  const [sending, setSending] = useState(false);// Sending comment state
  const [editingCommentId, setEditingCommentId] = useState(null); // Editing comment ID state
  const [editingCommentText, setEditingCommentText] = useState(""); // Editing comment text state

  useEffect(() => { // Fetch task details and comments on mount
    fetchTask();
    fetchComments();
  }, []);

  const fetchTask = async () => { // Fetch task details
    try {
      const res = await adminService.getTaskById(id); // API call to get task
      setTask(res);
    } catch (err) {
      console.error("Error fetching task details:", err);
    }
  };

  const fetchComments = async () => { // Fetch comments for the task
    try {
      const res = await adminService.getCommentsByTaskId(id); // API call to get comments
      setComments(res);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async () => { // Add new comment handler
    if (!comment.trim()) return;
    try {
      setSending(true);
      const newComment = await adminService.createComment(id, comment); // API call to create comment
      setComments((prev) => [...prev, newComment]); // Update comments state
      setComment(""); // Clear input
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSending(false);
    }
  };

  const handleEditComment = (c) => { // Edit comment handler
    setEditingCommentId(c.id); // Set editing comment ID
    setEditingCommentText(c.content); // Set editing comment text
  };

  const handleSaveComment = async (commentId) => { // Save edited comment handler
    try {
      await adminService.updateComment(commentId, editingCommentText); // API call to update comment
      setComments((prev) => // Update comments state
        prev.map((c) =>
          c.id === commentId ? { ...c, content: editingCommentText } : c // Update specific comment
        )
      );
      setEditingCommentId(null); // Clear editing ID
      setEditingCommentText(""); // Clear editing text
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => { // Delete comment handler
    try {
      await adminService.deleteComment(commentId); // API call to delete comment
      setComments((prev) => prev.filter((c) => c.id !== commentId)); // Update comments state
    } catch (err) {
      console.error(err);
    }
  };

  if (!task) { // Show loading state
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        <i className="fa-solid fa-spinner animate-spin mr-2"></i>
        Loading task details...
      </div>
    );
  }

  if (storageService.getUserRole() !== "ADMIN") { // Access control
    return (
      <div className="p-6 w-full h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-red-600 drop-shadow mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 text-lg">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  // Render task details and comments
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
          <i className="fa-solid fa-clipboard-check text-cyan-500"></i>
          Task Details
        </h2>

        <span className="px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
          {task.taskStatus}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">{task.title}</h3>
        <p className="text-gray-600 leading-relaxed">{task.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm">
          <InfoItem // Reusable info item component
            icon="fa-calendar-days"
            label="Due Date"
            value={new Date(task.dueDate).toLocaleDateString()} // Format due date
          />
          <InfoItem
            icon="fa-user"
            label="User"
            value={task.employeeName} // Assigned user name
          />
          <InfoItem
            icon="fa-star"
            label="Priority"
            value={task.priority} // Task priority
          />
          <InfoItem
            icon="fa-layer-group"
            label="Status"
            value={task.taskStatus} // Task status
          />
        </div>
      </div>

  
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <i className="fa-solid fa-comments text-cyan-500"></i>
          Comments
        </h3>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {comments.length === 0 && (
            <p className="text-gray-500 italic text-center">
              No comments yet. Be the first to comment.
            </p>
          )}
          {comments.map((c) => ( // Map through comments
            <div
              key={c.id}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex justify-between items-start"
            >
              {editingCommentId === c.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)} // Update editing text
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    onClick={() => handleSaveComment(c.id)} // Save edited comment
                    className="text-green-500 hover:text-green-700"
                    title="Save"
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)} // Cancel editing
                    className="text-gray-400 hover:text-gray-600"
                    title="Cancel"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-gray-800">{c.content}</p> {/* Comment content */}
                    <p className="text-xs text-gray-500 mt-2">
                      <i className="fa-regular fa-clock mr-1"></i>
                      {new Date(c.createdAt).toLocaleString()} {/* Format comment date */}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditComment(c)} // Edit comment
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit Comment"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c.id)} // Delete comment
                      className="text-red-500 hover:text-red-700"
                      title="Delete Comment"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)} // New comment input
            placeholder="Write a comment..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={handleAddComment} // Add comment handler
            disabled={sending}
            className={`px-5 rounded-xl text-white font-semibold transition ${
              sending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) { // Reusable info item component
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
      <i className={`fa-solid ${icon} text-cyan-500 text-lg`}></i> 
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default AdminViewTaskDetails;
