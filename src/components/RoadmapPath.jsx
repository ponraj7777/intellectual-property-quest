import React from 'react';
import { motion } from 'framer-motion';

const RoadmapPath = ({ isCompleted, isFromLeft, progress = 0 }) => {
    // 768px matches the max-w-3xl container width.
    // We use a normalized 100-unit coordinate system for width
    const viewBoxWidth = 100;
    const height = 100;

    // The nodes are 64px in a 768px max-width container.
    // Center of left node is 32px from left, center of right is 736px.
    // Percentages: (32/768)*100 = 4.1666...
    const leftX = 4.166;
    const rightX = 95.833;

    const startY = -32;
    const endY = height + 32;

    const startX = isFromLeft ? leftX : rightX;
    const endX = isFromLeft ? rightX : leftX;

    // Smooth S-curve
    const path = `M ${startX} ${startY} C ${startX} ${height * 0.5}, ${endX} ${height * 0.5}, ${endX} ${endY}`;

    return (
        <div className="w-full relative h-[100px] pointer-events-none z-0">
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBoxWidth} ${height}`}
                preserveAspectRatio="none"
                className="overflow-visible"
            >
                <defs>
                    <linearGradient id={`pathGradient-${isFromLeft ? 'L' : 'R'}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <filter id="glow-enhanced" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Base Path (Locked/Background) - Thicker more intentional */}
                <path
                    d={path}
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="6"
                    strokeLinecap="round"
                />

                {/* completion path (Active/Glow) */}
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isCompleted ? 1 : progress }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    d={path}
                    fill="none"
                    stroke={`url(#pathGradient-${isFromLeft ? 'L' : 'R'})`}
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter="url(#glow-enhanced)"
                    className="opacity-100"
                />
            </svg>
        </div>
    );
};

export default RoadmapPath;
