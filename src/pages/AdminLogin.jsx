import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { toast } from 'sonner';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useGame();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const user = await login(email, password);
            if (user.isAdmin) {
                toast.success('Admin access granted');
                navigate('/admin');
            } else {
                toast.error('Access Denied: Not an administrator');
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 pt-40 pb-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-3xl max-w-md mx-auto border-quest-primary/20 relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-quest-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-quest-secondary/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-quest-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-quest-primary" />
                    </div>

                    <h2 className="text-3xl font-heading font-bold mb-2">Admin Command Center</h2>
                    <p className="text-quest-muted mb-8">Restricted access for authorized protectors only.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-quest-primary transition-colors text-quest-text"
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Security Key"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-quest-primary transition-colors text-quest-text"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 group transition-all
                                ${isLoading ? 'opacity-70 cursor-wait' : ''}
                            `}
                        >
                            {isLoading ? 'Verifying...' : 'Authenticate Access'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t dark:border-white/10 border-black/10">
                        <p className="text-sm text-quest-muted flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Use your registered admin credentials to enter.
                        </p>
                        <Link to="/login" className="inline-block mt-4 text-xs text-quest-primary hover:underline">
                            Return to Standard Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
