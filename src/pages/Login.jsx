import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useGame } from '../hooks/useGame';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useGame();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const loggedInUser = await login(email, password);
            if (loggedInUser && loggedInUser.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/modules');
            }
        } catch (error) {
            // Error toast is already handled in useGame
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-quest-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="glass-panel p-8 rounded-3xl relative z-10">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                            className="inline-flex p-4 bg-quest-primary/20 rounded-2xl mb-4"
                        >
                            <LogIn className="w-8 h-8 text-quest-primary" />
                        </motion.div>
                        <h1 className="text-3xl font-heading font-bold text-quest-muted mb-2">Welcome Back</h1>
                        <p className="text-quest-muted">Continue your intellectual property quest</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-quest-muted ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-quest-muted group-focus-within:text-quest-primary transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-quest-text placeholder:text-quest-muted/40 focus:outline-none focus:ring-2 focus:ring-quest-primary/50 focus:border-quest-primary transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-medium text-quest-muted">Password</label>
                                <button type="button" className="text-xs text-quest-primary hover:underline">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-quest-muted group-focus-within:text-quest-primary transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-quest-text placeholder:text-quest-muted/40 focus:outline-none focus:ring-2 focus:ring-quest-primary/50 focus:border-quest-primary transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-2 group relative overflow-hidden"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6 space-y-4">
                        <p className="text-quest-muted">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-quest-primary font-semibold hover:underline">
                                Create Account
                            </Link>
                        </p>
                        <Link to="/admin/login" className="block text-xs text-quest-muted/60 hover:text-quest-primary transition-colors">
                            Access Admin Portal
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
