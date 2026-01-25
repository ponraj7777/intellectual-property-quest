import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Lock, Search } from 'lucide-react';

const params = [
    {
        icon: Lock,
        title: "Patents",
        desc: "Understand how to protect your inventions and functional improvements from being copied.",
        color: "text-blue-400"
    },
    {
        icon: Search,
        title: "Trade Secrets",
        desc: "Learn the art of keeping confidential information secure within your organization.",
        color: "text-emerald-400"
    },
    {
        icon: Globe,
        title: "Trademarks",
        desc: "Explore how to distinguish your brand identity and products in the marketplace.",
        color: "text-purple-400"
    },
    {
        icon: Cpu,
        title: "Copyrights",
        desc: "Dive into protecting original works of authorship, from art to software code.",
        color: "text-rose-400"
    }
];

const Features = () => {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
                        Explore the Realm of <span className="text-gradient">IP Rights</span>
                    </h2>
                    <p className="text-quest-muted max-w-2xl mx-auto">
                        Our gamified modules break down complex legal concepts into bite-sized, interactive adventures.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {params.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-all group"
                        >
                            <div className={`p-4 rounded-xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-quest-muted text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
