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


const getTasksById = async (id) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/tasks/${id}`, { headers });
  return response.data;
};

const getTasks = async () => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/tasks`, { headers });
  return response.data;
};

const adminService = { getUsers, postTask, getTasks, deleteTask, getTasksById };
export default adminService;
