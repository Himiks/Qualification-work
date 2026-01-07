import axios from "axios";
import storageService from "../../../auth/services/storageService";

const BASE_URL = "http://localhost:8080/api/admin";

const getUsers = async () => { // Fetch all users
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/users`, { headers });
  return response.data;
};

const postTask = async (taskData) => { // Create a new task
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(`${BASE_URL}/task`, taskData, { headers });
  return response.data;
};


const deleteTask = async (id) => { // Delete a task by ID
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${BASE_URL}/task/${id}`, { headers });
  return response.data;
};

const deleteUser = async (id) => { // Delete a user by ID
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${BASE_URL}/user/${id}`, { headers });
  return response.data;
}

const getTaskById = async (id) => { // Fetch a task by ID
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/task/${id}`, { headers });
  return response.data;
};

const getUserById = async (id) => {   // Fetch a user by ID
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/user/${id}`, { headers });
  return response.data;
}


const updateUser = async (id, userData) => { // Update user data
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.put(`${BASE_URL}/user/${id}`, userData, { headers });
  return response.data;
}

const updateProfile = async (adminData) => { // Update admin profile
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.put(`${BASE_URL}/profile`, adminData, { headers });
  return response.data;
}


const getTasks = async () => { // Fetch all tasks
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/tasks`, { headers });
  return response.data;
};

const searchTask = async (title) => { // Search tasks by title
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/tasks/search/${title}`, { headers });
  return response.data;
};


const updateTask = async (id, taskData) => { // Update a task by ID
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.put(`${BASE_URL}/task/${id}`, taskData, { headers });
  return response.data;
};


const createComment = async (taskId, content) => { // Create a comment for a task
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(
    `${BASE_URL}/task/comment/${taskId}?content=${encodeURIComponent(content)}`,
    {},
    { headers }
  );
  return response.data;
};

const getCommentsByTaskId = async (taskId) => { // Fetch comments for a specific task
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/comments/${taskId}`, { headers });
  return response.data;
};



const updateComment = async (id, content) => { // Update a comment by ID
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.put(
    `${BASE_URL}/comment/${id}?content=${encodeURIComponent(content)}`,
    {},
    { headers }
  );
  return res.data;
};

const deleteComment = async (id) => { // Delete a comment by ID
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  await axios.delete(`${BASE_URL}/comment/${id}`, { headers });
};

const adminService = { getUsers, postTask, getTasks, deleteTask, getTaskById, updateTask, searchTask, createComment, getCommentsByTaskId, deleteUser, getUserById, updateUser, updateProfile, updateComment, deleteComment };
export default adminService;
