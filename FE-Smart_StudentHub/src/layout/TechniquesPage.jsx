import React, { useEffect, useState } from "react";
import { getAllTechniques, updateTechnique } from "../modules/technique/services/techniqueService";
import storageService from "../auth/services/storageService";

function TechniquesPage() {
  const [techniques, setTechniques] = useState([]); // List of techniques
  const [form, setForm] = useState({ description: "", steps: "" }); // Form state
  const [editingId, setEditingId] = useState(null); // Currently editing technique ID
  const [loading, setLoading] = useState(true); // Loading state

  const isAdmin = storageService.getUserRole() === "ADMIN"; // Check if user is admin

  const loadTechniques = async () => { // Load all techniques
    try {
      const data = await getAllTechniques(); // Fetch techniques
      setTechniques(data); // Set techniques state
    } catch (err) {
      console.error("Error loading techniques:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { // Initial load
    loadTechniques(); // Load techniques on mount
  }, []);

  const formatTechniqueName = (name) => { // Format technique name
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleEdit = (technique) => { // Start editing a technique
    setEditingId(technique.id); // Set editing ID
    setForm({
      description: technique.description || "",
      steps: technique.steps || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => { // Handle form submission
  e.preventDefault();
  try {
    const currentTechnique = techniques.find((t) => t.id === editingId); // Find current technique
    if (!currentTechnique) return;

    const dtoToSend = { // Prepare DTO
      name: currentTechnique.name,
      description: form.description,
      steps: form.steps,
    };

    await updateTechnique(editingId, dtoToSend); // Call update service
    setEditingId(null); // Clear editing ID
    setForm({ description: "", steps: "" }); // Reset form
    loadTechniques();
  } catch (err) {
    console.error("Error updating technique:", err);
  }
};

  const handleCancel = () => { // Cancel editing
    setEditingId(null);
    setForm({ description: "", steps: "" });
  };

  if (loading) { // Show loading state
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-xl">
        Loading techniques...
      </div>
    );
  }

{/* Main render */}
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        <i className="fa-solid fa-brain text-blue-500 mr-2"></i>
        Task Techniques
      </h1>

      {isAdmin && editingId && (
        <form
          onSubmit={handleSubmit} // Edit technique form
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-10"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
             <i className="fa-solid fa-pen-to-square text-xl"></i> Edit Technique
          </h2>

          <input
            className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700 mb-4"
            value={formatTechniqueName(
              techniques.find((t) => t.id === editingId)?.name // Technique name
            )}
            disabled
          />

          <textarea
            className="w-full border p-3 rounded-lg mb-4"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value }) // Update description
            }
            required
          />

          <textarea
            className="w-full border p-3 rounded-lg mb-4"
            placeholder="Steps (e.g. 1. Step one 2. Step two)"
            value={form.steps}
            onChange={(e) => setForm({ ...form, steps: e.target.value })} // Update steps
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleCancel} // Cancel editing
              className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {techniques.map((t) => {
          const stepsArray = t.steps
            ? t.steps.split(/\d+\.\s/).filter(Boolean) // Split steps into array
            : [];

          return ( // Technique card
            <div
              key={t.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all relative"
            >
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-blue-600 hover:text-blue-800 hover:scale-110 transition"
                    title="Edit Technique"
                  >
                    <i className="fa-solid fa-pen-to-square text-xl"></i>
                  </button>
                </div>
              )}

              <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                {formatTechniqueName(t.name)} {/* Technique name */}
              </h2>

              <p className="text-gray-600 mb-3">{t.description}</p>

              {stepsArray.length > 0 && (
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  {stepsArray.map((step, i) => ( // Technique steps
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TechniquesPage;
