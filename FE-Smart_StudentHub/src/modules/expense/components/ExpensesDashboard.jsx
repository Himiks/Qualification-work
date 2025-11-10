// src/modules/expenses/pages/ExpensesDashboard.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import expenseService from "../services/expenseService";
import FileUploader from "../components/FileUploader";
import { format } from "date-fns";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import storageService from "../../../auth/services/storageService";

const COLORS = ["#4f46e5", "#ef4444", "#f59e0b", "#10b981", "#6366f1", "#a78bfa"];

function formatAmount(n) {
  if (!n && n !== 0) return "0.00";
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ExpensesDashboard({ userIdProp }) {
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState({ key: "date", dir: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const containerRef = useRef(null);

  const userId = userIdProp || (storageService.getUser ? storageService.getUser()?.id : null);

  useEffect(() => {
    if (!userId) return;
    fetchAll();
  }, [userId]);

  const fetchAll = async () => {
    try {
      const data = await expenseService.getAllExpensesByUser(userId);
      const normalized = data.map((e) => ({
        ...e,
        date: e.date ? new Date(e.date) : null,
      }));
      setExpenses(normalized);
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setExpenses([]);
    }
  };

  useEffect(() => {
    let list = [...expenses];

    if (categoryFilter !== "All") {
      list = list.filter((e) => (e.category || "").toLowerCase() === categoryFilter.toLowerCase());
    }

    if (monthFilter !== "All") {
      list = list.filter((e) => {
        if (!e.date) return false;
        const d = new Date(e.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return key === monthFilter;
      });
    }

    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((e) =>
        (e.description || "").toLowerCase().includes(s)
        || (e.category || "").toLowerCase().includes(s)
        || (e.amount + "").includes(s)
      );
    }

    list.sort((a, b) => {
      const key = sortBy.key;
      const dir = sortBy.dir === "asc" ? 1 : -1;
      if (key === "date") {
        const da = a.date ? new Date(a.date) : 0;
        const db = b.date ? new Date(b.date) : 0;
        return (da - db) * dir;
      }
      if (key === "amount") {
        return (Number(a.amount || 0) - Number(b.amount || 0)) * dir;
      }
      return 0;
    });

    setFiltered(list);
    setCurrentPage(1); // сброс на первую страницу при фильтре/поиске
  }, [expenses, categoryFilter, monthFilter, search, sortBy]);

  // --- Пагинация ---
  const paginatedFiltered = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  const stats = useMemo(() => {
    const total = filtered.reduce((s, e) => s + Number(e.amount || 0), 0);
    const avg = filtered.length ? total / filtered.length : 0;
    const byCat = {};
    for (const e of filtered) {
      const c = e.category || "Uncategorized";
      byCat[c] = (byCat[c] || 0) + Number(e.amount || 0);
    }
    const topCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    return {
      total,
      avg,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      byCategory: Object.entries(byCat).map(([name, amount]) => ({ name, amount })),
    };
  }, [filtered]);

  const lineData = useMemo(() => {
    const map = {};
    for (const e of filtered) {
      if (!e.date) continue;
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + Number(e.amount || 0);
    }
    return Object.entries(map)
      .sort()
      .map(([month, amount]) => ({ month, amount }));
  }, [filtered]);

  const categories = useMemo(() => {
    const set = new Set(expenses.map((e) => (e.category || "Uncategorized")));
    return ["All", ...Array.from(set)];
  }, [expenses]);

  const months = useMemo(() => {
    const set = new Set(expenses.map((e) => {
      if (!e.date) return null;
      const d = new Date(e.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }).filter(Boolean));
    return ["All", ...Array.from(set).sort().reverse()];
  }, [expenses]);

  const handleUploadComplete = () => {
    fetchAll();
  };

  const exportPDF = async () => {
    const element = containerRef.current;
    if (!element) return alert("No content");

    try {
      const dataUrl = await htmlToImage.toPng(element, { cacheBust: true });
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("expenses-report.pdf");
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export PDF: " + err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <FileUploader onUploaded={handleUploadComplete} userIdProp={userId} />

      <div ref={containerRef} className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Expenses</h2>
          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description/category/amount"
              className="border p-2 rounded"
            />
            <button onClick={exportPDF} className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700">
              Export PDF
            </button>
          </div>
        </div>

    
        <div className="flex gap-4 mb-4 flex-wrap">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border p-2 rounded">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="border p-2 rounded">
            {months.map((m) => <option key={m} value={m}>{m === "All" ? "All months" : m}</option>)}
          </select>

          <select value={sortBy.key + "_" + sortBy.dir} onChange={(e) => {
            const [k, d] = e.target.value.split("_");
            setSortBy({ key: k, dir: d });
          }} className="border p-2 rounded">
            <option value="date_desc">Date ↓</option>
            <option value="date_asc">Date ↑</option>
            <option value="amount_desc">Amount ↓</option>
            <option value="amount_asc">Amount ↑</option>
          </select>
        </div>

        {/* Stats + Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 border rounded">
            <h4 className="font-medium text-gray-600">Total</h4>
            <div className="text-2xl font-bold">{formatAmount(stats.total)}</div>
            <div className="text-sm text-gray-500">Avg: {formatAmount(stats.avg)}</div>
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-medium text-gray-600">Top category</h4>
            {stats.topCategory ? (
              <>
                <div className="text-lg font-semibold">{stats.topCategory.name}</div>
                <div className="text-sm text-gray-500">{formatAmount(stats.topCategory.amount)}</div>
              </>
            ) : <div className="text-sm text-gray-500">—</div>}
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-medium text-gray-600">Trend (month)</h4>
            <div style={{ width: "100%", height: 120 }}>
              <LineChart width={300} height={120} data={lineData}>
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border rounded">
            <h4 className="font-medium mb-2">By Category</h4>
            <div style={{ width: "100%", height: 240 }}>
              <PieChart width={550} height={300}>
                <Pie
                  data={stats.byCategory}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percent, name }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stats.byCategory.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => formatAmount(value)} />
                <Legend />
              </PieChart>
            </div>
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-medium mb-2">Expense list</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-600 bg-gray-50 border-b">
                    <tr>
                        <th className="py-3 px-2 font-medium">Date</th>
                        <th className="py-3 px-2 font-medium">Category</th>
                        <th className="py-3 px-2 font-medium">Description</th>
                        <th className="py-3 px-2 text-right font-medium">Amount</th>
                        <th className="py-3 px-2 text-center font-medium">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedFiltered.map((e) => (
                    <motion.tr
                    key={e.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="border-b hover:bg-gray-50 transition-colors"
                    >
                    <td className="py-2">{e.date ? format(new Date(e.date), "yyyy-MM-dd") : "—"}</td>
                    <td className="py-2">{e.category || "—"}</td>
                    <td className="py-2">{e.description || "—"}</td>
                    <td className="py-2 text-right font-medium">{formatAmount(e.amount)}</td>
                    <td className="py-2 text-center">
                        <button
                        onClick={async () => {
                            if (!confirm("Are you sure you want to delete this expense?")) return;
                            try {
                            await expenseService.deleteExpense(e.id);
                            setExpenses((prev) => prev.filter((exp) => exp.id !== e.id));
                            } catch (err) {
                            console.error(err);
                            alert("Failed to delete expense");
                            }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors duration-200 mx-auto"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        <span>Delete</span>
                        </button>
                    </td>
                    </motion.tr>
                ))}
            </tbody>

              </table>
            </div>

           
            {filtered.length > itemsPerPage && (
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="border px-2 py-1 rounded">Prev</button>
                <span className="px-2 py-1">{currentPage} / {Math.ceil(filtered.length / itemsPerPage)}</span>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filtered.length / itemsPerPage)))} disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)} className="border px-2 py-1 rounded">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
