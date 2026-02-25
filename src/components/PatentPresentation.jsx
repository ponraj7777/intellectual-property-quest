import React from 'react';
import { X } from 'lucide-react';
import SlideContainer from '../Patentslide/components/SlideContainer';

const PatentPresentation = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Close Button overlay (always available) */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="fixed top-6 right-6 z-[200] p-2 bg-quest-card/50 backdrop-blur-md hover:bg-quest-card rounded-full text-quest-text transition-all shadow-lg border border-quest-primary/20"
                >
                    <X className="w-6 h-6" />
                </button>
            )}

            {/* New SlideContainer handles all slides, navigation, and animations */}
            <SlideContainer />
        </div>
    );
};

export default PatentPresentation;
