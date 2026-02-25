import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxSection = ({
    title,
    description,
    features = [],
    visualContent,
    reversed = false,
    className = ""
}) => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for the visual content
    const yVisual = useTransform(scrollYProgress, [0, 1], [150, -150]);
    // Opposing effect for the text content
    const yText = useTransform(scrollYProgress, [0, 1], [-100, 100]);

    // Fade in effect
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            className={`py-24 relative overflow-hidden ${className}`}
        >
            <div className="container mx-auto px-4 relative z-10">
                <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${reversed ? 'md:flex-row-reverse' : ''}`}>

                    {/* Text Content */}
                    <motion.div
                        style={{ y: yText, opacity }}
                        className="md:w-1/2"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                            {title}
                        </h2>
                        <p className="text-quest-muted text-lg mb-8 leading-relaxed">
                            {description}
                        </p>

                        {features.length > 0 && (
                            <div className="space-y-4">
                                {features.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: false, amount: 0.3 }}
                                        transition={{ delay: 0.1 * i }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="p-2 bg-quest-primary/10 rounded-lg shrink-0">
                                            {item.icon && <item.icon className="w-5 h-5 text-quest-primary" />}
                                        </div>
                                        <span className="font-medium text-quest-text/90">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Visual Content */}
                    <motion.div
                        style={{ y: yVisual, opacity }}
                        className="md:w-1/2 w-full relative"
                    >
                        <div className="relative group perspective-1000">
                            {/* Glow Effect */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-full bg-quest-primary/20 blur-[100px] rounded-full -z-10 transition-all duration-700 group-hover:bg-quest-primary/30 group-hover:blur-[120px]`}></div>

                            {/* Glass Panel Container */}
                            <div className="glass-panel p-2 rounded-3xl border-quest-primary/20 relative z-10 transform transition-transform duration-500 hover:rotate-y-2 hover:rotate-x-2">
                                {visualContent}
                            </div>

                            {/* Floating Decorative Elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 w-12 h-12 bg-quest-secondary/20 rounded-full blur-xl"
                            />
                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-8 -left-8 w-20 h-20 bg-quest-primary/20 rounded-full blur-xl"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ParallaxSection;
