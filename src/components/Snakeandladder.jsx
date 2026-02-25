import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../snakeandladder.css";
import { Dices, RotateCcw, Trophy } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { useRef } from 'react';

const ladders = {
    7: 54,   // Extra long ladder, skips the congested mid-rows
    4: 13,   // Small jump at bottom
    26: 45,  // Moved from 22:32 to space things out
    51: 72,  // Mid-board jump
    78: 98   // Final stretch jump
};

const snakes = {
    97: 43,  // Extra Long snake, ends in row 5 instead of 2
    38: 20,  // Snake in row 4, ends in row 2
    52: 11,  // Snake from 6 to 2
    65: 35,  // Clearer path for mid-rows
    88: 67,
    95: 72,
    99: 80
};

export default function RightsDutiesClimb({ gameData, moduleId, levelIndex, difficulty }) {
    const { completeLevel } = useGame();
    const [position, setPosition] = useState(1);
    const [dice, setDice] = useState(0);
    const [moves, setMoves] = useState(0);
    const [message, setMessage] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);

    const [showQuestion, setShowQuestion] = useState(false);
    const [currentQ, setCurrentQ] = useState(null);
    const [diceNumber, setDiceNumber] = useState(1);
    const [isActiveDice, setIsActiveDice] = useState(false);
    const [highlightCells, setHighlightCells] = useState([]); // Array to hold multiple highlighted cells
    const boardRef = useRef(null);
    const [connections, setConnections] = useState([]);

    const questions = gameData.questions || [];

    // Calculate connection coordinates on mount and resize
    useEffect(() => {
        const updateConnections = () => {
            if (!boardRef.current) return;
            const boardRect = boardRef.current.getBoundingClientRect();
            const cells = boardRef.current.querySelectorAll('.cell');
            const cellMap = {};

            cells.forEach(cell => {
                const num = parseInt(cell.getAttribute('data-num'));
                const rect = cell.getBoundingClientRect();
                cellMap[num] = {
                    x: rect.left - boardRect.left + rect.width / 2,
                    y: rect.top - boardRect.top + rect.height / 2
                };
            });

            const newConnections = [];
            Object.entries(ladders).forEach(([start, end]) => {
                if (cellMap[start] && cellMap[end]) {
                    newConnections.push({ start: cellMap[start], end: cellMap[end], type: 'ladder' });
                }
            });
            Object.entries(snakes).forEach(([start, end]) => {
                if (cellMap[start] && cellMap[end]) {
                    newConnections.push({ start: cellMap[start], end: cellMap[end], type: 'snake' });
                }
            });
            setConnections(newConnections);
        };

        updateConnections();
        window.addEventListener('resize', updateConnections);
        return () => window.removeEventListener('resize', updateConnections);
    }, []);

    const rollDice = () => {
        if (isGameOver || showQuestion) return;

        setIsActiveDice(true);
        const intervalId = setInterval(() => {
            setDiceNumber(Math.floor(Math.random() * 6) + 1);
        }, 150);

        setTimeout(() => {
            clearInterval(intervalId);
            const roll = Math.floor(Math.random() * 6) + 1;
            setDiceNumber(roll);
            setIsActiveDice(false);
            setDice(roll);

            // Wait 1 second so player can see the roll before question pops up
            setTimeout(() => {
                const randomQ = questions[Math.floor(Math.random() * questions.length)];
                setCurrentQ(randomQ);
                setShowQuestion(true);
                setMessage("");
            }, 1000);
        }, 1000);
    };

    const moveStepByStep = async (startPos, steps) => {
        let current = startPos;
        const totalSteps = Math.abs(steps);
        const direction = steps > 0 ? 1 : -1;

        for (let i = 0; i < totalSteps; i++) {
            current += direction;
            if (current > 100) current = 100;
            if (current < 1) current = 1;

            setPosition(current);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (current === 100) break;
        }
        return current;
    };

    const handleAnswer = async (index) => {
        setShowQuestion(false);
        let currentPos = position;
        let finalPosAfterRoll;

        if (index === currentQ.correctAnswer) {
            setMessage(`✅ Correct! Moving forward ${dice} steps...`);
            finalPosAfterRoll = await moveStepByStep(currentPos, dice);
        } else {
            setMessage(`❌ Wrong! Moving back 2 steps...`);
            finalPosAfterRoll = await moveStepByStep(currentPos, -2);
        }

        if (finalPosAfterRoll === 100) {
            setIsGameOver(true);
            completeLevel(moduleId, levelIndex, difficulty);
        } else {
            // Check for ladder/snake
            if (ladders[finalPosAfterRoll]) {
                setHighlightCells([finalPosAfterRoll, ladders[finalPosAfterRoll]]);
                await new Promise(resolve => setTimeout(resolve, 1500));
                setMessage(prev => prev + " 🪜 Ladder! Climbing up!");
                setPosition(ladders[finalPosAfterRoll]);
                await new Promise(resolve => setTimeout(resolve, 500));
                setHighlightCells([]);
            } else if (snakes[finalPosAfterRoll]) {
                setHighlightCells([finalPosAfterRoll, snakes[finalPosAfterRoll]]);
                await new Promise(resolve => setTimeout(resolve, 1500));
                setMessage(prev => prev + " 🐍 Snake! Sliding down...");
                setPosition(snakes[finalPosAfterRoll]);
                await new Promise(resolve => setTimeout(resolve, 500));
                setHighlightCells([]);
            }
        }

        setMoves((m) => m + 1);
    };

    const resetGame = () => {
        setPosition(1);
        setMoves(0);
        setDice(0);
        setMessage("");
        setShowQuestion(false);
        setIsGameOver(false);
    };

    return (
        <div className="game-container min-h-full">
            <div className="game-layout">
                {/* BOARD AREA */}
                <div className="boardouter">
                    <div className="BoardInfo">
                        {/* <div className="lup">
                            <div className="upside">🪜</div>
                            <span>Ladder (Climb)</span>
                        </div>
                        <div className="ldown">
                            <div className="downside">🐍</div>
                            <span>Snake (Slide)</span>
                        </div> */}
                        <p className="ml-auto">
                            <span className="w-2 h-2 rounded-full bg-quest-primary animate-pulse"></span>
                            Current Position: <strong className="text-quest-primary">{position}</strong>
                        </p>
                    </div>

                    <div className="board-wrapper" style={{ position: 'relative' }}>
                        <div className="board" ref={boardRef}>
                            <svg className="board-connections">
                                {connections.map((conn, idx) => {
                                    if (conn.type === 'ladder') {
                                        // Calculate parallel rails for ladder
                                        const dx = conn.end.x - conn.start.x;
                                        const dy = conn.end.y - conn.start.y;
                                        const length = Math.sqrt(dx * dx + dy * dy);
                                        const offset = 8; // distance from center line to rail

                                        const nx = -dy / length * offset;
                                        const ny = dx / length * offset;

                                        // Ladder rails
                                        const rail1 = { x1: conn.start.x + nx, y1: conn.start.y + ny, x2: conn.end.x + nx, y2: conn.end.y + ny };
                                        const rail2 = { x1: conn.start.x - nx, y1: conn.start.y - ny, x2: conn.end.x - nx, y2: conn.end.y - ny };

                                        // Calculate rungs
                                        const rungs = [];
                                        const numRungs = Math.floor(length / 20);
                                        for (let i = 1; i < numRungs; i++) {
                                            const t = i / numRungs;
                                            rungs.push({
                                                x1: rail1.x1 + (rail1.x2 - rail1.x1) * t,
                                                y1: rail1.y1 + (rail1.y2 - rail1.y1) * t,
                                                x2: rail2.x1 + (rail2.x2 - rail2.x1) * t,
                                                y2: rail2.y1 + (rail2.y2 - rail2.y1) * t
                                            });
                                        }

                                        return (
                                            <g key={idx}>
                                                <line {...rail1} className="conn-line ladder rail" />
                                                <line {...rail2} className="conn-line ladder rail" />
                                                {rungs.map((rung, ri) => (
                                                    <line key={ri} {...rung} className="conn-line ladder rung" />
                                                ))}
                                            </g>
                                        );
                                    } else {
                                        // Wavy snake
                                        const dx = conn.end.x - conn.start.x;
                                        const dy = conn.end.y - conn.start.y;
                                        const length = Math.sqrt(dx * dx + dy * dy);

                                        const midX = (conn.start.x + conn.end.x) / 2;
                                        const midY = (conn.start.y + conn.end.y) / 2;

                                        const nx = -dy / length * 15; // Wiggle amplitude
                                        const ny = dx / length * 15;

                                        const q1x = conn.start.x + dx * 0.25 + nx;
                                        const q1y = conn.start.y + dy * 0.25 + ny;

                                        const q2x = conn.start.x + dx * 0.75 - nx;
                                        const q2y = conn.start.y + dy * 0.75 - ny;

                                        const pathData = `M ${conn.start.x} ${conn.start.y} 
                                                         Q ${q1x} ${q1y} ${midX} ${midY} 
                                                         Q ${q2x} ${q2y} ${conn.end.x} ${conn.end.y}`;

                                        // Random color for each snake
                                        const snakeColors = ['snake-rose', 'snake-amber', 'snake-orange', 'snake-purple'];
                                        const snakeColorClass = snakeColors[idx % snakeColors.length];

                                        return (
                                            <g key={idx} className={`snake-group ${snakeColorClass}`}>
                                                {/* Outer body */}
                                                <path d={pathData} className="conn-line snake body-outer" />
                                                {/* Inner pattern/belly */}
                                                <path d={pathData} className="conn-line snake body-inner" />

                                                {/* Detailed Head (No Rotation) */}
                                                <g transform={`translate(${conn.start.x}, ${conn.start.y})`}>
                                                    {/* Forked Tongue */}
                                                    <path d="M 8 0 L 14 -2 M 8 0 L 14 2" className="snake-tongue" />
                                                    {/* Head Shape */}
                                                    <ellipse cx="4" cy="0" rx="9" ry="6" className="snake-head" />
                                                    {/* Eyes */}
                                                    <circle cx="6" cy="-2.5" r="1.5" className="snake-eye" />
                                                    <circle cx="6" cy="2.5" r="1.5" className="snake-eye" />
                                                </g>
                                            </g>
                                        );
                                    }
                                })}
                            </svg>
                            {(() => {
                                const cells = [];
                                for (let r = 9; r >= 0; r--) {
                                    for (let c = 0; c < 10; c++) {
                                        const n = r % 2 === 0 ? (r * 10 + (c + 1)) : (r * 10 + (10 - c));
                                        cells.push(n);
                                    }
                                }
                                return cells.map((num) => {
                                    const isLadder = ladders[num];
                                    const isSnake = snakes[num];
                                    const isPlayer = position === num;

                                    // Deterministic random colors
                                    const colorClasses = ['cell-blue', 'cell-green', 'cell-red', 'cell-yellow', 'cell-purple'];
                                    const colorIndex = (num * 137) % 5;
                                    const colorClass = colorClasses[colorIndex];

                                    return (
                                        <div
                                            key={num}
                                            data-num={num}
                                            className={`cell ${colorClass} 
                            ${isLadder ? "ladder" : ""}
                            ${isSnake ? "snake" : ""}
                            ${isPlayer ? "player-cell" : ""}
                            ${highlightCells.includes(num) ? "highlight-cell" : ""}
                          `}
                                        >
                                            <span className="opacity-40 cell-num">{num}</span>
                                            {isPlayer && (
                                                <motion.div
                                                    layoutId="player-token"
                                                    className="player"
                                                >
                                                    🧑‍🚀
                                                </motion.div>
                                            )}
                                            {isLadder && !isPlayer && <span className="absolute bottom-1 right-1 opacity-20 text-[8px]">🪜</span>}
                                            {isSnake && !isPlayer && <span className="absolute bottom-1 right-1 opacity-20 text-[8px]">🐍</span>}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>

                {/* SIDE PANEL */}
                <aside className="panel">
                    <div className="stats">
                        <div>
                            <h2 className="text-quest-primary">{position}</h2>
                            <span>Position</span>
                        </div>
                        <div>
                            <h2 className="text-orange-400">{moves}</h2>
                            <span>Moves</span>
                        </div>
                        <div>
                            <h2 className="text-emerald-400">{dice}</h2>
                            <span>Dice</span>
                        </div>
                    </div>

                    {!isGameOver ? (
                        <div className="space-y-4">
                            {!showQuestion ? (
                                <div className="dice-box">
                                    <div className={`dice-visual ${isActiveDice ? "dicerotate" : ""}`}>
                                        {['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][diceNumber - 1]}
                                    </div>
                                    <button
                                        onClick={rollDice}
                                        disabled={isActiveDice}
                                        className="btn-primary w-full py-4 flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                    >
                                        <Dices className="w-5 h-5" />
                                        <span className="font-black uppercase tracking-wider">Roll Dice</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="question-box">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-quest-primary">
                                        <span className="px-2 py-0.5 rounded bg-quest-primary/20">Question</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-quest-text">{currentQ.text}</h3>
                                    <div className="space-y-3 pt-2">
                                        {currentQ.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleAnswer(i)}
                                                className="option group"
                                            >
                                                <h4 className="group-hover:scale-110 transition-transform">{String.fromCharCode(65 + i)}.</h4>
                                                <span className="text-quest-text group-hover:text-quest-primary transition-colors">{opt}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`messageBox ${message.includes('✅') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        message.includes('❌') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                            'bg-quest-primary/10 text-quest-primary border-quest-primary/20'
                                        }`}
                                >
                                    {message}
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-panel p-8 text-center space-y-4 border-quest-primary/30"
                        >
                            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-10 h-10 text-yellow-500" />
                            </div>
                            <h2 className="text-2xl font-black text-gradient">Mastered!</h2>
                            <p className="text-quest-muted text-sm leading-relaxed">
                                You've successfully climbed the Copyright ladder and mastered these rights.
                            </p>
                            <button onClick={resetGame} className="btn-primary w-full py-3">
                                Play Again
                            </button>
                        </motion.div>
                    )}

                    <div className="rules">
                        <h4>Guide</h4>
                        <ul>
                            <li>Roll dice to start your movement</li>
                            <li>Correct answers move you by dice value</li>
                            <li>Ladders take you up, Snakes take you down</li>
                            <li>Reach the 100th square to complete the Quest</li>
                        </ul>
                    </div>

                    <button className="reset" onClick={resetGame}>
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset Journey</span>
                    </button>
                </aside>
            </div>
        </div>
    );
}
