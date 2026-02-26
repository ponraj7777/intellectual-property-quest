import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User as UserIcon,
    Mail,
    Calendar,
    Gamepad2,
    Award,
    Target,
    LogOut,
    Edit3,
    Trophy,
    ChevronRight,
    Camera,
    Save,
    X,
    CheckCircle2
} from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, xp, level, completedLevels, logout, updateProfile } = useGame();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        dob: user?.dob || ''
    });
    const [isLoading, setIsLoading] = useState(false);

    if (!user) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-quest-primary/20 rounded-full flex items-center justify-center mb-6">
                    <UserIcon className="w-10 h-10 text-quest-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Join the Quest</h2>
                <p className="text-quest-muted mb-8 max-w-md">
                    Create an account or login to view your profile, track your progress, and climb the leaderboard.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/login')} className="btn-primary px-8 py-3">Login</button>
                    <button onClick={() => navigate('/signup')} className="btn-secondary px-8 py-3">Sign Up</button>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: "Games Played",
            value: completedLevels.length,
            icon: Gamepad2,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10"
        },
        {
            label: "Challenges Mastered",
            value: completedLevels.length,
            icon: Award,
            color: "text-orange-400",
            bgColor: "bg-orange-500/10"
        },
        {
            label: "Total Points",
            value: xp.toLocaleString(),
            icon: Target,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10"
        }
    ];

    const joinedDate = user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }) : "February 2026";

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            await updateProfile(editForm);
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                try {
                    await updateProfile({ profilePic: base64String });
                } catch (error) {
                    console.error("Photo upload failed:", error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl pt-24 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative"
            >
                {/* Theme Bar */}
                <div className="h-2 bg-gradient-to-r from-quest-primary via-quest-accent to-quest-secondary w-full" />

                {/* Profile Header */}
                <div className="px-8 py-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar / Photo Upload */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-quest-primary/30 p-1 bg-gradient-to-tr from-quest-primary/20 to-quest-accent/20">
                                <div className="w-full h-full rounded-full bg-quest-card flex items-center justify-center overflow-hidden border-2 border-white/10 relative">
                                    {user.profilePic ? (
                                        <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl font-black text-quest-primary/40 uppercase">
                                            {user.name[0]}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white"
                                    >
                                        <Camera className="w-6 h-6 mb-1 text-white" />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-white">Change</span>
                                    </button>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        {/* Name & Basic Info */}
                        <div className="text-center md:text-left pt-2">
                            <h1 className="text-4xl font-black text-quest-text mb-2 tracking-tight">{user.name}</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-center md:justify-start gap-2 text-quest-muted">
                                    <Mail className="w-4 h-4 text-quest-primary/60" />
                                    <span className="text-sm font-medium">{user.email}</span>
                                </div>
                                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-quest-primary/10 rounded-full border border-quest-primary/20 w-fit">
                                    <Trophy className="w-3.5 h-3.5 text-quest-primary" />
                                    <span className="text-[10px] font-black text-quest-primary uppercase tracking-widest">Master Detective</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions & Badge */}
                    <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-quest-card/40 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 text-quest-text shadow-xl w-fit"
                        >
                            <div className="p-3 bg-quest-primary/20 rounded-xl">
                                <Award className="w-7 h-7 text-quest-primary" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-quest-primary uppercase tracking-widest mb-1">Rank Achievement</div>
                                <div className="text-base font-bold whitespace-nowrap uppercase tracking-tight text-quest-text">IP SUPREME CHAMPION</div>
                            </div>
                        </motion.div>

                        <div className="flex gap-3">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-quest-primary/10 text-quest-primary font-black text-sm border border-quest-primary/20 hover:bg-quest-primary/20 transition-all"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        EDIT QUEST PROFILE
                                    </button>
                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate('/');
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500/10 text-rose-400 font-black text-sm border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        SIGN OUT
                                    </button>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 bg-white/[0.02] border-t border-white/5">
                    {/* Activity Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-8 bg-quest-primary rounded-full shadow-lg shadow-quest-primary/40" />
                            <h2 className="text-2xl font-black text-quest-text uppercase tracking-tight">Quest Activity</h2>
                        </div>

                        <div className="grid gap-6">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ x: 8, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                    className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 flex items-center justify-between group cursor-default transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-inner`}>
                                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <div className="text-4xl font-black text-quest-text leading-none mb-2 tabular-nums tracking-tighter">{stat.value}</div>
                                            <div className="text-xs font-bold text-quest-muted uppercase tracking-widest">{stat.label}</div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-quest-muted group-hover:text-quest-primary group-hover:border-quest-primary/20 transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Stats/Details Column */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-8 bg-quest-accent rounded-full shadow-lg shadow-quest-accent/40" />
                            <h2 className="text-2xl font-black text-quest-text uppercase tracking-tight">Field Notes</h2>
                        </div>

                        <div className="bg-gradient-to-br from-white/[0.04] to-transparent p-1 rounded-[2.5rem] border border-white/10">
                            <div className="bg-quest-card/60 backdrop-blur-xl p-8 rounded-[2.4rem] space-y-8">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-quest-muted uppercase tracking-[0.2em] mb-1">Detective Name</div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-base font-bold text-quest-text focus:outline-none focus:ring-2 focus:ring-quest-primary"
                                            placeholder="Full Name"
                                        />
                                    ) : (
                                        <div className="text-lg font-bold text-quest-text flex items-center gap-2">
                                            <UserIcon className="w-4 h-4 text-quest-primary" />
                                            {user.name}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-quest-muted uppercase tracking-[0.2em] mb-1">Communication</div>
                                    <div className="text-lg font-bold text-quest-text flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-quest-primary" />
                                        {user.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-quest-muted uppercase tracking-[0.2em] mb-1">Date of Birth</div>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={editForm.dob}
                                            onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-base font-bold text-quest-text focus:outline-none focus:ring-2 focus:ring-quest-primary"
                                        />
                                    ) : (
                                        <div className="text-lg font-bold text-quest-text flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-quest-primary" />
                                            {user.dob || "Not Provided"}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-quest-muted uppercase tracking-[0.2em] mb-1">Joined Quest</div>
                                    <div className="text-lg font-bold text-quest-text flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-quest-primary" />
                                        {joinedDate}
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="pt-4 flex flex-col gap-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isLoading}
                                            className="w-full py-3 rounded-xl bg-quest-primary text-white font-black text-sm hover:bg-orange-600 transition-all shadow-lg"
                                        >
                                            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : "SAVE FIELD NOTES"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditForm({ name: user.name, dob: user.dob });
                                            }}
                                            className="w-full py-3 rounded-xl bg-white/5 text-quest-muted font-black text-sm border border-white/10 hover:bg-white/10"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rank Progress Card */}
                        <div className="p-6 rounded-3xl bg-quest-primary/10 border border-quest-primary/20 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform">
                                <Trophy className="w-32 h-32 text-quest-primary" />
                            </div>
                            <h3 className="text-sm font-black text-quest-primary uppercase mb-4 tracking-widest">Mastery Level {level}</h3>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-quest-primary shadow-[0_0_10px_rgba(237,128,42,0.5)]"
                                    style={{ width: `${(xp % 1000) / 10}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-quest-muted">
                                <span>{xp % 1000} XP</span>
                                <span>1000 XP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
