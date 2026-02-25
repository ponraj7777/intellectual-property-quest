import { motion } from 'framer-motion'

const Slide1 = ({ currentSlide, totalSlides }) => {
    return (
        <div className="relative flex h-full w-full overflow-hidden bg-quest-dark">
            {/* Vertical Dark Blue Accent Strip */}
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
                    {/* Nav Header (Top Left) */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-10 left-8 lg:left-24 flex items-center gap-3"
                    >
                        {/* Header content could go here */}
                    </motion.div>

                    <div className="mb-4">
                        <p className="text-quest-primary font-bold text-[10px] lg:text-xs tracking-widest uppercase">Slide {currentSlide} of {totalSlides}</p>
                    </div>
                    {/* Intro Speech Box */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="mb-6 lg:mb-10"
                    >
                        <div className="inline-flex items-center gap-3 bg-quest-card border-2 border-quest-primary/10 rounded-full px-4 lg:px-6 py-2 lg:py-3 shadow-sm">
                            <span className="material-symbols-outlined text-quest-primary text-sm lg:text-base">gavel</span>
                            <p className="text-xs lg:text-sm font-medium text-quest-muted">Welcome to your intellectual property journey</p>
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="max-w-2xl mb-4 lg:mb-8"
                    >
                        <h1 className="text-3xl lg:text-5xl font-black leading-[1.1] tracking-[-0.03em] text-quest-text">
                            Strategic Patent <br /> Roadmap
                        </h1>
                    </motion.div>

                    {/* Supporting Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        className="max-w-lg mb-8 lg:mb-12"
                    >
                        <p className="text-sm lg:text-xl text-quest-muted leading-relaxed">
                            A streamlined approach to navigating the complex landscape of patents. Our platform provides a clear visual guide to protect your innovations with confidence.
                        </p>
                    </motion.div>

                    {/* CTA and Pills */}
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3, duration: 0.6 }}
                        className="flex flex-wrap gap-4 items-center"
                    >
                        <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                            Start Exploration
                            <span className="material-symbols-outlined">rocket_launch</span>
                        </button>
                        <button className="bg-white dark:bg-slate-800 text-primary dark:text-slate-100 border-2 border-primary/10 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 hover:scale-105 transition-all">
                            View Documentation
                        </button>
                    </motion.div> */}
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
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_5tWZP6LwaZJd7JAIrSOUnbnW4j6o14r4d9Gb8jteLqynM8QFbNjcYfDtGggLuEtwglodKhFHqjjguKWlSR9NklMyJZPEb5HCydr_7dol_C5_SEzHeLltfy0FW9Dot2jRZPUxL6V8NKwLR2HzrwMnzz4-dTrRc844Vvcy9QtY6pCi4DEuzlc7qZDMg6LCTQi1jjZz4blocczfke0qmvtHvLL_AZBxCJ9IKrz7U5Q7XzEXaR7pig4rjU1c6sWjGmFp5Jk4d1ywoVK4")' }}
                    >
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background-light/40 to-transparent lg:from-background-light/0"></div>
                    </div>

                    {/* Floating Map Marker Component */}
                    {/* <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="absolute top-1/4 left-10 lg:left-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-2xl flex items-center gap-4 border border-white/20"
                    >
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-600">
                            <span className="material-symbols-outlined text-3xl">location_on</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Node</p>
                            <p className="font-bold text-slate-900 dark:text-white">Central Operations Hub</p>
                        </div>
                    </motion.div> */}

                    {/* Floating Progress Pill */}
                    {/* <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.7, duration: 0.8 }}
                        className="absolute bottom-24 right-10 bg-primary/95 text-white py-3 px-6 rounded-full flex items-center gap-3 shadow-xl backdrop-blur-sm"
                    >
                        <span className="material-symbols-outlined text-blue-400">check_circle</span>
                        <span className="font-medium">25% Process Completed</span>
                    </motion.div> */}
                </motion.div>
            </div>

            {/* Progress Footer */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-quest-primary/10 z-50">
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "25%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-quest-primary"
                ></motion.div>
            </div>
        </div>
    )
}

export default Slide1
