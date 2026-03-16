const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? "http://localhost:8080/api"
    : "https://fsad-tpxy.onrender.com/api";

const fetchWithTimeout = async (url, options = {}, timeout = 60000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error("Request timed out. The backend might be cold-starting or not deployed yet.");
        }
        throw error;
    }
};

export const fetchUsers = async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
};

// ── OTP ──────────────────────────────────────────────────────────────────────
export const sendOtp = async (email, name) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(text || "Failed to send OTP");
    return text;
};

export const verifyOtp = async (email, otp) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(text || "OTP verification failed");
    return text;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const signup = async (userData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Signup failed");
    }
    return response.json();
};

export const login = async (credentials) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Login failed");
    }
    return response.json();
};

// ── Password Reset ────────────────────────────────────────────────────────────
export const forgotPassword = async (email) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(text || "Request failed");
    return text;
};

export const resetPassword = async (token, newPassword) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(text || "Reset failed");
    return text;
};

// ── Estimations ───────────────────────────────────────────────────────────────
export const saveEstimation = async (estimationData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/estimations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estimationData),
    });
    if (!response.ok) throw new Error("Failed to save estimation");
    return response.json();
};

export const fetchUserEstimations = async (email) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/estimations/${email}`);
    if (!response.ok) throw new Error("Failed to fetch estimations");
    return response.json();
};

export const createUser = async (user) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
};
