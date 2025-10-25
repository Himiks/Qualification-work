import axios from "axios";
import storageService from "../../../auth/services/storageService";

const API_URL = "http://localhost:8080/api/techniques";

const getAuthHeaders = () => {
  const token = storageService.getToken();
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getAllTechniques = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  console.log("Techniques fetched:", response.data);
  return response.data;
};

export const getTechniqueByName = async (name) => {
  const response = await axios.get(`${API_URL}/technique/${encodeURIComponent(name)}`, getAuthHeaders());
  return response.data;
};
