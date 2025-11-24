import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService from "../services/adminService";

function AdminViewTaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchTask();
    fetchComments();
  }, []);


  const fetchTask = async () => {
    try {
      const res = await adminService.getTaskById(id);
      setTask(res);
    } catch (err) {
      console.error("Error fetching task details:", err);
    }
  };

  
  const fetchComments = async () => {
    try {
      const res = await adminService.getCommentsByTaskId(id);
      setComments(res);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };


  const handleAddComment = async () => {
    if (!comment.trim()) return alert("Comment cannot be empty");
    try {
      const newComment = await adminService.createComment(id, comment);
      setComments((prev) => [...prev, newComment]);
      setComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (!task) {
    return <p className="text-center text-gray-500 mt-10">Loading task details...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 Task Details</h2>

      <div className="bg-white shadow rounded-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
        <p className="text-gray-700 mb-4">{task.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>📅 Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
          <p><strong>👤 User:</strong> {task.employeeName}</p>
          <p><strong>⭐ Priority:</strong> {task.priority}</p>
          <p><strong>⚙️ Status:</strong> {task.taskStatus}</p>
        </div>
      </div>

     
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">💬 Comments</h3>

        <div className="space-y-3 mb-4">
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div
                key={i}
                className="bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm"
              >
                <p className="text-gray-800">{c.content}</p>
                <p className="text-gray-500 text-xs text-right">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="border border-gray-300 rounded-lg p-2 flex-1 focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminViewTaskDetails;
