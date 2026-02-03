import React from 'react';

const MeshBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-quest-dark">
            <div className="absolute inset-0 opacity-40">
                {/* Aurora Blobs - Earthy Tones */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-quest-primary blur-[120px] rounded-full animate-aurora-slow opacity-30"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-quest-accent blur-[120px] rounded-full animate-aurora-medium opacity-20"></div>
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-quest-primary blur-[120px] rounded-full animate-aurora-slow opacity-20"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-quest-accent blur-[120px] rounded-full animate-aurora-medium opacity-20"></div>
            </div>

            {/* Fine Noise Texture for extra premium feel */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-quest-dark via-transparent to-quest-dark opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-quest-dark via-transparent to-quest-dark opacity-60"></div>
        </div>
    );
};

export default MeshBackground;
