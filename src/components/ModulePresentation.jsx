import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import LearningSlide from './LearningSlide';
import { learningContent } from '../data/learningContent';

const ModulePresentation = ({ moduleId, onClose }) => {
    const slides = learningContent[moduleId] || learningContent.patents; // Fallback to patents
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setDirection(1);
            setCurrentSlide(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide(prev => prev - 1);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide]);

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-quest-dark flex items-center justify-center">
            {/* Close Button overlay */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="fixed top-6 right-6 z-[200] p-2 bg-quest-card/50 backdrop-blur-md hover:bg-quest-card rounded-full text-quest-text transition-all shadow-lg border border-quest-primary/20"
                >
                    <X className="w-6 h-6" />
                </button>
            )}

            <div className="relative w-full md:max-w-6xl aspect-auto md:aspect-[16/10] h-screen md:h-auto md:max-h-[90vh] bg-quest-card md:rounded-2xl shadow-2xl overflow-hidden border-0 md:border border-quest-primary/10">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0"
                    >
                        <LearningSlide
                            data={slides[currentSlide]}
                            currentSlide={currentSlide + 1}
                            totalSlides={slides.length}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls Overlay */}
                <div className="absolute bottom-6 right-6 flex gap-3 z-[100]">
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className={`w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-quest-primary/10 flex items-center justify-center text-quest-primary transition-all group ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-quest-primary hover:text-white shadow-lg'}`}
                    >
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === slides.length - 1}
                        className={`w-12 h-12 rounded-full bg-quest-primary flex items-center justify-center text-white transition-all ${currentSlide === slides.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 shadow-xl shadow-quest-primary/30'}`}
                    >
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-quest-primary/10 z-[100]">
                    <motion.div
                        animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-quest-primary"
                    ></motion.div>
                </div>
            </div>
        </div>
    );
};

export default ModulePresentation;
