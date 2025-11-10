import React, { useEffect, useState } from "react";
import folderService from "../servises/folderService";
import storageService from "../../../auth/services/storageService";

function FoldersDashboard() {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null); // открытая папка
  const [newFolderName, setNewFolderName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [downloading, setDownloading] = useState({});

  const userId = storageService.getUserId();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const [userFolders, publicFolders] = await Promise.all([
        folderService.getUserFolders(userId),
        folderService.getPublicFolders(),
      ]);
      setFolders([
        ...userFolders,
        ...publicFolders.filter((f) => f.userId !== userId),
      ]);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch folders");
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return alert("Folder name required");
    try {
      const folderDTO = { name: newFolderName, public: isPublic, userId };
      const newFolder = await folderService.createFolder(folderDTO);
      setFolders((prev) => [...prev, { ...newFolder, files: [] }]);
      setNewFolderName("");
      setIsPublic(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create folder");
    }
  };

  const openFolder = (folder) => {
    setCurrentFolder(folder);
    setSelectedFile(null);
  };

  const goBack = () => {
    setCurrentFolder(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return alert("Select a file first");
    try {
      setLoadingUpload(true);
      await folderService.uploadFile(currentFolder.id, selectedFile);
      const updatedFolder = await folderService.getFilesInFolder(currentFolder.id);
      setCurrentFolder({ ...currentFolder, files: updatedFolder });
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    const token = storageService.getToken();
    setDownloading({ ...downloading, [fileId]: true });
    try {
      const response = await folderService.downloadFile(fileId, token);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download file");
    } finally {
      setDownloading({ ...downloading, [fileId]: false });
    }
  };

  // --- Рендер списка папок ---
  if (!currentFolder) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">📁 Folders</h2>

        {/* Создание новой папки */}
        <div className="flex gap-2 mb-6 items-center">
          <input
            type="text"
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              className="accent-cyan-500"
            />
            Public
          </label>
          <button
            onClick={handleCreateFolder}
            className="px-4 py-2 rounded text-white bg-cyan-500 hover:bg-cyan-600"
          >
            Create Folder
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="p-5 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition"
              onClick={() => openFolder(folder)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{folder.name}</h3>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${folder.public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {folder.public ? 'Public' : 'Private'}
                </span>
              </div>
              <p className="text-gray-500 mt-2">{folder.files.length} files</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Рендер файлов внутри папки ---
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
      >
        ← Back to Folders
      </button>

      <h2 className="text-2xl font-bold mb-4">{currentFolder.name}</h2>

      <div className="flex gap-2 mb-4 items-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleUploadFile}
          disabled={!selectedFile || loadingUpload}
          className={`px-4 py-2 rounded text-white font-medium ${
            selectedFile && !loadingUpload ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loadingUpload ? "Uploading..." : "Upload"}
        </button>
      </div>

      <ul className="bg-white rounded-xl shadow divide-y divide-gray-200">
        {currentFolder.files.length > 0 ? (
          currentFolder.files.map((file) => (
            <li key={file.id} className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 transition">
              <span>{file.fileName}</span>
              <button
                onClick={() => handleDownload(file.id, file.fileName)}
                disabled={downloading[file.id]}
                className="text-cyan-600 hover:underline text-sm font-medium"
              >
                {downloading[file.id] ? "Downloading..." : "Download"}
              </button>
            </li>
          ))
        ) : (
          <li className="px-4 py-2 text-gray-400 italic">No files</li>
        )}
      </ul>
    </div>
  );
}

export default FoldersDashboard;
