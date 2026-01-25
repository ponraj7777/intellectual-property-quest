import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ArrowRight } from 'lucide-react';

const Modules = () => {
    return (
        <div className="container mx-auto px-4 py-12">
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
                        className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-all group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-colors`} />

                        <div className="relative z-10">
                            <div className={`p-4 rounded-xl bg-white/5 w-fit mb-6`}>
                                <module.icon className={`w-10 h-10 ${module.color}`} />
                            </div>

                            <h2 className="text-2xl font-bold mb-3 font-heading">{module.title}</h2>
                            <p className="text-quest-muted mb-6 leading-relaxed">
                                {module.description}
                            </p>

                            <Link
                                to={module.path}
                                className="inline-flex items-center gap-2 text-white font-medium hover:text-quest-primary transition-colors group-hover:translate-x-1 duration-300"
                            >
                                Enter Module <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Modules;
