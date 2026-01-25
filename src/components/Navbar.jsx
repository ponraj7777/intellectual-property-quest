import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Modules', path: '/modules' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-quest-dark/80 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'
            }`}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="p-2 bg-quest-primary/20 rounded-lg group-hover:bg-quest-primary/30 transition-colors">
                        <Zap className="text-quest-primary w-6 h-6" />
                    </div>
                    <span className="text-xl font-heading font-bold text-white tracking-wide group-hover:text-quest-primary transition-colors">
                        IP Quest
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
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
                    <button className="btn-primary py-2 px-4 shadow-none text-sm">
                        Start Quest
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
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
                            <button className="btn-primary w-full mt-4">
                                Start Quest
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
