import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Loader2 } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import api from '../utils/api';

const Leaderboard = () => {
    const { xp, level, user } = useGame();
    const [players, setPlayers] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const data = await api.getLeaderboard();
                setPlayers(data);

                // Fetch current user's rank if logged in
                if (user?.token) {
                    try {
                        const rankData = await api.getUserRank(user.token);
                        setUserRank(rankData);
                    } catch (rankErr) {
                        console.error("Failed to fetch user rank:", rankErr);
                    }
                }

                setError(null);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                setError("Could not load ranking data.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="container mx-auto px-4 pt-32 pb-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                    Quest <span className="text-gradient">Leaderboard</span>
                </h1>
                <p className="text-quest-muted">Top Protectors of Innovation</p>
            </div>

            <div className="max-w-3xl mx-auto">
                {/* User Stats Card */}
                <div className="glass-panel p-6 rounded-xl mb-12 flex items-center justify-between border-quest-primary/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-quest-primary/5 z-0" />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-quest-primary/30 bg-quest-primary/10 flex items-center justify-center text-xl font-bold">
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) || "Y"
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{user?.name || "Your Rank"}</h3>
                            <p className="text-quest-muted">
                                {userRank ? `Global Rank: #${userRank.rank}` : `Level ${level} Protector`}
                            </p>
                        </div>
                    </div>
                    <div className="relative z-10 text-right">
                        <div className="text-2xl font-bold font-heading text-quest-primary">{xp} XP</div>
                        <p className="text-xs text-quest-muted">Keep learning to climb!</p>
                    </div>
                </div>

                {/* Global Leaderboard */}
                <div className="glass-panel rounded-xl overflow-hidden p-0">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Crown className="text-yellow-500 w-5 h-5" /> Global Rankings
                        </h3>
                    </div>

                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-12 flex flex-col items-center justify-center gap-4 text-quest-muted">
                                <Loader2 className="w-8 h-8 animate-spin text-quest-primary" />
                                <p>Loading rankings...</p>
                            </div>
                        ) : error ? (
                            <div className="p-12 text-center text-red-400">
                                {error}
                            </div>
                        ) : players.length === 0 ? (
                            <div className="p-12 text-center text-quest-muted">
                                No guardians found yet. Be the first!
                            </div>
                        ) : (
                            players.map((player, index) => (
                                <div key={player._id || index} className={`flex items-center justify-between p-6 transition-colors hover:bg-white/5 ${user?.email === player.email ? 'bg-quest-primary/10' : ''}`}>
                                    <div className="flex items-center gap-6">
                                        <div className={`w-8 h-8 flex items-center justify-center font-bold text-lg ${index === 0 ? 'text-yellow-400' :
                                            index === 1 ? 'text-gray-300' :
                                                index === 2 ? 'text-amber-600' : 'text-quest-muted'
                                            }`}>
                                            {index + 1}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center text-sm font-bold">
                                                {player.profilePic ? (
                                                    <img src={player.profilePic} alt={player.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    player.name?.charAt(0) || "U"
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold flex items-center gap-2">
                                                    {player.name}
                                                    {user?.name === player.name && (
                                                        <span className="text-[10px] bg-quest-primary/20 text-quest-primary px-2 py-0.5 rounded-full">YOU</span>
                                                    )}
                                                    <div className="flex gap-1 items-center">
                                                        {index === 0 && <span className="text-xl" title="1st Place">🥇</span>}
                                                        {index === 1 && <span className="text-xl" title="2nd Place">🥈</span>}
                                                        {index === 2 && <span className="text-xl" title="3rd Place">🥉</span>}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-quest-muted">Level {Math.floor(player.xp / 1000) + 1}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-heading font-bold text-quest-primary">
                                        {player.xp.toLocaleString()} XP
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
