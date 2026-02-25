import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-quest-card py-12 border-t border-quest-text/5 mt-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-2xl font-heading font-bold text-quest-text mb-2">IP Quest</h3>
                        <p className="text-quest-muted text-sm max-w-xs">
                            Gamified learning journey through the world of Intellectual Property Rights.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-quest-muted hover:text-quest-text transition-colors">Privacy</a>
                        <a href="#" className="text-quest-muted hover:text-quest-text transition-colors">Terms</a>
                        <a href="#" className="text-quest-muted hover:text-quest-text transition-colors">Contact</a>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-quest-text/5 text-center text-quest-muted text-xs">
                    © {new Date().getFullYear()} Intellectual Property Quest. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
