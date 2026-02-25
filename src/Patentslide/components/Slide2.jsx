import { motion } from 'framer-motion'

const Slide2 = ({ currentSlide, totalSlides }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="bg-quest-dark font-display text-quest-text h-full flex flex-col">
            {/* Top Navigation Bar */}
            {/* <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-50"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-lg text-white">
                        <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
                    </div>
                    <h2 className="text-primary dark:text-white text-lg font-bold tracking-tight">Incident Training</h2>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    {['Modules', 'Resources', 'Glossary'].map((link) => (
                        <a key={link} className="text-primary/70 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-semibold transition-colors" href="#">{link}</a>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                    </button>
                    <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-xl">account_circle</span>
                    </button>
                </div>
            </motion.header> */}

            {/* Main Content Container */}
            <main className="flex-1 overflow-hidden flex flex-col max-w-7xl mx-auto w-full px-4 lg:px-6 py-4 lg:py-6 gap-4 lg:gap-6 no-scrollbar">
                {/* Progress Bar */}
                <div className="w-full flex flex-col gap-2 shrink-0">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-quest-primary font-bold text-[10px] lg:text-xs tracking-widest uppercase">Slide {currentSlide} of {totalSlides}</p>
                    </div>
                    <div className="flex justify-between text-[10px] lg:text-xs font-bold text-quest-muted uppercase tracking-widest">
                        <span>Module 1: Fundamentals</span>
                    </div>
                    <div className="h-1.5 w-full bg-quest-primary/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "16.66%" }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="h-full bg-quest-primary rounded-full"
                        ></motion.div>
                    </div>
                </div>

                {/* Split Screen Layout */}
                <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-0">
                    {/* Left Panel: Text Explanation */}
                    <div className="flex flex-col gap-4 lg:gap-6 justify-center w-full">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center lg:text-left"
                        >
                            <span className="inline-block px-3 py-1 bg-quest-accent/20 text-quest-text text-[10px] lg:text-xs font-bold rounded-full mb-2 lg:mb-3 uppercase tracking-wider">Definition</span>
                            <h1 className="text-2xl lg:text-4xl font-black text-quest-text leading-tight mb-3 lg:mb-4">What is a patent?</h1>
                            <div className="space-y-2 lg:space-y-3 text-sm lg:text-lg leading-relaxed text-quest-muted">
                                <p>
                                    A <span className="text-quest-primary font-bold">patent</span> is a legal right granted by a government to an inventor for a limited period, in exchange for the public disclosure of their invention.
                                </p>
                                <p className="hidden md:block">
                                    It gives the holder the exclusive right to exclude others from making, using, or selling the patented invention without permission.
                                </p>
                            </div>
                        </motion.div>

                        {/* Dark Blue Info Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="bg-quest-primary text-white p-3 lg:p-4 rounded-xl shadow-lg flex items-start gap-3 relative overflow-hidden group shrink-0"
                        >
                            <div className="bg-white/20 p-1 rounded-lg backdrop-blur-sm shrink-0">
                                <span className="material-symbols-outlined text-white text-xl lg:text-2xl">lightbulb</span>
                            </div>
                            <div className="relative z-10 flex-1">
                                <h4 className="font-bold text-base lg:text-lg mb-0.5 italic">Pro Tip</h4>
                                <p className="text-white/80 text-xs lg:text-sm leading-snug">
                                    Distinguish between a <span className="font-bold text-white underline decoration-quest-accent">Patent</span> (public disclosure) and a <span className="font-bold text-white underline decoration-quest-accent">Trade Secret</span> (kept hidden).
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Panel: Visual Examples & Guide */}
                    <div className="relative flex flex-col gap-4 lg:gap-6 items-center lg:items-end w-full min-h-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative flex justify-center w-full lg:w-auto shrink-0"
                        >
                            <div className="
  w-36 h-48
  sm:w-44 sm:h-56
  md:w-52 md:h-64
  lg:w-64 lg:h-80
  rounded-lg overflow-hidden
  bg-slate-200 border-2 border-white
  shadow-md relative z-10
">
                                <img
                                    alt="Professional female IP expert smiling"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnr7A_Z0p9xLNt8SuvwslwivOPcvj_d3C0YjzBtm0xFLCaNrWZ-sJnM-H7IHGwQisKvm9Eb0L0uZmLcq1VBVB5kztq5qAsId55k4yQSc-RmMaXdzpcOgqkOMaG9StUYI-XdwIouJMT-r6e_IxqhByYqPFVRcr9Ur65UkWW1LPb7x9vt0U8nBD3pAq67psqsd5s-HESj82qJ_npAwOZLzwrrsXRnIqX_whOb6m_izprXlCGCcWZaPYnDU6s0DvX1j4VWg23ysjzsoHj"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* <div className="absolute -bottom-2 -left-2 size-16 lg:size-24 bg-accent-green rounded-full -z-0 opacity-40"></div> */}
                        </motion.div>

                        {/* Pill Cards Container */}
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="w-full flex flex-wrap justify-center lg:justify-end gap-2 max-w-md py-2 overflow-y-visible"
                        >
                            {[
                                { icon: 'new_releases', text: 'Novelty' },
                                { icon: 'psychology', text: 'Non-Obvious' },
                                { icon: 'settings_suggest', text: 'Utility' },
                                { icon: 'description', text: 'Disclosure' }
                            ].map((pill, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={item}
                                    className="flex items-center gap-2 px-2.5 py-1 bg-quest-card rounded-full shadow-sm border border-quest-primary/10 hover:border-quest-primary hover:bg-quest-primary/5 transition-all cursor-default group shrink-0"
                                >
                                    <span className="material-symbols-outlined text-quest-primary text-xs lg:text-sm group-hover:scale-110 transition-transform">{pill.icon}</span>
                                    <span className="font-semibold text-quest-text text-[10px] lg:text-xs">{pill.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Slide2
