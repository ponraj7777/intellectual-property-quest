import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';

const Home = () => {
    return (
        <div className="space-y-20">
            <Hero />
            <Features />

            {/* Feature Sections will go here */}
            <section className="container mx-auto px-4">
                {/* Placeholder for Features */}
            </section>
        </div>
    );
};

export default Home;
