const TOKEN = "token";
const USER = "user";

const storageService = { // Service for managing authentication data in localStorage
  saveToken(token) {
    localStorage.removeItem(TOKEN);
    localStorage.setItem(TOKEN, token);
    window.dispatchEvent(new Event("authChange"));
  },

  saveUser(user) { // user: { id, role }
    localStorage.removeItem(USER);
    localStorage.setItem(USER, JSON.stringify(user));
    window.dispatchEvent(new Event("authChange"));
  },

  getToken() { // Retrieve JWT token from localStorage
    return localStorage.getItem(TOKEN);
  },

  getUser() { // Retrieve user info from localStorage
    const user = localStorage.getItem(USER);
    return user ? JSON.parse(user) : null;
  },

  getUserRole() { // Get the role of the logged-in user
    const user = this.getUser();
    return user ? user.role : "";
  },

  isAdminLoggedIn() { // Check if an admin user is logged in
    const token = this.getToken();
    if (!token) return false;
    return this.getUserRole() === "ADMIN";
  },

  isEmployeeLoggedIn() { // Check if an employee user is logged in
    const token = this.getToken();
    if (!token) return false;
    return this.getUserRole() === "EMPLOYEE";
  },

  getUserId() { // Get the ID of the logged-in user
    const user = this.getUser();
    return user ? user.id : "";
  },

  logout() { // Clear authentication data from localStorage
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    window.dispatchEvent(new Event("authChange"));
  },
};

export default storageService;