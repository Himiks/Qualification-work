import axios from "axios";
import storageService from "../../../auth/services/storageService";

const BASE_URL = "http://localhost:8080/api/employee";



const getAllTasksByUserId = async () => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/tasks`, { headers });
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

const getCommentsByTaskId = async (taskId) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/comments/${taskId}`, { headers });
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

const getTaskById = async (id) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/task/${id}`, { headers });
  return response.data;
};


const employeeService = { getAllTasksByUserId, getCommentsByTaskId, createComment, getTaskById, postTask, deleteTask, searchTask, updateTask };
export default employeeService;