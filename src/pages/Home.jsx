import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ScrollReveal from '../components/ScrollReveal';
import { BookOpen, Trophy, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParallaxSection from '../components/ParallaxSection';

const Home = () => {
    return (
        <div className="flex flex-col">
            <Hero />

            {/* Section 1: Introduction */}
            <ParallaxSection
                title={
                    <>
                        Your Journey to <br />
                        <span className="text-gradient">IP Mastery</span> Starts Here
                    </>
                }
                description="Don't just learn about Intellectual Property—experience it. Our platform turns complex legal frameworks into an engaging quest."
                features={[
                    { icon: Zap, text: "Fast-paced interactive challenges" },
                    { icon: Users, text: "Join a community of innovators" },
                    { icon: Trophy, text: "Earn verifiable mastery badges" }
                ]}
                visualContent={
                    <div className="aspect-video bg-quest-card rounded-xl flex items-center justify-center border border-quest-text/5 mb-6 overflow-hidden">
                        <div className="p-8 text-center">
                            <Trophy className="w-16 h-16 text-quest-primary mx-auto mb-4 opacity-50" />
                            <p className="text-quest-muted font-mono text-sm">Interactive Preview Coming Soon</p>
                        </div>
                        {/* Simulation UI Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-sm">Module: Patents 101</h4>
                                <p className="text-[10px] text-quest-muted">Status: In Progress</p>
                            </div>
                            <div className="h-1.5 w-20 bg-quest-text/5 rounded-full overflow-hidden">
                                <div className="h-full bg-quest-primary w-2/3"></div>
                            </div>
                        </div>
                    </div>
                }
            />

            {/* Section 2: Gamification (Alternating) */}
            <ParallaxSection
                reversed={true}
                title={
                    <>
                        Gamified Learning <br />
                        <span className="text-gradient">Redefined</span>
                    </>
                }
                description="Forget boring lectures. Dive into a world where every lesson is a game, and every victory proves your knowledge."
                features={[
                    { icon: BookOpen, text: "Story-driven campaigns" },
                    { icon: Zap, text: "Instant feedback mechanisms" },
                    { icon: Trophy, text: "Compete on global leaderboards" }
                ]}
                visualContent={
                    <div className="aspect-[4/3] bg-quest-card rounded-xl relative overflow-hidden border border-quest-text/5 flex flex-col">
                        {/* Mock Leaderboard UI */}
                        <div className="p-4 border-b border-quest-text/5 flex justify-between items-center bg-quest-text/5">
                            <span className="font-bold text-sm">Top Innovators</span>
                            <Users className="w-4 h-4 text-quest-muted" />
                        </div>
                        <div className="p-4 space-y-3">
                            {[1, 2, 3].map((rank) => (
                                <div key={rank} className="flex items-center gap-3 p-2 bg-quest-text/5 rounded-lg">
                                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-quest-text/10'}`}>
                                        {rank}
                                    </div>
                                    <div className="h-2 w-24 bg-quest-text/10 rounded-full"></div>
                                    <div className="ml-auto h-2 w-8 bg-quest-primary/20 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            />

            <Features />

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <ScrollReveal variant="fade-up" className="container mx-auto px-4 text-center relative z-10">
                    <div className="glass-panel p-12 md:p-20 rounded-[3rem] border-quest-primary/20 overflow-hidden relative">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-quest-primary/10 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-quest-secondary/10 blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            Ready to Claim Your <br />
                            <span className="text-gradient">Innovator's Badge?</span>
                        </h2>
                        <p className="text-quest-muted text-xl mb-12 max-w-2xl mx-auto">
                            Join thousands of creators who are learning to protect their ideas through play.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/signup" className="btn-primary text-lg px-10 py-4 w-full sm:w-auto">
                                Get Started for Free
                            </Link>
                            <Link to="/modules" className="px-10 py-4 bg-quest-text/5 hover:bg-quest-text/10 border border-quest-text/10 rounded-xl transition-all font-bold w-full sm:w-auto">
                                Explore Modules
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
};

export default Home;
