import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, Award, Search, ArrowRight, Edit, Trash2, Eye, UserPlus, X, Shield, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';
import { useGame } from '../hooks/useGame';

const AdminDashboard = () => {
    const { user: authUser, loading: gameLoading } = useGame();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'user', xp: 0, level: 1
    });
    const [formLoading, setFormLoading] = useState(false);

    const fetchUsers = async () => {
        if (gameLoading) return;

        if (!authUser || !authUser.token || !authUser.isAdmin) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users', {
                headers: {
                    Authorization: `Bearer ${authUser.token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                toast.error('Failed to fetch users');
                if (response.status === 401) navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [navigate, authUser, gameLoading]);

    const handleAddClick = () => {
        setFormData({ name: '', email: '', password: '', role: 'user', xp: 0, level: 1 });
        setIsAddModalOpen(true);
    };

    const handleEditClick = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            role: user.isAdmin ? 'admin' : 'user',
            xp: user.xp || 0,
            level: user.level || 1,
            password: ''
        });
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleViewClick = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const requestBody = { ...formData, isAdmin: formData.role === 'admin' };
            requestBody.dob = '2000-01-01'; // Default
            
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                toast.success('User added successfully');
                setIsAddModalOpen(false);
                fetchUsers();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to add user');
            }
        } catch (error) {
            toast.error('Error adding user');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const updatePayload = {
                name: formData.name,
                email: formData.email,
                isAdmin: formData.role === 'admin',
                xp: formData.xp,
                level: formData.level
            };
            if (formData.password) {
                updatePayload.password = formData.password;
            }

            const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify(updatePayload),
            });

            if (response.ok) {
                toast.success('User updated successfully');
                setIsEditModalOpen(false);
                fetchUsers();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to update user');
            }
        } catch (error) {
            toast.error('Error updating user');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteSubmit = async () => {
        setFormLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authUser.token}`,
                },
            });

            if (response.ok) {
                toast.success('User deleted successfully');
                setIsDeleteModalOpen(false);
                fetchUsers();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to delete user');
            }
        } catch (error) {
            toast.error('Error deleting user');
        } finally {
            setFormLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        user._id !== authUser._id
    );

    const usersWithoutMe = users.filter(user => user._id !== authUser._id);
    const stats = [
        { label: 'Total Users', value: usersWithoutMe.length, icon: Users, color: 'text-blue-500' },
        { label: 'Total XP', value: usersWithoutMe.reduce((acc, u) => acc + (u.xp || 0), 0).toLocaleString(), icon: TrendingUp, color: 'text-green-500' },
        { label: 'Avg. Level', value: usersWithoutMe.length ? (usersWithoutMe.reduce((acc, u) => acc + (u.level || 1), 0) / usersWithoutMe.length).toFixed(1) : 0, icon: Award, color: 'text-purple-500' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quest-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 min-h-screen relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-quest-text mb-2">Admin Dashboard</h1>
                    <p className="text-quest-muted">Monitor user progress and manage the platform.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
                    <button
                        onClick={handleAddClick}
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg"
                    >
                        <UserPlus size={20} />
                        Add User
                    </button>
                    <button
                        onClick={() => navigate('/admin/questions')}
                        className="flex items-center gap-2 px-6 py-3 bg-quest-primary text-quest-text rounded-xl font-bold hover:bg-quest-primary/90 transition-all shadow-lg hover:shadow-quest-primary/20"
                    >
                        <BookOpen size={20} />
                        Manage Questions
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="dark:bg-white/5 bg-black/5 backdrop-blur-md border dark:border-white/10 border-black/10 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon size={24} className={stat.color} />
                            <span className="text-2xl font-bold text-quest-text">{stat.value}</span>
                        </div>
                        <p className="text-quest-muted text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* User Table Section */}
            <div className="dark:bg-white/5 bg-black/5 backdrop-blur-md border dark:border-white/10 border-black/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b dark:border-white/10 border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-quest-text">All Users</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-quest-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl text-quest-text focus:outline-none focus:border-quest-primary/50 w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="dark:bg-white/5 bg-black/5 text-quest-muted text-sm">
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">XP / Level</th>
                                <th className="px-6 py-4 font-semibold">Badges</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-white/5 divide-black/5">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:dark:bg-white/5 bg-black/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.profilePic ? (
                                                <img src={user.profilePic} alt={user.name} className="w-10 h-10 rounded-full border dark:border-white/10 border-black/10" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-quest-primary/20 border border-quest-primary/30 flex items-center justify-center text-quest-primary font-bold">
                                                    {user.name && user.name.length > 0 ? user.name[0] : '?'}
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-quest-text font-medium">{user.name}</div>
                                                <div className="text-quest-muted text-sm">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isAdmin ? (
                                            <span className="flex items-center gap-1 text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full text-xs font-medium w-max">
                                                <Shield size={14} /> Admin
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full text-xs font-medium w-max">
                                                <Users size={14} /> User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-quest-text font-medium">{user.xp || 0} XP</div>
                                        <div className="text-quest-muted text-sm">Level {user.level || 1}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-2">
                                            {(user.badges || []).slice(0, 3).map((badge, i) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 rounded-full dark:bg-white/10 bg-black/10 border dark:border-white/20 border-black/20 flex items-center justify-center text-xs"
                                                    title={badge.badgeId}
                                                >
                                                    🏆
                                                </div>
                                            ))}
                                            {(user.badges || []).length > 3 && (
                                                <div className="w-8 h-8 rounded-full dark:bg-white/10 bg-black/10 border dark:border-white/20 border-black/20 flex items-center justify-center text-xs text-quest-muted">
                                                    +{(user.badges || []).length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleViewClick(user)}
                                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="p-2 text-quest-primary hover:bg-quest-primary/10 rounded-lg transition-colors"
                                                title="Edit User"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(user)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete User"
                                                disabled={user._id === authUser._id}
                                            >
                                                <Trash2 size={18} className={user._id === authUser._id ? 'opacity-50 cursor-not-allowed' : ''} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1A1A1A] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><UserPlus size={24} className="text-green-500" /> Add New User</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-50"
                                >
                                    {formLoading ? 'Adding...' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1A1A1A] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Edit size={24} className="text-quest-primary" /> Edit User</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-quest-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-quest-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Password <span className="text-xs text-white/40">(Leave empty to keep current)</span></label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-quest-primary"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Level</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-quest-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">XP</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.xp}
                                        onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-quest-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-quest-primary"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-4 py-2 rounded-xl bg-quest-primary hover:bg-quest-primary/90 text-quest-text font-bold transition-colors disabled:opacity-50"
                                >
                                    {formLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View User Modal */}
            {isViewModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1A1A1A] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Eye size={24} className="text-blue-500" /> User Details</h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="flex items-center gap-4 mb-6">
                                {selectedUser.profilePic ? (
                                    <img src={selectedUser.profilePic} alt={selectedUser.name} className="w-20 h-20 rounded-full border border-white/10" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-quest-primary/20 border border-quest-primary/30 flex items-center justify-center text-quest-primary text-3xl font-bold">
                                        {selectedUser.name && selectedUser.name.length > 0 ? selectedUser.name[0] : '?'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedUser.name}</h3>
                                    <p className="text-white/60">{selectedUser.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        {selectedUser.isAdmin && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">Admin</span>}
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">Level {selectedUser.level || 1}</span>
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">{selectedUser.xp || 0} XP</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-white/80 border-b border-white/10 pb-2">Completed Levels ({selectedUser.completedLevels?.length || 0})</h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                        {selectedUser.completedLevels && selectedUser.completedLevels.length > 0 ? (
                                            selectedUser.completedLevels.map((lvl, index) => (
                                                <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
                                                    <span className="text-white/80 text-sm capitalize">{lvl.moduleId.replace('-', ' ')}</span>
                                                    <div className="flex gap-2 text-xs">
                                                        <span className="px-2 py-0.5 bg-white/10 rounded capitalize">{lvl.difficulty}</span>
                                                        <span className="px-2 py-0.5 bg-white/10 rounded">Lvl {lvl.levelIndex + 1}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-white/40 text-sm">No completed levels yet.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-white/80 border-b border-white/10 pb-2">Badges ({selectedUser.badges?.length || 0})</h4>
                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                                        {selectedUser.badges && selectedUser.badges.length > 0 ? (
                                            selectedUser.badges.map((badge, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 text-sm text-white/80" title={`Earned: ${badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'Unknown'}`}>
                                                    <span>🏆</span> <span className="capitalize">{badge.badgeId.replace(/-/g, ' ')}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-white/40 text-sm">No badges earned yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/10 flex justify-end bg-white/5">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1A1A1A] w-full max-w-sm rounded-2xl border border-red-500/30 shadow-2xl p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Delete User?</h2>
                        <p className="text-white/60 mb-6">
                            Are you sure you want to delete <span className="font-bold text-white">{selectedUser.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={formLoading}
                                className="px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSubmit}
                                disabled={formLoading}
                                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50"
                            >
                                {formLoading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
