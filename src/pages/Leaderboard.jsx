import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';
import { useGame } from '../hooks/useGame';

const Leaderboard = () => {
    const { xp, level } = useGame();

    // Mock data for other players
    const players = [
        { rank: 1, name: "IPMaster99", xp: 12500, level: 12 },
        { rank: 2, name: "PatentPro", xp: 11200, level: 11 },
        { rank: 3, name: "CopyRight", xp: 9800, level: 9 },
        { rank: 4, name: "IdeaGuard", xp: 8500, level: 8 },
        { rank: 5, name: "SecretKeeper", xp: 7200, level: 7 },
    ];

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
                        <div className="w-16 h-16 rounded-full bg-quest-primary flex items-center justify-center text-xl font-bold">
                            You
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Your Rank</h3>
                            <p className="text-quest-muted">Level {level} Protector</p>
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
                        {players.map((player, index) => (
                            <div key={index} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className={`w-8 h-8 flex items-center justify-center font-bold text-lg ${index === 0 ? 'text-yellow-400' :
                                        index === 1 ? 'text-gray-300' :
                                            index === 2 ? 'text-amber-600' : 'text-quest-muted'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-bold">{player.name}</div>
                                        <div className="text-xs text-quest-muted">Level {player.level}</div>
                                    </div>
                                </div>
                                <div className="font-heading font-bold text-quest-primary">
                                    {player.xp.toLocaleString()} XP
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
