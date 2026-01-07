import axios from "axios";
import storageService from "../../../auth/services/storageService";

const BASE_URL = "http://localhost:8080/api/folders";

const getUserFolders = async (userId) => { // Fetch folders for a specific user
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get(`${BASE_URL}?userId=${userId}`, { headers });
  return res.data;
};

const getPublicFolders = async () => { // Fetch public folders
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get(`${BASE_URL}/public`, { headers });
  return res.data;
};

const createFolder = async (folderDTO) => { // Create a new folder
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.post(BASE_URL, folderDTO, { headers });
  return res.data;
};

const uploadFile = async (folderId, file) => { // Upload a file to a folder
  const token = storageService.getToken();
  const headers = { 
    Authorization: `Bearer ${token}`, 
    "Content-Type": "multipart/form-data" 
  };
  const formData = new FormData(); // Create form data
  formData.append("file", file);
  const res = await axios.post(`${BASE_URL}/${folderId}/upload`, formData, { headers });
  return res.data;
};

const getFilesInFolder = async (folderId) => { // Get all files in a folder
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get(`${BASE_URL}/${folderId}/files`, { headers });
  return res.data;
};



const updateFolder = async (folderId, folderDTO) => { // Update folder details
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.put(`${BASE_URL}/${folderId}`, folderDTO, { headers });
  return res.data;
};

const deleteFolder = async (folderId) => { // Delete a folder
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  await axios.delete(`${BASE_URL}/${folderId}`, { headers });
};


const renameFile = async (fileId, newName) => { // Rename a file
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };

  const res = await axios.put(
    `${BASE_URL}/file/${fileId}?newName=${encodeURIComponent(newName)}`,
    {},
    { headers }
  );
  return res.data;
};


const deleteFile = async (fileId) => {  // Delete a file
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  await axios.delete(`${BASE_URL}/file/${fileId}`, { headers });
};

const downloadFile = async (fileId) => { // Download a file
  const token = storageService.getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const res = await axios.get(  // Download file request
    `${BASE_URL}/file/${fileId}/download`,
    {
      headers,
      responseType: "blob",
    }
  );

  return res.data;
};

const getAllFolders = async () => { // Fetch all folders
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get(`${BASE_URL}/all`, { headers });
  return res.data;
};

export default { getUserFolders, getPublicFolders, createFolder, uploadFile, getFilesInFolder, updateFolder, deleteFolder, renameFile, deleteFile, downloadFile, getAllFolders };