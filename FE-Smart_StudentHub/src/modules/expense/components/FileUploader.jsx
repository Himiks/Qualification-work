import React, { useState } from "react";
import expenseService from "../services/expenseService";
import storageService from "../../../auth/services/storageService";
import { toast } from "react-toastify";

export default function FileUploader({ onUploaded, userIdProp }) { // FileUploader component
  const [file, setFile] = useState(null); // Selected file state
  const [loading, setLoading] = useState(false); // Loading state

  // Determine user ID
  const userId =
    userIdProp || (storageService.getUser ? storageService.getUser()?.id : null);

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => { // Handle file upload
    if (!file) return toast.error("Choose a file first");
    if (!userId) return toast.error("User ID not found");

    setLoading(true);
    try {
      const result = await expenseService.uploadExpenses(file, userId); // API call to upload expenses
      onUploaded && onUploaded(result); // Callback after upload
      setFile(null); // Reset file input
      toast.success("Upload finished — expenses imported.");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed: " + (err?.response?.data?.message || err.message)); // Error handling
    } finally {
      setLoading(false);
    }
  };

  // Render the file uploader UI
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-3 text-center sm:text-left">
        Upload expenses (Excel)
      </h3>

      
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full">

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile} // Handle file selection
          className="block w-full text-sm"
        />

        <button
          onClick={handleUpload} // Handle upload button click
          disabled={!file || loading} // Disable button if no file or loading
          className={`w-full sm:w-auto px-4 py-2 rounded-md text-white text-sm font-medium 
            ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

     
      <div className="mt-3 text-xs sm:text-sm text-gray-500 break-words text-center sm:text-left">
        {file
          ? file.name
          : "Choose .xlsx file with columns: date, category, description, amount"}
      </div>
    </div>
  );
}
