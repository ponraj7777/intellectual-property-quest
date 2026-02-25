const API_URL = 'http://localhost:5000/api';

const api = {
    async register(name, email, password) {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
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
};

export default api;
