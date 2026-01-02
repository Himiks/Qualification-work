import React, { useEffect, useState } from "react";
import folderService from "../servises/folderService";
import storageService from "../../../auth/services/storageService";
import { toast } from "react-toastify";

function FoldersDashboard() {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [downloading, setDownloading] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const userId = storageService.getUserId();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const admin = storageService.isAdminLoggedIn();
      setIsAdmin(admin);
      let foldersData = [];
      if (admin) {
        foldersData = await folderService.getAllFolders();
      } else {
        const [userFolders, publicFolders] = await Promise.all([
          folderService.getUserFolders(userId),
          folderService.getPublicFolders(),
        ]);
        foldersData = [
          ...userFolders,
          ...publicFolders.filter((f) => f.userId !== userId),
        ];
      }
      setFolders(foldersData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch folders");
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return toast.error("Folder name required");
    try {
      const folderDTO = { name: newFolderName, public: isPublic, userId };
      const newFolder = await folderService.createFolder(folderDTO);
      setFolders((prev) => [...prev, { ...newFolder, files: [] }]);
      setNewFolderName("");
      setIsPublic(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create folder");
    }
  };

  const openFolder = (folder) => setCurrentFolder(folder);
  const goBack = () => setCurrentFolder(null);

  const handleRenameFolder = async (folder) => {
    const newName = prompt("Enter new folder name:", folder.name);
    if (!newName || newName === folder.name) return;
    try {
      const updated = await folderService.updateFolder(folder.id, {
        ...folder,
        name: newName,
      });
      setFolders((prev) =>
        prev.map((f) => (f.id === folder.id ? updated : f))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename folder");
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;
    try {
      await folderService.deleteFolder(folderId);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete folder");
    }
  };

  const handleRenameFile = async (file) => {
    const newName = prompt("Enter new file name:", file.fileName);
    if (!newName || newName === file.fileName) return;
    try {
      const updated = await folderService.renameFile(file.id, newName);
      setCurrentFolder((prev) => ({
        ...prev,
        files: prev.files.map((f) => (f.id === file.id ? updated : f)),
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename file");
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await folderService.deleteFile(fileId);
      setCurrentFolder((prev) => ({
        ...prev,
        files: prev.files.filter((f) => f.id !== fileId),
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file");
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return toast.error("Select a file first");
    try {
      setLoadingUpload(true);
      await folderService.uploadFile(currentFolder.id, selectedFile);
      const updatedFiles = await folderService.getFilesInFolder(currentFolder.id);
      setCurrentFolder({ ...currentFolder, files: updatedFiles });
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    setDownloading((prev) => ({ ...prev, [fileId]: true }));
    try {
      const response = await folderService.downloadFile(fileId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      toast.error("Failed to download file");
    } finally {
      setDownloading((prev) => ({ ...prev, [fileId]: false }));
    }
  };


  if (!currentFolder) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Folders</h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
          <input
            type="text"
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full sm:w-64 focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-sm transition"
          />
          <label className="flex items-center gap-2 px-1 text-gray-700 font-medium">
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
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition transform"
          >
            <i className="fa-solid fa-folder-plus"></i> Create Folder
          </button>
        </div>

        {folders.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No folders found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl shadow-md hover:shadow-xl transition transform hover:scale-105 cursor-pointer flex flex-col justify-between"
                onClick={() => openFolder(folder)}
              >
                {(folder.userId === userId || isAdmin) && (
                  <div className="absolute top-4 right-4 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameFolder(folder);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                      title="Rename"
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                      title="Delete"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-800 truncate mb-2">{folder.name}</h3>
                  <p className="text-gray-600 font-medium mb-3">{folder.files.length} files</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      folder.public
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {folder.public ? "Public" : "Private"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={goBack}
        className="mb-6 px-5 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 font-semibold flex items-center gap-2 shadow transition transform hover:scale-105"
      >
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">{currentFolder.name}</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="border rounded-lg p-3 w-full sm:w-auto focus:ring-2 focus:ring-cyan-400 shadow-sm transition"
        />
        <button
          onClick={handleUploadFile}
          disabled={!selectedFile || loadingUpload}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-white shadow-lg transition transform ${
            selectedFile && !loadingUpload
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <i className="fa-solid fa-upload"></i> {loadingUpload ? "Uploading..." : "Upload File"}
        </button>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentFolder.files.length === 0 ? (
          <li className="p-6 bg-gray-100 rounded-2xl text-gray-500 font-medium text-center">No files</li>
        ) : (
          currentFolder.files.map((file) => (
            <li
              key={file.id}
              className="bg-white rounded-2xl shadow p-5 flex justify-between items-center transition transform hover:shadow-xl hover:scale-105"
            >
              <span className="truncate max-w-[60%] font-medium text-gray-800">{file.fileName}</span>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => handleRenameFile(file)}
                  className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                  title="Rename"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                  title="Delete"
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
                <button
                  onClick={() => handleDownload(file.id, file.fileName)}
                  disabled={downloading[file.id]}
                  className="text-cyan-600 hover:underline flex items-center gap-1"
                >
                  <i className="fa-solid fa-download"></i>{" "}
                  {downloading[file.id] ? "Loading..." : "Download"}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default FoldersDashboard;
