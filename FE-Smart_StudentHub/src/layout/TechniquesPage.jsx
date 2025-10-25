import React, { useEffect, useState } from "react";
import { getAllTechniques } from "../modules/technique/services/techniqueService";

function TechniquesPage() {
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        const data = await getAllTechniques();
        setTechniques(data);
      } catch (error) {
        console.error("Error loading techniques:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTechniques();
  }, []);

  const formatTechniqueName = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-xl">
        Loading techniques...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        ⚙️ Task Techniques
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {techniques.map((t) => {
          const stepsArray = t.steps
            ? t.steps.split(/\d+\.\s/).filter(Boolean)
            : [];

          return (
            <div
              key={t.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                {formatTechniqueName(t.name)}
              </h2>
              <p className="text-gray-600 mb-3">{t.description}</p>
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {stepsArray.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TechniquesPage;
