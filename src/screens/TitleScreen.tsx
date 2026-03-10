import React, { useMemo } from 'react';
import { useLang } from '../i18n';
import type { UserData } from '../types';

interface TitleScreenProps {
    userData: UserData;
    onContinue: () => void;
    onStart: () => void;
    onStageSelect: () => void;
    onSettings: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({
    userData,
    onContinue,
    onStart,
    onStageSelect,
    onSettings,
}) => {
    const { t } = useLang();
    const hasData = Object.keys(userData.stageProgress).length > 0;

    // 背景のヘキサゴンを安定させるためのメモ化
    const backgroundHexes = useMemo(() => {
        return [...Array(6)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: 60 + Math.random() * 120,
            rotate: Math.random() * 60,
            floatDuration: 5 + Math.random() * 5,
            floatDelay: -Math.random() * 10,
            rotateDuration: 15 + Math.random() * 15,
        }));
    }, []);

    return (
        <div className="fixed inset-0 bg-stone-900 flex flex-col items-center justify-center select-none touch-none text-white overflow-hidden">
            {/* 背景の装飾的なヘキサゴン */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {backgroundHexes.map((hex, i) => (
                    <div key={i} className="absolute bg-stone-800/50 border border-amber-500/20 animate-float animate-rotate-slow"
                        style={{
                            top: hex.top,
                            left: hex.left,
                            width: `${hex.size}px`,
                            height: `${hex.size}px`,
                            '--float-duration': `${hex.floatDuration}s`,
                            '--float-delay': `${hex.floatDelay}s`,
                            '--rotate-duration': `${hex.rotateDuration}s`,
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 max-w-md mx-auto relative z-10">
                <div className="flex-1 flex flex-col items-center justify-center w-full mt-4">
                    {/* 六角形ロゴ */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center mb-6">
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">
                            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="#f59e0b" strokeWidth="4" />
                            <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" fill="none" stroke="#a8a29e" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                            <polygon points="50,25 75,40 75,60 50,75 25,60 25,40" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1" opacity="0.8" />
                        </svg>
                        <div className="absolute w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_#fbd38d]"></div>
                    </div>

                    {/* タイトルロゴ部分 */}
                    <div className="relative mb-2 w-full text-center">
                        <h1 className="text-[12vw] sm:text-6xl md:text-7xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-white to-stone-400 drop-shadow-lg leading-tight">
                            HEXPRESS
                        </h1>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500/10 blur-2xl -z-10 rounded-[100%] w-full h-full"></div>
                    </div>

                    {/* コンセプチュアルな装飾ライン（文字なし） */}
                    <div className="flex items-center gap-3 w-full max-w-[200px] opacity-70 mt-2">
                        <div className="h-px bg-gradient-to-r from-transparent via-amber-500 to-amber-500 flex-1"></div>
                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                        <div className="h-px bg-gradient-to-l from-transparent via-amber-500 to-amber-500 flex-1"></div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full mt-auto mb-8">
                    <button onClick={() => hasData ? onContinue() : onStart()}
                        className="w-full py-5 bg-amber-500 text-stone-900 font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-pulse-glow">
                        {hasData ? t('continue') : t('start')}
                    </button>
                    <button onClick={onStageSelect}
                        className="w-full py-5 bg-stone-800 text-stone-200 font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic border border-stone-700 shadow-lg hover:bg-stone-700">
                        {t('stageSelect')}
                    </button>
                    <button onClick={onSettings}
                        className="w-full py-5 bg-stone-800 text-stone-200 font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic border border-stone-700 shadow-lg hover:bg-stone-700">
                        {t('settings')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TitleScreen;
