import axios from "axios";
import storageService from "../../../auth/services/storageService";

const API_URL = "http://localhost:8080/api/techniques";
const API_URL_ADMIN = "http://localhost:8080/api/admin/techniques";

const getAuthHeaders = () => { // Helper to get auth headers
  const token = storageService.getToken();
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getAllTechniques = async () => { // get all techniques
  const response = await axios.get(API_URL, getAuthHeaders());
  console.log("Techniques fetched:", response.data);
  return response.data;
};

export const getTechniqueByName = async (name) => {  // get technique by name
  const response = await axios.get(`${API_URL}/technique/${encodeURIComponent(name)}`, getAuthHeaders());
  return response.data;
};

export const createTechnique = (data) => //  create Technique
  axios.post(API_URL_ADMIN, data,  getAuthHeaders());

export const updateTechnique = (id, data) => // update technique
  axios.put(`${API_URL_ADMIN}/${id}`, data, getAuthHeaders() );

export const deleteTechnique = (id) => // delete technique
  axios.delete(`${API_URL_ADMIN}/${id}`,  getAuthHeaders());

export default {
  getAllTechniques,
  getTechniqueByName,
  createTechnique,
  updateTechnique,
  deleteTechnique,
};