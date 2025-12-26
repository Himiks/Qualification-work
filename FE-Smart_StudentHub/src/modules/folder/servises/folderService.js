import axios from "axios";
import storageService from "../../../auth/services/storageService";

const BASE_URL = "http://localhost:8080/api/folders";

const getUserFolders = async (userId) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get(`${BASE_URL}?userId=${userId}`, { headers });
  return res.data;
};

const getPublicFolders = async () => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get(`${BASE_URL}/public`, { headers });
  return res.data;
};

const createFolder = async (folderDTO) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.post(BASE_URL, folderDTO, { headers });
  return res.data;
};

const uploadFile = async (folderId, file) => {
  const token = storageService.getToken();
  const headers = { 
    Authorization: `Bearer ${token}`, 
    "Content-Type": "multipart/form-data" 
  };
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${BASE_URL}/${folderId}/upload`, formData, { headers });
  return res.data;
};

const getFilesInFolder = async (folderId) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get(`${BASE_URL}/${folderId}/files`, { headers });
  return res.data;
};



const updateFolder = async (folderId, folderDTO) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.put(`${BASE_URL}/${folderId}`, folderDTO, { headers });
  return res.data;
};

const deleteFolder = async (folderId) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  await axios.delete(`${BASE_URL}/${folderId}`, { headers });
};


const renameFile = async (fileId, newName) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };

  const res = await axios.put(
    `${BASE_URL}/file/${fileId}?newName=${encodeURIComponent(newName)}`,
    {},
    { headers }
  );
  return res.data;
};


const deleteFile = async (fileId) => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  await axios.delete(`${BASE_URL}/file/${fileId}`, { headers });
};

const downloadFile = async (fileId) => {
  const token = storageService.getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const res = await axios.get(
    `${BASE_URL}/file/${fileId}/download`,
    {
      headers,
      responseType: "blob",
    }
  );

  return res.data;
};

const getAllFolders = async () => {
  const token = storageService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get(`${BASE_URL}/all`, { headers });
  return res.data;
};

export default { getUserFolders, getPublicFolders, createFolder, uploadFile, getFilesInFolder, updateFolder, deleteFolder, renameFile, deleteFile, downloadFile, getAllFolders };