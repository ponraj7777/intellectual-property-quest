import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import ScrollReveal from './ScrollReveal';

const Hero = () => {
    const { user } = useGame();
    const startPath = user ? "/modules" : "/login";
    return (
        <div className="relative overflow-hidden pt-20 pb-32">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-quest-primary/20 rounded-full blur-3xl rounded-full mix-blend-screen" />
                <div className="absolute top-40 right-10 w-96 h-96 bg-quest-accent/20 rounded-full blur-3xl mix-blend-screen" />
            </div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-quest-card border border-quest-primary/30 text-quest-primary text-sm font-medium mb-6 backdrop-blur-sm">
                            Gamified Intellectual Property Education
                        </span>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                            Master the World of <br />
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="text-gradient"
                            >
                                Intellectual Property
                            </motion.span>
                        </h1>
                        <p className="text-xl text-quest-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                            Embark on an epic quest to understand Patents, Copyrights, Trademarks, and Trade Secrets.
                            Level up your knowledge and protect your ideas.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to={startPath} className="btn-primary flex items-center gap-2 group w-full sm:w-auto justify-center">
                                Start Your Quest
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/about" className="btn-secondary w-full sm:w-auto text-center">
                                Learn More
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats / Features Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
                        {[
                            { icon: Shield, label: "IP Protection", desc: "Learn to safeguard your innovations" },
                            { icon: Award, label: "Earn Badges", desc: "Complete challenges and get certified" },
                            { icon: BookOpen, label: "Interactive Modules", desc: "Engaging lessons, not boring lectures" },
                        ].map((item, index) => (
                            <ScrollReveal
                                key={index}
                                variant="fade-up"
                                delay={0.4 + index * 0.1}
                            >
                                <div className="glass-panel p-6 rounded-xl text-left hover:border-quest-primary/30 transition-colors h-full">
                                    <div className="p-3 bg-quest-primary/10 rounded-lg w-fit mb-4">
                                        <item.icon className="w-6 h-6 text-quest-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{item.label}</h3>
                                    <p className="text-sm text-quest-muted">{item.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
