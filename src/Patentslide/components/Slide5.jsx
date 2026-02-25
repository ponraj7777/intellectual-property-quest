import { motion } from 'framer-motion'
import slide5Image from '../../assets/slide5img.png';
const Slide5 = ({ currentSlide, totalSlides }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5
            }
        }
    }

    const cardVariant = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: { opacity: 1, scale: 1, y: 0 }
    }

    return (
        <div className="relative flex h-full w-full flex-col overflow-x-hidden bg-quest-dark">
            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                {/* <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-6 md:px-10 py-3 sticky top-0 z-50"
                >
                    <div className="flex items-center gap-4 text-primary dark:text-slate-100">
                        <div className="size-6 flex items-center justify-center bg-primary text-white rounded">
                            <span className="material-symbols-outlined !text-sm">map</span>
                        </div>
                        <h2 className="text-primary dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Presentation App</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8 items-center">
                        <nav className="hidden md:flex items-center gap-9">
                            {['Dashboard', 'Slides', 'Resources'].map((link) => (
                                <a key={link} className={`${link === 'Slides' ? 'text-primary dark:text-white font-bold border-b-2 border-primary' : 'text-slate-600 dark:text-slate-400 font-medium hover:text-primary'} text-sm transition-colors`} href="#">{link}</a>
                            ))}
                        </nav>
                        <div className="flex gap-2">
                            {['settings', 'help'].map((icon) => (
                                <button key={icon} className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    <span className="material-symbols-outlined">{icon}</span>
                                </button>
                            ))}
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBm71xy5U_ZF4MTRIflFY5r_Fpy4MZ7C8Ja9eh7Zk_6Mj5ySSeUrlLQgdtXqn3CkgJC5oNmEvULopF9JQezgEjRfBUtEo9wuJxVlVFUYFDExfboBxflcl86RURrJVxb11sg5hfmZEQlKC5w0hiRsP84Ow75bhYZy4lpigvf6waGlQtdG8tnSYwSIGEVOURtFKGGOLMXoHWUTjZYOyECY4LdCIPtwfWQKxdVQxhc0_i0G_RimXIUgPbUVpE1V-KaZoK7I5suUhAkBHXr")' }}></div>
                    </div>
                </motion.header> */}

                <main className="flex-1 overflow-hidden max-w-7xl mx-auto w-full px-4 lg:px-10 py-4 lg:py-6 flex flex-col gap-4 lg:gap-6 no-scrollbar">
                    {/* Slide Header Section */}
                    <div className="flex flex-col gap-2 lg:gap-3 shrink-0">
                        <div className="flex items-end justify-between">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="w-full text-center lg:text-left"
                            >
                                <p className="text-quest-primary font-bold text-[10px] lg:text-xs tracking-widest uppercase mb-1">Slide {currentSlide} of {totalSlides}</p>
                                <h1 className="text-quest-text text-2xl lg:text-4xl font-black leading-tight tracking-tight">Your IP Asset Portfolio</h1>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="h-1 lg:h-1.5 w-full bg-quest-primary rounded-full shadow-sm origin-left"
                        ></motion.div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 flex-1 min-h-0">
                        {/* Left Side: Cards Grid */}
                        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0 order-2 lg:order-1">
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"
                            >
                                {[
                                    { title: 'Patentability Search', desc: 'Assessing novelty and non-obviousness.' },
                                    { title: 'Spec Drafting', desc: 'Detailed technical description of invention.' },
                                    { title: 'Claims Creation', desc: 'Defining the legal boundaries of protection.' },
                                    { title: 'IDS Filing', desc: 'Disclosing known prior art to the office.' },
                                    { title: 'Office Actions', desc: 'Navigating the examination response phase.' },
                                    { title: 'Grant & Renewals', desc: 'Securing rights and managing maintenance.' }
                                ].map((card, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={cardVariant}
                                        whileHover={{ scale: 1.05, translateY: -2 }}
                                        className="relative bg-quest-card p-4 lg:p-5 rounded-lg shadow-sm border border-quest-primary/10"
                                    >
                                        <div className="absolute -top-2 -left-2 size-6 lg:size-7 bg-quest-primary text-white rounded-full flex items-center justify-center font-bold text-[10px] lg:text-xs border-2 border-quest-dark">{idx + 1}</div>
                                        <h3 className="text-quest-text font-bold text-sm lg:text-base mb-1">{card.title}</h3>
                                        <p className="text-quest-muted text-[9px] lg:text-[10px] leading-relaxed line-clamp-2">{card.desc}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right Side: Human Guide */}
                        <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end min-h-0 order-1 lg:order-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="relative group shrink-0"
                            >
                                <div className="relative size-36 lg:size-64 rounded-full overflow-hidden border-4 border-quest-primary/10 shadow-xl">
                                    <img alt="Guide" className="w-full h-full object-cover" src={slide5Image} />
                                </div>
                                {/* Speech Bubble */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 }}
                                    className="absolute -top-2 lg:-top-4 -right-4 lg:-right-8 bg-quest-card p-2 lg:p-3 rounded-lg shadow-lg border border-quest-primary/10 max-w-[120px] lg:max-w-[150px]"
                                >
                                    <p className="text-[8px] lg:text-[10px] text-quest-text font-medium italic leading-snug">"This portfolio transforms ideas into enforceable legal assets."</p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Slide5
