import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, AlertTriangle, Heart } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import fireGif from '../assets/fire.gif';

const ReverseHangman = ({ gameData, moduleId, levelIndex, difficulty }) => {
    const { completeLevel } = useGame();
    const [gameState, setGameState] = useState('intro'); // intro, playing, won, lost
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [savedSteps, setSavedSteps] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [feedback, setFeedback] = useState(null);
    const [isSpraying, setIsSpraying] = useState(false);
    const [waterParticles, setWaterParticles] = useState([]);

    const questions = gameData.questions || [];
    const totalStepsToSave = 5;
    const maxQuestions = questions.length;

    // Timer Logic (Global 20s)
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('lost');
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    // Check Win/Loss conditions
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (savedSteps >= totalStepsToSave) {
            setGameState('won'); // Stop everything immediately
            completeLevel(moduleId, levelIndex, difficulty);
        } else if (currentQuestionIndex >= maxQuestions && !feedback) {
            setGameState('lost');
        }
    }, [savedSteps, currentQuestionIndex, feedback, gameState]);

    const startGame = () => {
        setGameState('playing');
        setSavedSteps(0);
        setCurrentQuestionIndex(0);
        setTimeLeft(30);
        setFeedback(null);
        setIsSpraying(false);
        setWaterParticles([]);
    };

    const handleAnswer = (isCorrect) => {
        if (feedback || gameState !== 'playing') return;

        if (isCorrect) {
            setSavedSteps((prev) => prev + 1);
            setFeedback({ type: 'correct', message: 'Correct!' });
            setIsSpraying(true);

            // Pre-calculate stable random physics for each particle
            const newParticles = Array.from({ length: 60 }).map((_, i) => {
                const velocity = 280 + Math.random() * 100;
                const distance = velocity * 0.85;
                const startX = poleX + 25;
                const startY = 365;
                return {
                    id: Date.now() + i,
                    startX,
                    startY,
                    controlX: startX + distance / 2,
                    controlY: startY - 200 - Math.random() * 80,
                    endX: startX + distance,
                    endY: startY + 50,
                    duration: 0.8 + Math.random() * 0.5,
                    delay: (i / 60) * 0.8, // Staggered entry over 0.8s
                    r: Math.random() * 2.5 + 1
                };
            });
            setWaterParticles(newParticles);
        } else {
            setFeedback({ type: 'wrong', message: 'Wrong! No progress made!' });
        }

        setTimeout(() => {
            setFeedback(null);
            setIsSpraying(false);
            setWaterParticles([]);
            setCurrentQuestionIndex((prev) => prev + 1);
        }, 1500);
    };

    // Staged logic
    const isLoose = savedSteps >= 2;
    const fireCount = 5;
    const fireSize = Math.max(0, 1.4 - (savedSteps * 0.28)); // Starts at 1.4, ends at 0
    const isReleased = savedSteps >= 5;

    // Visual Props (Based on 400x500 viewBox)
    const poleX = 80;
    const groundY = 420;
    const hookX = 280;
    const hookY = 50;
    const ropeBaseLength = 50;
    const ropeDrop = savedSteps * 25;
    const attachmentY = hookY + ropeBaseLength + ropeDrop;
    const ropeSlack = isLoose ? 35 : 0;
    const characterHeight = 100;
    const landingY = groundY - characterHeight + 15;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* HUD */}
            <div className="flex items-center justify-between bg-quest-card border border-quest-text/10 p-3 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    <span className="font-bold text-quest-text text-xs">
                        RESCUE: {savedSteps} / {totalStepsToSave}
                    </span>
                </div>
                <div className="text-[10px] text-quest-muted font-bold uppercase tracking-widest">
                    Q {Math.min(currentQuestionIndex + 1, maxQuestions)} / {maxQuestions}
                </div>
            </div>

            {/* Game Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-h-[500px] md:h-[480px]">

                {/* Visual Scene */}
                <div className="relative bg-quest-card/50 rounded-2xl border border-quest-text/10 overflow-hidden shadow-inner flex flex-col items-center justify-between">

                    {/* Timer Move: In the "red part" indicated by user */}
                    <div className="absolute left-[35%] top-[30%] text-center z-10 pointer-events-none">
                        <motion.div
                            animate={{ scale: timeLeft <= 5 ? [1, 1.1, 1] : 1 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl backdrop-blur-md border ${timeLeft <= 5 ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-quest-primary/10 border-quest-primary/30 text-quest-primary'} shadow-lg`}
                        >
                            <Timer className="w-5 h-5 opacity-50 mb-0.5" />
                            <span className="font-mono font-black text-2xl tabular-nums leading-none">
                                {timeLeft}<span className="text-sm ml-0.5 opacity-70">s</span>
                            </span>
                        </motion.div>
                    </div>

                    <svg viewBox="0 0 400 480" className="w-full h-full max-h-[300px] md:max-h-none pointer-events-none">
                        {/* Gallows */}
                        <g className="stroke-quest-text" strokeWidth="10" strokeLinecap="round">
                            <line x1="40" y1={groundY} x2="360" y2={groundY} /> {/* Ground base */}
                            <line x1={poleX} y1={groundY} x2={poleX} y2="40" /> {/* Pole */}
                            <line x1={poleX} y1="40" x2={hookX} y2="40" /> {/* Top arm */}
                            <line x1={poleX} y1="120" x2={poleX + 60} y2="40" strokeWidth="6" /> {/* Support */}
                            <line x1={hookX} y1="40" x2={hookX} y2={hookY} strokeWidth="6" /> {/* Rope hook */}
                        </g>

                        {/* Shower Head - Attached to Bottom of Pole */}
                        <g transform={`translate(${poleX + 5}, 380)`}>
                            {/* Arm */}
                            <line x1="0" y1="0" x2="20" y2="-10" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
                            {/* Head */}
                            <g transform="rotate(-45, 20, -10)">
                                <path d="M 20 -20 L 35 -30 L 35 10 L 20 0 Z" fill="#9CA3AF" stroke="#4B5563" strokeWidth="1" />
                                {/* Holes */}
                                <circle cx="30" cy="-20" r="1.5" fill="#4B5563" />
                                <circle cx="30" cy="-10" r="1.5" fill="#4B5563" />
                                <circle cx="30" cy="0" r="1.5" fill="#4B5563" />
                            </g>
                        </g>

                        {/* Water Particles - Curved Path from Bottom */}
                        <AnimatePresence>
                            {isSpraying && waterParticles.map((p) => (
                                <motion.circle
                                    key={p.id}
                                    r={p.r}
                                    fill="#60A5FA"
                                    initial={{ offsetDistance: "0%", opacity: 0 }}
                                    animate={{ offsetDistance: "100%", opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: p.duration,
                                        ease: "linear",
                                        delay: p.delay
                                    }}
                                    style={{
                                        offsetPath: `path("M ${p.startX} ${p.startY} Q ${p.controlX} ${p.controlY} ${p.endX} ${p.endY}")`
                                    }}
                                />
                            ))}
                        </AnimatePresence>

                        {/* Rope */}
                        <AnimatePresence>
                            {(!isReleased && gameState !== 'lost') && (
                                <motion.path
                                    key="rope"
                                    d={`M ${hookX} ${hookY} Q ${hookX + ropeSlack} ${hookY + (attachmentY - hookY) / 2}, ${hookX} ${attachmentY}`}
                                    fill="none"
                                    stroke="#8B4513"
                                    strokeWidth="5"
                                    initial={false}
                                    animate={{
                                        d: `M ${hookX} ${hookY} Q ${hookX + ropeSlack} ${hookY + (attachmentY - hookY) / 2}, ${hookX} ${attachmentY}`
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Hangman Character */}
                        <motion.g
                            initial={false}
                            animate={{
                                y: gameState === 'lost' ? groundY + 20 : (isReleased ? landingY : attachmentY - 32),
                                x: hookX,
                                rotate: gameState === 'lost' ? [0, 45, 90] : 0,
                                opacity: gameState === 'lost' ? [1, 1, 0] : 1
                            }}
                            transition={{
                                duration: gameState === 'lost' ? 1.5 : (isReleased ? 0.8 : 0.5),
                                type: (isReleased || gameState === 'lost') ? "spring" : "tween",
                                bounce: isReleased ? 0.3 : 0
                            }}
                        >
                            {/* Inner character group, centered horizontally and vertically at neck attachment */}
                            <g transform="translate(-50, 0)">
                                <svg width="100" height="100" viewBox="0 0 100 100" className="overflow-visible">
                                    {/* Neck Loop (Noose) - Rendering first so it stays BEHIND the head/body */}
                                    {(!isReleased && gameState !== 'lost') && (
                                        <g>
                                            <circle
                                                cx="50" cy="32"
                                                r={isLoose ? 22 : 12}
                                                fill="none"
                                                stroke="#8B4513"
                                                strokeWidth="3"
                                                className="transition-all duration-500"
                                            />
                                            {/* Tied Knot part at the top of the loop */}
                                            <rect x="46" y={32 - (isLoose ? 22 : 12) - 2} width="8" height="6" fill="#8B4513" rx="1" />
                                        </g>
                                    )}

                                    {/* Head */}
                                    <circle cx="50" cy="20" r="15" fill={gameState === 'lost' ? "#ef4444" : "black"} stroke={gameState === 'lost' ? "#b91c1c" : "black"} strokeWidth="4" />
                                    {/* Body */}
                                    <line x1="50" y1="35" x2="50" y2="70" stroke={gameState === 'lost' ? "#ef4444" : "black"} strokeWidth="4" strokeLinecap="round" />
                                    {/* Arms */}
                                    <motion.line x1="50" y1="45" x2="20" y2="35" stroke={gameState === 'lost' ? "#ef4444" : "black"} strokeWidth="4" strokeLinecap="round"
                                        animate={{ rotate: (isReleased || gameState === 'lost') ? [-20, 20, -20] : 0 }}
                                        transition={{ repeat: gameState === 'lost' ? Infinity : 0, duration: 0.5 }} />
                                    <motion.line x1="50" y1="45" x2="80" y2="35" stroke={gameState === 'lost' ? "#ef4444" : "black"} strokeWidth="4" strokeLinecap="round"
                                        animate={{ rotate: (isReleased || gameState === 'lost') ? [20, -20, 20] : 0 }}
                                        transition={{ repeat: gameState === 'lost' ? Infinity : 0, duration: 0.5 }} />
                                    {/* Legs */}
                                    <motion.line x1="50" y1="70" x2="35" y2="95" stroke={gameState === 'lost' ? "#ef4444" : "black"} strokeWidth="4" strokeLinecap="round"
                                        animate={{ rotate: gameState === 'lost' ? [0, 30, -30] : 0 }} />
                                    <motion.line x1="50" y1="70" x2="65" y2="95" stroke={gameState === 'lost' ? "#ef4444" : "black"} strokeWidth="4" strokeLinecap="round"
                                        animate={{ rotate: gameState === 'lost' ? [0, -30, 30] : 0 }} />
                                </svg>
                            </g>
                        </motion.g>

                        {/* Fire Row - Correctly aligned to the right of the pole on the ground line */}
                        <g>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <motion.image
                                    key={i}
                                    href={fireGif}
                                    initial={{ opacity: 1, scale: 1 }}
                                    animate={{
                                        opacity: fireSize > 0 ? 1 : 0,
                                        scale: fireSize,
                                        x: hookX - 110 + (i * 45),
                                        y: groundY - 80
                                    }}
                                    style={{ originY: 1 }}
                                    width="80"
                                    height="80"
                                    preserveAspectRatio="xMidYMid meet"
                                />
                            ))}
                        </g>

                        {/* Visual Floor Decor (behind wszystko) */}
                        <rect x="0" y={groundY} width="400" height="70" className="fill-quest-text/5" />
                    </svg>

                </div>

                {/* UI */}
                <div className="flex flex-col justify-center space-y-6 px-4">
                    <AnimatePresence mode="wait">
                        {gameState === 'playing' && currentQuestion && !feedback ? (
                            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 md:space-y-6">
                                <h3 className="text-lg md:text-xl font-bold text-quest-text leading-tight">{currentQuestion.text}</h3>
                                <div className="grid grid-cols-1 gap-2.5 md:gap-3">
                                    {currentQuestion.options.map((opt, idx) => (
                                        <button key={idx} onClick={() => handleAnswer(idx === currentQuestion.correctAnswer)}
                                            className="w-full text-left p-3 md:p-4 rounded-xl bg-quest-card border border-quest-text/10 hover:border-quest-primary hover:bg-quest-primary/5 transition-all font-medium text-sm md:text-base">
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : feedback ? (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-10 rounded-2xl text-center border-2 ${feedback.type === 'correct' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-rose-500/10 border-rose-500/30 text-rose-600'}`}>
                                <h3 className="text-3xl font-black">{feedback.message}</h3>
                            </motion.div>
                        ) : gameState === 'won' ? (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 p-8 bg-quest-card rounded-2xl border border-quest-primary/20 shadow-2xl">
                                <Trophy className="w-16 h-16 text-quest-primary mx-auto" />
                                <h2 className="text-3xl font-black text-quest-text">HERO!</h2>
                                <p className="text-quest-muted">You saved the inventor from a fiery disaster.</p>
                                <button onClick={startGame} className="btn-primary w-full py-4 rounded-xl">Rescue Again</button>
                            </motion.div>
                        ) : gameState === 'lost' ? (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 p-8 bg-quest-card rounded-2xl border border-rose-500/20 shadow-2xl">
                                <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto" />
                                <h2 className="text-3xl font-black text-rose-600">MISSION FAILED</h2>
                                <button onClick={startGame} className="btn-secondary w-full py-4 rounded-xl">Try Again</button>
                            </motion.div>
                        ) : (
                            <div className="text-center space-y-4 md:space-y-8">
                                <h2 className="text-3xl md:text-4xl font-black text-quest-text">RESCUE MISSION</h2>
                                <p className="text-quest-muted text-base md:text-lg">Save the inventor from the fire by answering correctly. You have 30 seconds!</p>
                                <button onClick={startGame} className="btn-primary w-full py-4 md:py-5 text-lg md:text-xl rounded-2xl shadow-xl">START MISSION</button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ReverseHangman;
