import axios from "axios";
import storageService from "../../../auth/services/storageService";

const BASE_URL = "http://localhost:8080/api/expenses";


const authHeaders = () => { // Helper to get auth headers
    const token = storageService.getToken();
    return { Authorization: `Bearer ${token}` };
};


const uploadExpenses = async(file, userId) => { // Upload expenses file
    const form = new FormData();
    form.append("file", file);
    const response = await axios.post(
        `${BASE_URL}/upload/${userId}`,
        form,
        {headers:{...authHeaders(), "Content-Type": "multipart/form-data",},
    }
);
    return response.data;
};


const getAllExpensesByUser = async(userId) => { // Fetch all expenses for a user
    const response = await axios.get(
        `${BASE_URL}/${userId}`, {
            headers: authHeaders(),
        });
    return response.data;
};


const getExpenseByCategory = async(userId, category) => { // Fetch expenses by category
    const response = await axios.get(
        `${BASE_URL}/${userId}/category`, {
            headers: authHeaders(),
            params: { category },
        });
    return response.data;
};



const getExpenseByRange = async(userId, start, end) => { // Fetch expenses by date range
    const response = await axios.get(
        `${BASE_URL}/${userId}/range`, {
            headers: authHeaders(),
            params: { start, end },
        });
    return response.data;
};


const deleteExpense = async (expenseId) => { // Delete an expense by ID
    const response = await axios.delete(`${BASE_URL}/${expenseId}`, {
        headers: authHeaders()
    });
    return response.data;
};


const expenseService = { uploadExpenses, getAllExpensesByUser, getExpenseByCategory, getExpenseByRange, deleteExpense };
export default expenseService;