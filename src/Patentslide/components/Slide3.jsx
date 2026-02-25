import { motion } from 'framer-motion'

const Slide3 = ({ currentSlide, totalSlides }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.5
            }
        }
    }

    const card = {
        hidden: { opacity: 0, x: 30 },
        show: { opacity: 1, x: 0 }
    }

    return (
        <div className="relative flex h-full w-full flex-col overflow-x-hidden bg-quest-dark">
            <div className="layout-container flex h-full grow flex-col">
                {/* Navigation Header */}
                {/* <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between px-6 py-6 lg:px-20 border-b border-slate-200 dark:border-slate-800"
                >
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">map</span>
                        </div>
                        <h2 className="text-primary dark:text-slate-100 text-xl font-bold tracking-tight">GeoShield EMS</h2>
                    </div>
                    <div className="hidden md:flex items-center gap-10">
                        {['Overview', 'Analytics', 'Reporting'].map((link) => (
                            <a key={link} className="text-slate-600 dark:text-slate-400 text-sm font-semibold hover:text-primary dark:hover:text-white transition-colors" href="#">{link}</a>
                        ))}
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">person</span>
                        </div>
                    </div>
                </motion.header> */}

                <main className="flex-1 overflow-hidden flex flex-col lg:flex-row items-stretch px-4 lg:px-20 py-4 lg:py-6 gap-6 lg:gap-16 no-scrollbar">
                    {/* Left Section: Human Guide */}
                    <div className="w-full lg:w-1/3 flex flex-col justify-center items-center text-center lg:text-left space-y-4 lg:space-y-6 shrink-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: -50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "backOut" }}
                            className="relative shrink-0 flex justify-center w-full"
                        >

                            <div className="mb-4 text-center lg:text-left">
                                <p className="text-quest-primary font-bold text-[10px] lg:text-xs tracking-widest uppercase">Slide {currentSlide} of {totalSlides}</p>
                            </div>
                            <div className="relative w-40 h-52 lg:w-64 lg:h-80 overflow-hidden rounded-xl border-4 border-quest-card shadow-xl">
                                <img alt="Professional guide smiling" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTguM14KWM-B89SndViNN84MhGiBf-KSlKC91kxsOUKoBp8yJ4Ftlrahr8EHfpQAuLJM6vU2D0a7sY154VPgQBqg-kB5FCerhCoXCT_4FpNNj-vqK4DWBYZc5dFEJoHYjW3SH-4FzLNpXUbc4mTPl6n4Bs2qOn8ENTIrAPU4RojGI4M5kJYN4AyK7JL-q9GiIzLLnE5yjVzwHJ2khxXjxKcLnDm66QPqviFPchrZGSfeLLXXfI_SXwomeJvW-tD05HJCq0Vs6vT89I" />
                            </div>
                        </motion.div>
                        {/* <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="space-y-0.5 lg:space-y-1 shrink-0"
                        >
                            <p className="text-primary font-bold text-sm lg:text-base">Sarah Jenkins</p>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs">Strategic Operations Lead</p>
                        </motion.div> */}
                    </div>

                    {/* Right Section: Content & Benefits Grid */}
                    <div className="w-full lg:w-2/3 flex flex-col justify-center space-y-6 lg:space-y-8 min-h-0 py-2 lg:py-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-2 lg:space-y-3 max-w-2xl shrink-0 text-center lg:text-left"
                        >
                            <h1 className="text-quest-primary text-2xl lg:text-4xl font-extrabold leading-tight tracking-tight">
                                Why is patent protection essential?
                            </h1>
                            <p className="text-quest-muted text-sm lg:text-base leading-relaxed">
                                Strategic intellectual property management transforms your innovations into valuable legal assets and market advantages.
                            </p>
                        </motion.div>

                        {/* Benefit Pills Grid */}
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3 overflow-y-visible"
                        >
                            {[
                                { title: 'Competitive Edge', desc: 'Exclude market copycats.', icon: 'military_tech' },
                                { title: 'Revenue Streams', desc: 'Licensing opportunities.', icon: 'payments' },
                                { title: 'Asset Valuation', desc: 'Attract investor interest.', icon: 'trending_up' },
                                { title: 'Legal Security', desc: 'Secure technical claims.', icon: 'gavel' }
                            ].map((benefit, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={card}
                                    className="group flex items-center gap-3 p-2 lg:p-3 rounded-full bg-quest-card border border-quest-primary/10 shadow-sm transition-all hover:bg-quest-primary/5 hover:border-quest-primary/30"
                                >
                                    <div className="size-8 lg:size-10 flex-shrink-0 rounded-full bg-quest-primary/10 flex items-center justify-center text-quest-primary group-hover:bg-quest-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined !text-lg lg:!text-xl">{benefit.icon}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-xs lg:text-sm text-quest-text truncate">{benefit.title}</h3>
                                        <p className="text-[9px] lg:text-[10px] text-quest-muted truncate">{benefit.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </main>

                {/* Footer Decorative Element */}
                {/* <footer className="px-6 lg:px-20 py-8 text-slate-400 text-xs flex justify-between border-t border-slate-200 dark:border-slate-800">
                    <p>© 2024 GeoShield Intelligence. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Compliance</a>
                    </div>
                </footer> */}
            </div>
        </div>
    )
}

export default Slide3
