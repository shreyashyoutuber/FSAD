const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? "http://localhost:8080/api"
    : "https://fsad-backend.onrender.com/api"; // Replace with your actual deployed backend URL

export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
};

export const signup = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Signup failed");
    }
    return response.json();
};

export const login = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
    }
    return response.json();
};

export const saveEstimation = async (estimationData) => {
    const response = await fetch(`${API_BASE_URL}/estimations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estimationData),
    });
    if (!response.ok) throw new Error("Failed to save estimation");
    return response.json();
};

export const fetchUserEstimations = async (email) => {
    const response = await fetch(`${API_BASE_URL}/estimations/${email}`);
    if (!response.ok) throw new Error("Failed to fetch estimations");
    return response.json();
};

export const createUser = async (user) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
};
