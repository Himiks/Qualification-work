// src/modules/expenses/components/FileUploader.jsx
import React, { useState } from "react";
import expenseService from "../services/expenseService";
import storageService from "../../../auth/services/storageService";

export default function FileUploader({ onUploaded, userIdProp }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const userId = userIdProp || (storageService.getUser ? storageService.getUser()?.id : null);

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first");
    if (!userId) return alert("User ID not found");

    setLoading(true);
    try {
      const result = await expenseService.uploadExpenses(file, userId);
      onUploaded && onUploaded(result);
      setFile(null);
      alert("Upload finished — expenses imported.");
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-3">Upload expenses (Excel)</h3>
      <div className="flex gap-3 items-center">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="block"
        />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        <div className="text-sm text-gray-500">
          {file ? file.name : "Choose .xlsx file with columns: date, category, description, amount"}
        </div>
      </div>
    </div>
  );
}
