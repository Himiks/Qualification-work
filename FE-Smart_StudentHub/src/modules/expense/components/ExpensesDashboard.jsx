import React, { useEffect, useMemo, useState, useRef } from "react";
import expenseService from "../services/expenseService";
import FileUploader from "../components/FileUploader";
import { format } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import storageService from "../../../auth/services/storageService";

const COLORS = ["#4f46e5", "#ef4444", "#f59e0b", "#10b981", "#6366f1", "#a78bfa"];

function formatAmount(n) {
  if (!n && n !== 0) return "0.00";
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
  const userId =
    userIdProp || (storageService.getUser ? storageService.getUser()?.id : null);

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
      list = list.filter(
        (e) =>
          (e.category || "").toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    
    if (monthFilter !== "All") {
      list = list.filter((e) => {
        if (!e.date) return false;
        const d = new Date(e.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        return key === monthFilter;
      });
    }

    
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          (e.description || "").toLowerCase().includes(s) ||
          (e.category || "").toLowerCase().includes(s) ||
          (e.amount + "").includes(s)
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
    setCurrentPage(1);
  }, [expenses, categoryFilter, monthFilter, search, sortBy]);


  const paginatedFiltered = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
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
      topCategory: topCategory
        ? { name: topCategory[0], amount: topCategory[1] }
        : null,
      byCategory: Object.entries(byCat).map(([name, amount]) => ({
        name,
        amount,
      })),
    };
  }, [filtered]);

  const lineData = useMemo(() => {
    const map = {};
    for (const e of filtered) {
      if (!e.date) continue;
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      map[key] = (map[key] || 0) + Number(e.amount || 0);
    }
    return Object.entries(map)
      .sort()
      .map(([month, amount]) => ({ month, amount }));
  }, [filtered]);

  const categories = useMemo(() => {
    const set = new Set(
      expenses.map((e) => e.category || "Uncategorized")
    );
    return ["All", ...set];
  }, [expenses]);

  const months = useMemo(() => {
    const set = new Set(
      expenses
        .map((e) => {
          if (!e.date) return null;
          const d = new Date(e.date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
        })
        .filter(Boolean)
    );
    return ["All", ...Array.from(set).sort().reverse()];
  }, [expenses]);

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
      alert("Export failed");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <FileUploader onUploaded={fetchAll} userIdProp={userId} />

      <div ref={containerRef} className="bg-white p-4 sm:p-6 rounded-lg shadow">

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Expenses</h2>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="border p-2 rounded w-full"
            />
            <button
              onClick={exportPDF}
              className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 whitespace-nowrap"
            >
              Export PDF
            </button>
          </div>
        </div>

       
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m === "All" ? "All months" : m}
              </option>
            ))}
          </select>

          <select
            value={sortBy.key + "_" + sortBy.dir}
            onChange={(e) => {
              const [k, d] = e.target.value.split("_");
              setSortBy({ key: k, dir: d });
            }}
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option value="date_desc">Date ↓</option>
            <option value="date_asc">Date ↑</option>
            <option value="amount_desc">Amount ↓</option>
            <option value="amount_asc">Amount ↑</option>
          </select>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded">
            <h4 className="text-gray-600 text-sm">Total</h4>
            <div className="text-2xl font-bold">{formatAmount(stats.total)}</div>
          </div>

          <div className="p-4 border rounded">
            <h4 className="text-gray-600 text-sm">Top category</h4>
            {stats.topCategory ? (
              <>
                <div className="font-semibold">{stats.topCategory.name}</div>
                <div className="text-gray-500 text-sm">
                  {formatAmount(stats.topCategory.amount)}
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-sm">—</div>
            )}
          </div>

          <div className="p-4 border rounded">
            <h4 className="text-gray-600 text-sm">Trend</h4>

            <div className="w-full h-24">
              <ResponsiveContainer>
                <LineChart data={lineData}>
                  <XAxis dataKey="month" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#4f46e5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        
          <div className="p-4 border rounded">
            <h4 className="text-gray-700 font-medium mb-2">By Category</h4>

            <div className="w-full h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={stats.byCategory}
                    dataKey="amount"
                    nameKey="name"
                    outerRadius="60%"
                    label={({ percent, name }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {stats.byCategory.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip formatter={(v) => formatAmount(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

         
          <div className="p-4 border rounded">
            <h4 className="text-gray-700 font-medium mb-2">Expense list</h4>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-gray-600">
                    <th className="py-2 px-2">Date</th>
                    <th className="py-2 px-2">Category</th>
                    <th className="py-2 px-2">Description</th>
                    <th className="py-2 px-2 text-right">Amount</th>
                    <th className="py-2 px-2 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedFiltered.map((e) => (
                    <motion.tr
                      key={e.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b"
                    >
                      <td className="py-2">
                        {e.date ? format(new Date(e.date), "yyyy-MM-dd") : "—"}
                      </td>

                      <td className="py-2">{e.category || "—"}</td>
                      <td className="py-2">{e.description || "—"}</td>

                      <td className="py-2 text-right font-semibold">
                        {formatAmount(e.amount)}
                      </td>

                      <td className="py-2 text-center">
                        <button
                          onClick={async () => {
                            if (!confirm("Delete?")) return;
                            await expenseService.deleteExpense(e.id);
                            setExpenses((p) => p.filter((x) => x.id !== e.id));
                          }}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            
            {filtered.length > itemsPerPage && (
              <div className="flex justify-end gap-3 mt-3 text-sm">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="border px-3 py-1 rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="px-3 py-1">
                  {currentPage} / {Math.ceil(filtered.length / itemsPerPage)}
                </span>

                <button
                  disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="border px-3 py-1 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
