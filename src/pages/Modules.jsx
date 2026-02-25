import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
import { modulesData } from '../data/modules';
import { useGame } from '../hooks/useGame';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Modules = () => {
    const { user } = useGame();
    const navigate = useNavigate();

    const handleEnterModule = (path) => {
        if (!user) {
            toast.error("Authentication Required", {
                description: "Please login to access training modules and games."
            });
            navigate('/login');
            return;
        }
        navigate(path);
    };

    return (
        <div className="container mx-auto px-4 pt-32 pb-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                    Training <span className="text-gradient">Modules</span>
                </h1>
                <p className="text-quest-muted max-w-2xl mx-auto">
                    Select a domain to begin your training. Earn badges and certificates as you master each area.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {modulesData.map((module, index) => (
                    <motion.div
                        key={module.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel p-8 rounded-2xl hover:bg-quest-card/50 transition-all duration-500 hover:scale-[1.02] group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-32 bg-gradient-to-br from-quest-text/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-quest-text/10 transition-colors`} />

                        <div className="relative z-10">
                            <div className={`p-4 rounded-xl bg-quest-text/5 w-fit mb-6`}>
                                <module.icon className={`w-10 h-10 ${module.color}`} />
                            </div>

                            <h2 className="text-2xl font-bold mb-3 font-heading">{module.title}</h2>
                            <p className="text-quest-muted mb-6 leading-relaxed">
                                {module.description}
                            </p>

                            <button
                                onClick={() => handleEnterModule(module.path)}
                                className="inline-flex items-center gap-2 text-quest-text font-medium hover:text-quest-primary transition-colors group-hover:translate-x-1 duration-300"
                            >
                                {user ? "Enter Module" : "Login to Play"}
                                {user ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Modules;
