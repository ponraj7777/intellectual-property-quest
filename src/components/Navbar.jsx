import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { user, logout, xp, getNextMilestone } = useGame();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const nextMilestone = getNextMilestone();
    const progressToNext = nextMilestone
        ? ((xp) / nextMilestone.xp) * 100
        : 100;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Journey', path: '/roadmap' },
        { name: 'Modules', path: '/modules' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-quest-card/80 backdrop-blur-lg border-b border-quest-text/10 py-4' : 'bg-transparent py-6'
            }`}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="p-2 bg-quest-primary/20 rounded-lg group-hover:bg-quest-primary/30 transition-colors">
                        <Zap className="text-quest-primary w-6 h-6" />
                    </div>
                    <span className="text-xl font-heading font-bold text-quest-text tracking-wide group-hover:text-quest-primary transition-colors">
                        IP Quest
                    </span>
                </Link>

                {/* XP Progress Bar (Desktop) */}
                {user && (
                    <div className="hidden lg:flex flex-col w-48 mx-4">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter mb-1">
                            <span className="text-quest-primary">{xp} XP</span>
                            <span className="text-quest-muted">
                                {nextMilestone ? `Next: ${nextMilestone.label}` : 'Max Rank'}
                            </span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToNext}%` }}
                                className="h-full bg-gradient-to-r from-quest-primary to-quest-accent rounded-full"
                            />
                        </div>
                    </div>
                )}

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-quest-primary ${location.pathname === link.path ? 'text-quest-primary' : 'text-quest-muted'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-6 w-[1px] bg-quest-text/10 mx-2" />
                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-4 ml-2">
                            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-quest-text/5 border border-quest-text/10 rounded-xl hover:bg-quest-text/10 transition-colors group">
                                <div className="w-6 h-6 bg-quest-primary/20 rounded-full flex items-center justify-center text-[10px] font-bold text-quest-primary group-hover:bg-quest-primary/30 transition-colors">
                                    {user.name[0].toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-quest-text">{user.name}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm text-quest-muted hover:text-rose-400 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 ml-2">
                            <Link to="/login" className="btn-primary py-2 px-4 shadow-none text-sm text-center">
                                Login
                            </Link>
                            <Link to="/signup" className="btn-secondary py-2 px-4 text-sm">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-4 md:hidden">
                    <ThemeToggle />
                    <button
                        className="text-quest-text p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-quest-card/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-lg font-medium py-2 border-b border-white/5 ${location.pathname === link.path ? 'text-quest-primary' : 'text-quest-muted'
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-xl transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-quest-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-quest-primary">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-quest-text font-medium">{user.name}</div>
                                            <div className="text-xs text-quest-muted">{user.email}</div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-500 font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-primary w-full mt-4 text-center" onClick={() => setIsOpen(false)}>
                                        Login
                                    </Link>
                                    <Link to="/signup" className="w-full mt-2 border border-quest-text/10 py-3 rounded-xl text-center hover:bg-quest-text/5" onClick={() => setIsOpen(false)}>
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
