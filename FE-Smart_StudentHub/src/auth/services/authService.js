import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

const signup = async (signupData) => { // signupData: { name, email, password }
  const response = await axios.post(`${BASE_URL}/signup`, signupData);
  return response.data;
};

const login = async (loginData) => { // loginData: { email, password }
  const response = await axios.post(`${BASE_URL}/login`, loginData);
  return response.data;
};

const authService = { signup, login };
export default authService;
