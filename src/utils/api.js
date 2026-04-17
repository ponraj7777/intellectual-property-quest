const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = {
    async register(name, email, password, dob) {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, dob }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Signup failed');
        return data;
    },

    async login(email, password) {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        return data;
    },

    async getProfile(token) {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
        return data;
    },

    async updateProgress(token, moduleId, levelIndex, difficulty) {
        const response = await fetch(`${API_URL}/users/progress`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ moduleId, levelIndex, difficulty }),
        });
        return await response.json();
    },

    async addXP(token, amount) {
        const response = await fetch(`${API_URL}/users/xp`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount }),
        });
        return await response.json();
    },

    async getLeaderboard() {
        const response = await fetch(`${API_URL}/users/leaderboard`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch leaderboard');
        return data;
    },

    async getUserRank(token) {
        const response = await fetch(`${API_URL}/users/rank`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch rank');
        return data;
    },
    async updateProfile(token, profileData) {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update profile');
        return data;
    },
    async getUsers(token) {
        const response = await fetch(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
        return data;
    },

    async getQuestions(moduleId = null) {
        const url = moduleId ? `${API_URL}/questions/${moduleId}` : `${API_URL}/questions`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch questions');
        return data;
    },

    async createQuestion(token, questionData) {
        const response = await fetch(`${API_URL}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(questionData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create question');
        return data;
    },

    async updateQuestion(token, id, questionData) {
        const response = await fetch(`${API_URL}/questions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(questionData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update question');
        return data;
    },

    async deleteQuestion(token, id) {
        const response = await fetch(`${API_URL}/questions/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete question');
        return data;
    },
};

export default api;
