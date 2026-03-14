import React, { useState } from 'react';
import type { UserData, GlobalAchievement } from '../types';
import { LEVELS } from '../constants';
import { hexToPixel, getMedalColor, getBoardBoundingBox } from '../utils';
import { useLang } from '../i18n';
import HexMedal from '../components/HexMedal';
import CrownSvg from '../components/CrownSvg';
import BackButton from '../components/BackButton';
import { playClickSound } from '../audio';

interface StageSelectScreenProps {
    userData: UserData;
    globalStatus: GlobalAchievement;
    onSelect: (id: number) => void;
    onBack: () => void;
}

const StageSelectScreen: React.FC<StageSelectScreenProps> = ({ userData, globalStatus, onSelect, onBack }) => {
    const { t } = useLang();
    const [page, setPage] = useState(0);
    const stagesPerPage = 12; // 3x4 or 4x3 works better for grid
    const totalPages = Math.ceil(LEVELS.length / stagesPerPage);

    const stages = LEVELS.slice(page * stagesPerPage, (page + 1) * stagesPerPage);

    const [touchStart, setTouchStart] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        if (diff > 50 && page < totalPages - 1) {
            setPage(p => p + 1);
        } else if (diff < -50 && page > 0) {
            setPage(p => p - 1);
        }
        setTouchStart(null);
    };

    return (
        <div className="fixed inset-0 bg-stone-800 flex flex-col select-none touch-none text-white overflow-hidden">
            <div className="w-full flex flex-col h-full relative">
                <div className="p-4 md:p-6 bg-stone-900 border-b border-stone-700 flex justify-between items-center shadow-md z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <BackButton onClick={() => { playClickSound(); onBack(); }} />
                        <h2 className="text-xl md:text-2xl font-black italic uppercase flex items-center gap-2">
                            {globalStatus && <CrownSvg status={globalStatus} size={24} className="animate-pulse-glow" />}
                            {t('stages')}
                        </h2>
                    </div>
                </div>

                <div
                    className="flex-1 overflow-y-auto w-full relative group"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Desktop Navigation Arrows */}
                    {page > 0 && (
                        <button
                            onClick={() => { playClickSound(); setPage(p => p - 1); }}
                            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-stone-900/50 hover:bg-stone-900/80 border border-stone-700 rounded-full transition-all text-white/50 hover:text-white"
                            aria-label="Previous page"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    {page < totalPages - 1 && (
                        <button
                            onClick={() => { playClickSound(); setPage(p => p + 1); }}
                            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-stone-900/50 hover:bg-stone-900/80 border border-stone-700 rounded-full transition-all text-white/50 hover:text-white"
                            aria-label="Next page"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full px-12 md:px-16">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-4 pb-4">
                            {stages.map((level) => {
                                const status = userData.stageProgress[level.id];
                                const isCleared = !!status?.cleared;
                                const medalColor = getMedalColor(status?.bestMoves || null, level.excellentMoves, level.goodMoves);

                                return (
                                    <button
                                        key={level.id}
                                        onClick={() => { playClickSound(); onSelect(level.id); }}
                                        className={`bg-stone-900 rounded-2xl p-4 border border-stone-700 flex flex-col items-center justify-between hover:border-amber-500 transition-all hover:-translate-y-1 active:scale-95 group/btn ${!isCleared ? 'opacity-90' : 'shadow-[0_0_15px_rgba(0,0,0,0.3)]'}`}
                                    >
                                        <div className="flex justify-between w-full items-start">
                                            <span className={`text-xl font-black italic transition-colors ${isCleared ? 'text-amber-500/50' : 'text-stone-600'}`}>#{level.id + 1}</span>
                                            <HexMedal color={medalColor} size={10} />
                                        </div>

                                        {/* Thumbnail Preview Area */}
                                        <div className={`w-full h-16 flex items-center justify-center transition-all duration-300 ${isCleared ? 'opacity-60 grayscale-0 brightness-110' : 'opacity-40 grayscale brightness-75 group-hover/btn:opacity-100 group-hover/btn:grayscale-0 group-hover/btn:brightness-110'}`}>
                                            <svg viewBox={getBoardBoundingBox(level.layout, 12, 4).viewBox} className="w-full h-full max-w-[80%] max-h-[100%]">
                                                {level.layout.map((p, j) => {
                                                    const { x, y } = hexToPixel(p.q, p.r, 12);
                                                    const pts = Array.from({ length: 6 }).map((_, k) => {
                                                        const a = (Math.PI / 180) * (60 * k + 30);
                                                        return `${x + 12 * Math.cos(a)},${y + 12 * Math.sin(a)}`;
                                                    }).join(' ');
                                                    return <polygon key={j} points={pts} fill={isCleared ? "#444" : "#333"} stroke={isCleared ? "#666" : "#444"} strokeWidth={1} />;
                                                })}
                                            </svg>
                                        </div>

                                        <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 truncate w-full text-center transition-colors ${isCleared ? 'text-stone-300' : 'text-stone-500'}`}>
                                            {level.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 bg-stone-900 border-t border-stone-800 flex flex-col items-center justify-center gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] shrink-0 z-10">
                        <div className="flex gap-3">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { playClickSound(); setPage(i); }}
                                    className={`w-3 h-3 rounded-full transition-all cursor-pointer ${i === page ? 'bg-amber-500 scale-125' : 'bg-stone-600 hover:bg-stone-500'}`}
                                    aria-label={`Go to page ${i + 1}`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{t('stages')} {page + 1} / {totalPages}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StageSelectScreen;
