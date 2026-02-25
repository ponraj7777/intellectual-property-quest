import { motion } from 'framer-motion'

const Slide4 = ({ currentSlide, totalSlides }) => {
    return (
        <div className="relative flex h-full w-full flex-col overflow-x-hidden bg-quest-dark">
            {/* Top Navigation Bar */}
            {/* <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-20 bg-white/80 backdrop-blur-md sticky top-0 z-50"
            >
                <div className="flex items-center gap-4">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-xl">account_tree</span>
                    </div>
                    <h2 className="text-primary text-lg font-bold leading-tight tracking-tight">Onboarding Guide</h2>
                </div>
                <div className="flex items-center gap-8">
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-primary/70 hover:text-primary text-sm font-semibold transition-colors" href="#">Overview</a>
                        <a className="text-primary text-sm font-bold border-b-2 border-primary pb-1" href="#">Steps</a>
                        <a className="text-primary/70 hover:text-primary text-sm font-semibold transition-colors" href="#">Resources</a>
                    </nav>
                    <div className="flex gap-3">
                        <button className="flex size-10 items-center justify-center rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="flex size-10 items-center justify-center rounded-full bg-primary text-white hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined">person</span>
                        </button>
                    </div>
                </div>
            </motion.header> */}

            <main className="flex-1 overflow-hidden flex flex-col items-center justify-center px-4 lg:px-20 py-4 lg:py-6 no-scrollbar">
                <div className="w-full max-w-7xl flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center min-h-0">
                    {/* Left Side: Guide & Step Indicator */}
                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-4 lg:space-y-6 shrink-0 w-full">
                        <div className="mb-4 self-center lg:self-start">
                            <p className="text-quest-primary font-bold text-[10px] lg:text-xs tracking-widest uppercase">Slide {currentSlide} of {totalSlides}</p>
                        </div>

                        {/* Human Guide Portrait */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="relative w-full max-w-[240px] lg:max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden bg-quest-primary/10 shadow-xl border-4 border-quest-card shrink-0"
                        >
                            <img alt="Professional human guide" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKpHza0YGEwY8-Aa0A2t3wBDRyj7MTGM8GhvqXS_PyieL3UbD2rNxebJ6fQbLkEG1_3IFnJKH0Mz1fOAkDHLrQ3CAcghqPzKPXVEp3_BCGurmZVbviJ7YjwMBhZ-csU9n54xoa7yTNkcA0h-z9rf0H8gnlohKdR5Bw-5i_jck5jhir_19sRovG46REuR-lRirLT5eW_RGiKXcVBs35pwTC8HCVU6mHnmD_IGMsIGom41aapCncMKcWwLAwU318iKQNBNUlH2dJkfBr" />
                            <div className="absolute bottom-3 left-3 right-3 p-1.5 lg:p-2 bg-quest-card/90 backdrop-blur-sm rounded-lg border border-quest-primary/10">
                                <p className="text-quest-primary font-bold text-xs lg:text-sm">Sarah Jenkins</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Content & Checklist */}
                    <div className="lg:col-span-7 space-y-4 lg:space-y-6 min-h-0 py-2 lg:py-4 w-full text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-1 lg:space-y-2 shrink-0"
                        >
                            <h1 className="text-3xl lg:text-5xl font-black text-quest-text leading-tight tracking-tighter">
                                Lifecycle of an <br />
                                <span className="text-quest-primary">Invention</span>
                            </h1>
                            <p className="text-base lg:text-lg text-quest-muted max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
                                Establish a baseline and secure the environment through a structured filing roadmap.
                            </p>
                        </motion.div>

                        {/* Checklist items */}
                        <div className="space-y-2 lg:space-y-3">
                            {[
                                { text: 'Discovery and disclosure documentation', completed: true },
                                { text: 'Comprehensive prior art search', completed: true },
                                { text: 'Specification and claims drafting', completed: false }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                    className={`flex items-center gap-3 p-2.5 lg:p-3 pl-4 lg:pl-5 rounded-full border transition-all cursor-default ${item.completed ? 'bg-quest-primary/10 border-quest-primary/20' : 'bg-quest-card border-quest-primary/5 shadow-sm'}`}
                                >
                                    <div className={`flex size-5 lg:size-6 shrink-0 items-center justify-center rounded-full ${item.completed ? 'bg-quest-primary text-white' : 'border-2 border-quest-primary/20 text-quest-primary/20'}`}>
                                        <span className={`material-symbols-outlined text-[10px] lg:text-xs ${item.completed ? '' : 'opacity-0'}`}>done_all</span>
                                    </div>
                                    <p className="text-quest-text font-bold text-sm lg:text-base text-left">{item.text}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quote box */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="p-4 lg:p-6 rounded-2xl bg-quest-accent/20 border border-quest-accent/30 relative overflow-hidden group shrink-0"
                        >
                            <div className="relative z-10 flex gap-3 lg:gap-4 items-start text-left">
                                <div className="flex size-8 lg:size-10 shrink-0 items-center justify-center rounded-lg bg-quest-primary text-white shadow-md">
                                    <span className="material-symbols-outlined text-lg lg:text-xl">lightbulb</span>
                                </div>
                                <div className="space-y-0.5 lg:space-y-1">
                                    <p className="text-quest-text font-bold text-base lg:text-lg leading-snug">Expert Insight</p>
                                    <p className="text-quest-muted text-xs lg:text-sm italic leading-relaxed">
                                        "A strong claim is the foundation of enforceable patent protection."
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Slide4
