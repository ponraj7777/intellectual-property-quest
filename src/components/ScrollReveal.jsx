import React from 'react';
import { motion } from 'framer-motion';

/**
 * A reusable wrapper component for scroll-reveal animations.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to animate.
 * @param {string} props.variant - The animation variant (fade-up, fade-in, scale-in, fade-left, fade-right).
 * @param {number} props.delay - Delay before the animation starts.
 * @param {number} props.duration - Duration of the animation.
 * @param {string} props.className - Additional CSS classes.
 * @param {boolean} props.once - Whether the animation should only happen once.
 * @param {number} props.amount - Amount of the element that must be in view (0 to 1).
 */
const ScrollReveal = ({
    children,
    variant = 'fade-up',
    delay = 0,
    duration = 0.6,
    className = '',
    once = false,
    amount = 0.2
}) => {
    const variants = {
        'fade-up': {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
        },
        'fade-in': {
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
        },
        'scale-in': {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 }
        },
        'fade-left': {
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0 }
        },
        'fade-right': {
            hidden: { opacity: 0, x: 30 },
            visible: { opacity: 1, x: 0 }
        }
    };

    const selectedVariant = variants[variant] || variants['fade-up'];

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            variants={selectedVariant}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
