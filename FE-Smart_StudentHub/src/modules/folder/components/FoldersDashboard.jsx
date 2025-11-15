import React, { useEffect, useState } from "react";
import folderService from "../servises/folderService";
import storageService from "../../../auth/services/storageService";

function FoldersDashboard() {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
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
      const updatedFiles = await folderService.getFilesInFolder(currentFolder.id);
      setCurrentFolder({ ...currentFolder, files: updatedFiles });
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
    setDownloading((prev) => ({ ...prev, [fileId]: true }));
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
      setDownloading((prev) => ({ ...prev, [fileId]: false }));
    }
  };

  if (!currentFolder) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">📁 Folders</h2>

        
        <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
          <input
            type="text"
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <label className="flex items-center gap-2 px-1">
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
            className="px-4 py-2 rounded text-white bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto"
          >
            Create
          </button>
        </div>

        
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="p-4 sm:p-5 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition"
              onClick={() => openFolder(folder)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg truncate">{folder.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    folder.public
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {folder.public ? "Public" : "Private"}
                </span>
              </div>
              <p className="text-gray-500 mt-2">{folder.files.length} files</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  
  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto w-full">
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition w-full sm:w-auto"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">{currentFolder.name}</h2>

      
      <div className="flex flex-col sm:flex-row gap-3 mb-4 w-full">
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleUploadFile}
          disabled={!selectedFile || loadingUpload}
          className={`px-4 py-2 rounded text-white font-medium w-full sm:w-auto ${
            selectedFile && !loadingUpload
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loadingUpload ? "Uploading..." : "Upload"}
        </button>
      </div>

     
      <ul className="bg-white rounded-xl shadow divide-y divide-gray-200 w-full">
        {currentFolder.files.length > 0 ? (
          currentFolder.files.map((file) => (
            <li
              key={file.id}
              className="flex justify-between items-center px-4 py-3 text-sm sm:text-base"
            >
              <span className="truncate max-w-[60%]">{file.fileName}</span>
              <button
                onClick={() => handleDownload(file.id, file.fileName)}
                disabled={downloading[file.id]}
                className="text-cyan-600 hover:underline text-sm font-medium"
              >
                {downloading[file.id] ? "Loading..." : "Download"}
              </button>
            </li>
          ))
        ) : (
          <li className="px-4 py-3 text-gray-400 italic">No files</li>
        )}
      </ul>
    </div>
  );
}

export default FoldersDashboard;
