import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import employeeService from "../services/employeeService";
import { toast } from "react-toastify";

function EmployeeViewTaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    fetchTask();
    fetchComments();
    fetchLoggedInUser();
  }, []);

  const fetchTask = async () => {
    try {
      const res = await employeeService.getTaskById(id);
      setTask(res);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await employeeService.getCommentsByTaskId(id);
      setComments(res);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLoggedInUser = async () => {
    try {
      const res = await employeeService.getLoggedInUser();
      setLoggedInUserId(res.id);
    } catch (err) {
      console.error(err);
    }
  };

const handleAddComment = async () => {
  if (!comment.trim()) return toast.error("Comment cannot be empty");
  try {
    setSending(true);
    const newComment = await employeeService.createComment(id, comment);

    setComments((prev) => [
      ...prev,
      { ...newComment, userId: loggedInUserId }
    ]);

    setComment("");
  } catch (err) {
    console.error(err);
  } finally {
    setSending(false);
  }
};

  const handleEditComment = (c) => {
    setEditingCommentId(c.id);
    setEditingCommentText(c.content);
  };

  const handleSaveComment = async (commentId) => {
    try {
      await employeeService.updateComment(commentId, editingCommentText);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content: editingCommentText } : c
        )
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await employeeService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    }
  };

  if (!task) return <div className="flex justify-center items-center h-[60vh] text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
          <i className="fa-solid fa-clipboard-check text-blue-500"></i> Task Details
        </h2>
        <span className="px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
          {task.taskStatus}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">{task.title}</h3>
        <p className="text-gray-600 leading-relaxed">{task.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm">
          <InfoItem icon="fa-calendar-days" label="Due Date" value={new Date(task.dueDate).toLocaleDateString()} />
          <InfoItem icon="fa-user" label="Employee" value={task.employeeName} />
          <InfoItem icon="fa-star" label="Priority" value={task.priority} />
          <InfoItem icon="fa-cog" label="Status" value={task.taskStatus} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <i className="fa-solid fa-comments text-blue-500"></i> Comments
        </h3>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {comments.length === 0 && <p className="text-gray-500 italic text-center">No comments yet. Be the first to comment.</p>}
          {comments.map((c) => (
            <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex justify-between items-start">
              {editingCommentId === c.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button onClick={() => handleSaveComment(c.id)} className="text-green-500 hover:text-green-700" title="Save">
                    <i className="fa-solid fa-check"></i>
                  </button>
                  <button onClick={() => setEditingCommentId(null)} className="text-gray-400 hover:text-gray-600" title="Cancel">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-gray-800">{c.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      <i className="fa-regular fa-clock mr-1"></i> {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {loggedInUserId === c.userId && (
                    <div className="flex gap-2">
                      <button onClick={() => handleEditComment(c)} className="text-blue-500 hover:text-blue-700" title="Edit Comment">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button onClick={() => handleDeleteComment(c.id)} className="text-red-500 hover:text-red-700" title="Delete Comment">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
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
            className={`px-5 rounded-xl text-white font-semibold transition ${sending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
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
