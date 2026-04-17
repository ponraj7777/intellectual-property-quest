import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LearningSlide = ({ data, currentSlide, totalSlides }) => {
    const { title, description, icon, image, accent } = data;

    return (
        <div className="relative flex h-full w-full overflow-hidden bg-quest-dark">
            {/* Vertical Accent Strip */}
            <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="w-2 bg-quest-primary h-full shrink-0 origin-top"
            ></motion.div>

            {/* Main Content Wrapper (Split Screen) */}
            <div className="flex flex-1 flex-col lg:flex-row h-full overflow-hidden">
                {/* Left Side: Text Content */}
                <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-8 relative overflow-hidden">
                    <div className="mb-4">
                        <p className="text-quest-primary font-bold text-[10px] lg:text-xs tracking-widest uppercase">Slide {currentSlide} of {totalSlides}</p>
                    </div>

                    {/* Intro Speech Box */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mb-6 lg:mb-10"
                    >
                        <div className="inline-flex items-center gap-3 bg-quest-card border-2 border-quest-primary/10 rounded-full px-4 lg:px-6 py-2 lg:py-3 shadow-sm">
                            <span className="material-symbols-outlined text-quest-primary text-sm lg:text-base">{icon}</span>
                            <p className="text-xs lg:text-sm font-medium text-quest-muted">Discover the World of {accent}</p>
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="max-w-2xl mb-4 lg:mb-8"
                    >
                        <h1 className="text-3xl lg:text-5xl font-black leading-[1.1] tracking-[-0.03em] text-quest-text whitespace-pre-line">
                            {title}
                        </h1>
                    </motion.div>

                    {/* Supporting Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="max-w-lg mb-8 lg:mb-12"
                    >
                        <p className="text-sm lg:text-xl text-quest-muted leading-relaxed">
                            {description}
                        </p>
                    </motion.div>
                </div>

                {/* Right Side: Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="flex-1 relative h-64 lg:h-full bg-slate-200 overflow-hidden"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url("${image}")` }}
                    >
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background-light/40 to-transparent lg:from-background-light/0"></div>
                    </div>
                </motion.div>
            </div>

            {/* Progress Footer */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-quest-primary/10 z-50">
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-quest-primary"
                ></motion.div>
            </div>
        </div>
    );
};

export default LearningSlide;
