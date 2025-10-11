const TOKEN = "token";
const USER = "user";

const storageService = {
  saveToken(token) {
    localStorage.removeItem(TOKEN);
    localStorage.setItem(TOKEN, token);
    window.dispatchEvent(new Event("authChange"));
  },

  saveUser(user) {
    localStorage.removeItem(USER);
    localStorage.setItem(USER, JSON.stringify(user));
    window.dispatchEvent(new Event("authChange"));
  },

  getToken() {
    return localStorage.getItem(TOKEN);
  },

  getUser() {
    const user = localStorage.getItem(USER);
    return user ? JSON.parse(user) : null;
  },

  getUserRole() {
    const user = this.getUser();
    return user ? user.role : "";
  },

  isAdminLoggedIn() {
    const token = this.getToken();
    if (!token) return false;
    return this.getUserRole() === "ADMIN";
  },

  isEmployeeLoggedIn() {
    const token = this.getToken();
    if (!token) return false;
    return this.getUserRole() === "EMPLOYEE";
  },

  getUserId() {
    const user = this.getUser();
    return user ? user.id : "";
  },

  logout() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    window.dispatchEvent(new Event("authChange"));
  },
};

export default storageService;