const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? "http://localhost:8080/api"
    : "https://fsad-tpxy.onrender.com/api";

export const warmUpBackend = () => {
    // Just a simple ping to wake up the Render server
    fetch(`${API_BASE_URL}/users`).catch(() => {});
};

const fetchWithTimeout = async (url, options = {}, timeout = 60000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    // Add JWT Token to headers if present
    const token = localStorage.getItem("token");
    const headers = {
        ...options.headers,
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };

    try {
        const response = await fetch(url, { 
            ...options, 
            headers,
            signal: controller.signal 
        });
        clearTimeout(id);
        
        // Handle unauthorized (expired token)
        if (response.status === 401 && !url.includes("/auth/login")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        
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
    const clone = response.clone();
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to send OTP");
        } catch (e) {
            const text = await clone.text();
            throw new Error(text || "Failed to send OTP");
        }
    }
    return response.text();
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
    
    const clone = response.clone();
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || "Signup failed");
        } catch (e) {
            const text = await clone.text();
            throw new Error(text || "Signup failed");
        }
    }

    const data = await response.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        // Map top-level UserResponse fields to a user object for frontend compatibility
        const user = { 
            id: data.id, 
            name: data.name, 
            email: data.email, 
            phone: data.phone 
        };
        localStorage.setItem("user", JSON.stringify(user));
    }
    return data;
};

export const login = async (credentials) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    const clone = response.clone();
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        } catch (e) {
            const text = await clone.text();
            throw new Error(text || "Login failed");
        }
    }

    const data = await response.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        // Map top-level UserResponse fields to a user object for frontend compatibility
        const user = { 
            id: data.id, 
            name: data.name, 
            email: data.email, 
            phone: data.phone 
        };
        localStorage.setItem("user", JSON.stringify(user));
    }
    return data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
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

export const getCurrentUser = async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/users/me`);
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
};

export const updateProfile = async (userData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    const clone = response.clone();
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update profile");
        } catch (e) {
            const text = await clone.text();
            throw new Error(text || "Failed to update profile");
        }
    }
    const data = await response.json();
    // Update local storage with new user data
    localStorage.setItem("user", JSON.stringify(data));
    return data;
};

export const clearDatabaseData = async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/clear-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    const clone = response.clone();
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to clear database");
        } catch (e) {
            const text = await clone.text();
            throw new Error(text || "Failed to clear database");
        }
    }
    return response.text();
};
