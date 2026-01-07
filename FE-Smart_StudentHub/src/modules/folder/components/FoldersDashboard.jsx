import React, { useEffect, useState } from "react";
import folderService from "../servises/folderService";
import storageService from "../../../auth/services/storageService";
import { toast } from "react-toastify";

function FoldersDashboard() {
  const [folders, setFolders] = useState([]); // All folders state
  const [currentFolder, setCurrentFolder] = useState(null); // Currently opened folder
  const [newFolderName, setNewFolderName] = useState(""); // New folder name input state
  const [isPublic, setIsPublic] = useState(false); // New folder public/private state
  const [selectedFile, setSelectedFile] = useState(null); // Selected file for upload
  const [loadingUpload, setLoadingUpload] = useState(false); // File upload loading state
  const [downloading, setDownloading] = useState({}); // File download state
  const [isAdmin, setIsAdmin] = useState(false); // Admin user state

  const userId = storageService.getUserId(); // Get current user ID

  useEffect(() => { // Fetch folders on component mount
    fetchFolders();
  }, []);

  const fetchFolders = async () => { // Fetch folders based on user role
    try {
      const admin = storageService.isAdminLoggedIn(); // Check if admin
      setIsAdmin(admin);
      let foldersData = []; // Folders data variable
      if (admin) {
        foldersData = await folderService.getAllFolders(); // Fetch all folders for admin
      } else {
        const [userFolders, publicFolders] = await Promise.all([ // Fetch user and public folders
          folderService.getUserFolders(userId),
          folderService.getPublicFolders(),
        ]);
        foldersData = [ // Combine user and public folders
          ...userFolders,
          ...publicFolders.filter((f) => f.userId !== userId),
        ];
      }
      setFolders(foldersData); // Set folders state
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch folders");
    }
  };

  const canEditFile = () => { // Check if user can edit files
  return isAdmin || currentFolder?.userId === userId;
};

  const handleCreateFolder = async () => { // Create new folder handler
    if (!newFolderName) return toast.error("Folder name required");
    try {
      const folderDTO = { name: newFolderName, public: isPublic, userId };
      const newFolder = await folderService.createFolder(folderDTO);
      setFolders((prev) => [...prev, { ...newFolder, files: [] }]); // Update folders state
      setNewFolderName(""); // Clear input
      setIsPublic(false); // Reset public checkbox
    } catch (err) {
      console.error(err);
      toast.error("Failed to create folder");
    }
  };

  const openFolder = (folder) => setCurrentFolder(folder); // Open folder handler
  const goBack = () => setCurrentFolder(null); // Go back to folders list

  const handleRenameFolder = async (folder) => {
    const newName = prompt("Enter new folder name:", folder.name); // Prompt for new name
    if (!newName || newName === folder.name) return; // No change
    try {
      const updated = await folderService.updateFolder(folder.id, { //  Rename folder API call
        ...folder,
        name: newName,
      });
      setFolders((prev) => // Update folders state
        prev.map((f) => (f.id === folder.id ? updated : f)) // Update specific folder
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename folder");
    }
  };

  const handleDeleteFolder = async (folderId) => { // Delete folder handler
    if (!window.confirm("Are you sure you want to delete this folder?")) return;
    try {
      await folderService.deleteFolder(folderId);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete folder");
    }
  };

  const handleRenameFile = async (file) => { // Rename file handler
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

  const handleDeleteFile = async (fileId) => { // Delete file handler
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await folderService.deleteFile(fileId); // API call to delete file
      setCurrentFolder((prev) => ({ // Update current folder state
        ...prev,
        files: prev.files.filter((f) => f.id !== fileId), // Remove deleted file
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file");
    }
  };

  const handleUploadFile = async () => { // Upload file handler
    if (!selectedFile) return toast.error("Select a file first");
    try {
      setLoadingUpload(true);
      await folderService.uploadFile(currentFolder.id, selectedFile); // API call to upload file
      const updatedFiles = await folderService.getFilesInFolder(currentFolder.id); // Fetch updated files
      setCurrentFolder({ ...currentFolder, files: updatedFiles }); // Update current folder state
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDownload = async (fileId, fileName) => { // Download file handler
    setDownloading((prev) => ({ ...prev, [fileId]: true })); // Set downloading state
    try {
      const response = await folderService.downloadFile(fileId); // API call to download file
      const url = window.URL.createObjectURL(new Blob([response])); // Create blob URL
      const link = document.createElement("a"); // Create download link
      link.href = url; // Set link href
      link.setAttribute("download", fileName); // Set download attribute
      document.body.appendChild(link); // Append link to body
      link.click(); // Trigger download
      link.remove(); // Clean up link
    } catch (err) {
      console.error(err);
      toast.error("Failed to download file");
    } finally {
      setDownloading((prev) => ({ ...prev, [fileId]: false }));
    }
  };


  // Render folders list or current folder view
  if (!currentFolder) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Folders</h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
          <input
            type="text"
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)} // Handle input change
            className="border border-gray-300 rounded-lg p-3 w-full sm:w-64 focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-sm transition"
          />
          <label className="flex items-center gap-2 px-1 text-gray-700 font-medium">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)} // Toggle public/private
              className="accent-cyan-500"
            />
            Public
          </label>
          <button
            onClick={handleCreateFolder} // Create folder handler
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition transform"
          >
            <i className="fa-solid fa-folder-plus"></i> Create Folder
          </button>
        </div>

        {folders.length === 0 ? ( // No folders message
          <p className="text-gray-500 text-center mt-10">No folders found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => ( // Folder cards
              <div
                key={folder.id}
                className="relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl shadow-md hover:shadow-xl transition transform hover:scale-105 cursor-pointer flex flex-col justify-between"
                onClick={() => openFolder(folder)} // Open folder on click
              >
                {(folder.userId === userId || isAdmin) && ( // Show edit/delete for owner or admin
                  <div className="absolute top-4 right-4 flex gap-3">
                    <button
                      onClick={(e) => { // Rename folder handler
                        e.stopPropagation(); // Prevent card click
                        handleRenameFolder(folder); // Rename folder
                      }}
                      className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                      title="Rename"
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button
                      onClick={(e) => { // Delete folder handler
                        e.stopPropagation(); // Prevent card click
                        handleDeleteFolder(folder.id); // Delete folder
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
        onClick={goBack} // Go back handler
        className="mb-6 px-5 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 font-semibold flex items-center gap-2 shadow transition transform hover:scale-105"
      >
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">{currentFolder.name}</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])} // Handle file selection
          className="border rounded-lg p-3 w-full sm:w-auto focus:ring-2 focus:ring-cyan-400 shadow-sm transition"
        />
        <button
          onClick={handleUploadFile} // Upload file handler
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
        {currentFolder.files.length === 0 ? ( // No files message
          <li className="p-6 bg-gray-100 rounded-2xl text-gray-500 font-medium text-center">No files</li>
        ) : (
          currentFolder.files.map((file) => ( // File items
            <li
              key={file.id}
              className="bg-white rounded-2xl shadow p-5 flex justify-between items-center transition transform hover:shadow-xl hover:scale-105"
            >
              <span className="truncate max-w-[60%] font-medium text-gray-800">{file.fileName}</span>
             <div className="flex gap-3 items-center">
                {canEditFile() && ( // Show edit/delete if user can edit
                  <>
                    <button
                      onClick={() => handleRenameFile(file)} // Rename file handler
                      className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                      title="Rename"
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>

                    <button
                      onClick={() => handleDeleteFile(file.id)} // Delete file handler
                      className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                      title="Delete"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleDownload(file.id, file.fileName)} // Download file handler
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
