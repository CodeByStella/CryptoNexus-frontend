const API_BASE_URL = "http://localhost:5000"; 

const authService = {
  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },

  getToken: () => localStorage.getItem("token"),

  removeToken: () => {
    localStorage.removeItem("token");
  },

  register: async (userData: { phone: string; email: string; password: string; referralCode: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data; 
  },

  login: async (credentials: { phone?: string; email?: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
  
    authService.setToken(data.token);
    return data;
  },
  

  getProfile: async () => {
    const token = authService.getToken();
    if (!token) throw new Error("No token available");

    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch profile");

    return response.json();
  },

  logout: () => {
    authService.removeToken();
  },

  isAdmin: async () => {
    const profile = await authService.getProfile();
    return profile.role === "admin";
  },
};

export default authService;
