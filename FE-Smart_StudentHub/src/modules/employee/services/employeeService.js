import axios from "axios";
import storageService from "../../../auth/services/storageService";

const BASE_URL = "http://localhost:8080/api/employee";



const getAllTasksByUserId = async () => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/tasks`, { headers });
  return response.data;
};

const updateTaskStatus = async (id, status) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.put(`${BASE_URL}/task/${id}/${status}`, {}, { headers });
  return response.data;
};


const employeeService = { getAllTasksByUserId, updateTaskStatus };
export default employeeService;