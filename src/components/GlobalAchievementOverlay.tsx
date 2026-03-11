import React, { useEffect, useState } from 'react';
import type { GlobalAchievement } from '../types';
import CrownSvg from './CrownSvg';

interface GlobalAchievementOverlayProps {
    status: GlobalAchievement;
    onClose: () => void;
}

const GlobalAchievementOverlay: React.FC<GlobalAchievementOverlayProps> = ({ status, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Slightly delay the animation so it pops after the stage clear overlay
        const t1 = setTimeout(() => setVisible(true), 500);
        return () => clearTimeout(t1);
    }, []);

    if (!status) return null;

    const rankText = {
        gold: 'PERFECT GOLD MASTER!',
        silver: 'SILVER MASTER!',
        bronze: 'ALL STAGES CLEARED!'
    };
    
    const rankColor = {
        gold: 'text-amber-400',
        silver: 'text-stone-300',
        bronze: 'text-amber-600'
    };

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ${visible ? 'bg-black/90 backdrop-blur-lg opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}>
            {visible && (
                <div className="relative flex flex-col items-center animate-pop-in border-4 border-amber-500/20 p-12 rounded-[3rem] bg-stone-900/50 shadow-[0_0_100px_rgba(251,191,36,0.1)]">
                    
                    {/* Particles simulation with CSS (simplified) */}
                    <div className="absolute inset-0 overflow-hidden rounded-[3rem] pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} 
                                 className="absolute w-2 h-2 bg-white rounded-full opacity-0 animate-float"
                                 style={{ 
                                     left: `${5 + Math.random() * 90}%`, 
                                     top: `${50 + Math.random() * 50}%`,
                                     animationDelay: `${Math.random() * 2}s`,
                                     animationDuration: `${2 + Math.random() * 3}s`,
                                     backgroundColor: ['#fbbf24', '#f3f4f6', '#f59e0b', '#fff'][Math.floor(Math.random() * 4)]
                                 }}
                            />
                        ))}
                    </div>

                    <div className="z-10 flex flex-col items-center">
                        <div className="mb-8 animate-pulse-glow">
                            <CrownSvg status={status} size={150} />
                        </div>
                        <h2 className={`text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-center drop-shadow-2xl ${rankColor[status]}`}>
                            {rankText[status]}
                        </h2>
                        <p className="text-white/70 font-bold tracking-widest uppercase mb-12 text-sm md:text-base">
                            Congratulations!
                        </p>
                        <button 
                            onClick={onClose}
                            className="px-10 py-4 bg-stone-800 text-white font-black text-xl rounded-full active:scale-95 transition-all uppercase italic border-2 border-stone-600 hover:bg-stone-700 hover:border-white/50 shadow-2xl"
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalAchievementOverlay;
