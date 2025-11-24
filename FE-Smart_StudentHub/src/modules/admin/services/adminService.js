import axios from "axios";
import storageService from "../../../auth/services/storageService";

const BASE_URL = "http://localhost:8080/api/admin";

const getUsers = async () => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/users`, { headers });
  return response.data;
};

const postTask = async (taskData) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(`${BASE_URL}/task`, taskData, { headers });
  return response.data;
};


const deleteTask = async (id) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${BASE_URL}/task/${id}`, { headers });
  return response.data;
};

const deleteUser = async (id) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${BASE_URL}/user/${id}`, { headers });
  return response.data;
}

const getTaskById = async (id) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/task/${id}`, { headers });
  return response.data;
};

const getUserById = async (id) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/user/${id}`, { headers });
  return response.data;
}


const updateUser = async (id, userData) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.put(`${BASE_URL}/user/${id}`, userData, { headers });
  return response.data;
}

const updateProfile = async (adminData) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.put(`${BASE_URL}/profile`, adminData, { headers });
  return response.data;
}


const getTasks = async () => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/tasks`, { headers });
  return response.data;
};

const searchTask = async (title) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/tasks/search/${title}`, { headers });
  return response.data;
};


const updateTask = async (id, taskData) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.put(`${BASE_URL}/task/${id}`, taskData, { headers });
  return response.data;
};


const createComment = async (taskId, content) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(
    `${BASE_URL}/task/comment/${taskId}?content=${encodeURIComponent(content)}`,
    {},
    { headers }
  );
  return response.data;
};

const getCommentsByTaskId = async (taskId) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/comments/${taskId}`, { headers });
  return response.data;
};

const adminService = { getUsers, postTask, getTasks, deleteTask, getTaskById, updateTask, searchTask, createComment, getCommentsByTaskId, deleteUser, getUserById, updateUser, updateProfile };
export default adminService;
