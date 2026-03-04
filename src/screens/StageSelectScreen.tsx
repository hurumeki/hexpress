import React, { useState } from 'react';
import type { UserData } from '../types';
import { LEVELS } from '../constants';
import { hexToPixel, getMedalColor, getBoardBoundingBox } from '../utils';
import { useLang } from '../i18n';
import HexMedal from '../components/HexMedal';
import BackButton from '../components/BackButton';

interface StageSelectScreenProps {
    userData: UserData;
    onSelect: (id: number) => void;
    onBack: () => void;
}

const StageSelectScreen: React.FC<StageSelectScreenProps> = ({ userData, onSelect, onBack }) => {
    const { t } = useLang();
    const [page, setPage] = useState(0);
    const stagesPerPage = 10;
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
        <div className="min-h-screen bg-stone-700 flex flex-col items-center justify-center p-4 select-none touch-none text-white">
            <div className="w-full max-w-md bg-stone-800 rounded-3xl shadow-2xl border border-stone-600 overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 bg-stone-900 border-b border-stone-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BackButton onClick={onBack} />
                        <h2 className="text-2xl font-black italic uppercase">{t('stages')}</h2>
                    </div>
                </div>

                <div
                    className="flex-1 p-6 relative flex flex-col overflow-y-auto"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="grid grid-cols-2 auto-rows-fr gap-4 pb-4">
                        {stages.map((level) => {
                            const status = userData.stageProgress[level.id];
                            const medalColor = getMedalColor(status?.bestMoves || null, level.excellentMoves, level.goodMoves);

                            return (
                                <button
                                    key={level.id}
                                    onClick={() => onSelect(level.id)}
                                    className="bg-stone-900 rounded-2xl p-4 border border-stone-700 flex flex-col items-center justify-between hover:border-amber-500 transition-all active:scale-95"
                                >
                                    <div className="flex justify-between w-full items-start">
                                        <span className="text-xl font-black italic text-stone-500">#{level.id + 1}</span>
                                        <HexMedal color={medalColor} size={10} />
                                    </div>

                                    {/* Thumbnail Preview Area */}
                                    <div className="w-full h-16 flex items-center justify-center opacity-40">
                                        <svg viewBox={getBoardBoundingBox(level.layout, 12, 4).viewBox} className="w-full h-full max-w-[80%] max-h-[100%]">
                                            {level.layout.map((p, j) => {
                                                const { x, y } = hexToPixel(p.q, p.r, 12);
                                                const pts = Array.from({ length: 6 }).map((_, k) => {
                                                    const a = (Math.PI / 180) * (60 * k + 30);
                                                    return `${x + 12 * Math.cos(a)},${y + 12 * Math.sin(a)}`;
                                                }).join(' ');
                                                return <polygon key={j} points={pts} fill="#333" stroke="#555" strokeWidth={1} />;
                                            })}
                                        </svg>
                                    </div>

                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-2 truncate w-full text-center">
                                        {level.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 bg-stone-900 flex justify-center gap-4">
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-stone-800 rounded-lg disabled:opacity-30">←</button>
                        <span className="flex items-center font-bold text-stone-500 tracking-widest">{page + 1} / {totalPages}</span>
                        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-stone-800 rounded-lg disabled:opacity-30">→</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StageSelectScreen;
