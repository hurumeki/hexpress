import { useState, useEffect, useMemo } from 'react';
import type { ScreenMode, UserData } from './types';
import { LEVELS, STORAGE_KEY } from './constants';
import BackButton from './components/BackButton';
import ConfirmPopup from './components/ConfirmPopup';
import StageSelectScreen from './screens/StageSelectScreen';
import GameScreen from './screens/GameScreen';

// --- メインアプリ ---

function App() {
    const [screen, setScreen] = useState<ScreenMode>('TITLE');
    const [userData, setUserData] = useState<UserData>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {
            soundEnabled: true,
            adsEnabled: true,
            stageProgress: {},
            lastActiveLevelId: null
        };
    });

    const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }, [userData]);

    const activeLevel = useMemo(() => LEVELS.find(l => l.id === currentLevelId), [currentLevelId]);

    const updateStageProgress = (levelId: number, moves: number) => {
        setUserData(prev => {
            const current = prev.stageProgress[levelId];
            const best = (current && current.bestMoves !== null) ? Math.min(current.bestMoves, moves) : moves;
            return {
                ...prev,
                stageProgress: {
                    ...prev.stageProgress,
                    [levelId]: { cleared: true, bestMoves: best }
                },
                lastActiveLevelId: levelId
            };
        });
    };

    const clearAllData = () => {
        const fresh: UserData = {
            soundEnabled: true,
            adsEnabled: true,
            stageProgress: {},
            lastActiveLevelId: null
        };
        setUserData(fresh);
    };

    const handleContinue = () => {
        const last = userData.lastActiveLevelId;
        if (last === null) {
            setCurrentLevelId(0);
        } else {
            const lastStatus = userData.stageProgress[last];
            if (lastStatus && lastStatus.cleared && last < LEVELS.length - 1) {
                setCurrentLevelId(last + 1);
            } else {
                setCurrentLevelId(last);
            }
        }
        setScreen('GAME');
    };

    const selectLevel = (id: number) => {
        setCurrentLevelId(id);
        setScreen('GAME');
    };

    // --- 各画面のレンダリング ---

    if (screen === 'TITLE') {
        const hasData = Object.keys(userData.stageProgress).length > 0;
        return (
            <div className="min-h-screen bg-stone-700 flex flex-col items-center justify-center p-4 select-none touch-none text-white">
                <div className="w-full max-w-md bg-stone-800 rounded-3xl shadow-2xl border border-stone-600 overflow-hidden p-8 flex flex-col items-center">
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">HEXA SLIDE</h1>
                    <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-12">Puzzle Odyssey</p>

                    <div className="flex flex-col gap-4 w-full">
                        <button
                            onClick={() => hasData ? handleContinue() : selectLevel(0)}
                            className="w-full py-5 bg-amber-500 text-black font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic"
                        >
                            {hasData ? 'Continue' : 'Start'}
                        </button>
                        <button
                            onClick={() => setScreen('STAGE_SELECT')}
                            className="w-full py-5 bg-stone-700 text-white font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic border border-stone-600"
                        >
                            Stage Select
                        </button>
                        <button
                            onClick={() => setScreen('SETTINGS')}
                            className="w-full py-5 bg-stone-700 text-white font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic border border-stone-600"
                        >
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (screen === 'SETTINGS') {
        return (
            <div className="min-h-screen bg-stone-700 flex flex-col items-center justify-center p-4 select-none touch-none text-white">
                <div className="w-full max-w-md bg-stone-800 rounded-3xl shadow-2xl border border-stone-600 overflow-hidden flex flex-col">
                    <div className="p-6 bg-stone-900 border-b border-stone-700 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <BackButton onClick={() => setScreen('TITLE')} />
                            <h2 className="text-2xl font-black italic uppercase">Settings</h2>
                        </div>
                    </div>
                    <div className="p-8 flex flex-col gap-8">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold uppercase italic tracking-tight">Sound Effects</span>
                            <button
                                onClick={() => setUserData(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                                className={`w-16 h-8 rounded-full relative transition-colors ${userData.soundEnabled ? 'bg-amber-500' : 'bg-stone-600'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${userData.soundEnabled ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold uppercase italic tracking-tight">Show Ads</span>
                            <button
                                onClick={() => setUserData(prev => ({ ...prev, adsEnabled: !prev.adsEnabled }))}
                                className={`w-16 h-8 rounded-full relative transition-colors ${userData.adsEnabled ? 'bg-amber-500' : 'bg-stone-600'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${userData.adsEnabled ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="pt-8 border-t border-stone-700">
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="w-full py-4 bg-red-900/50 text-red-200 font-bold rounded-xl border border-red-800 hover:bg-red-900 active:scale-95 transition-all uppercase tracking-tighter"
                            >
                                Erase Play Data
                            </button>
                        </div>
                    </div>
                </div>
                {showClearConfirm && (
                    <ConfirmPopup
                        message={"プレイデータをすべて削除してもよろしいですか？\nこの操作は取り消せません。"}
                        onConfirm={() => {
                            clearAllData();
                            setShowClearConfirm(false);
                        }}
                        onCancel={() => setShowClearConfirm(false)}
                    />
                )}
            </div>
        );
    }

    if (screen === 'STAGE_SELECT') {
        return <StageSelectScreen userData={userData} onSelect={selectLevel} onBack={() => setScreen('TITLE')} />;
    }

    if (screen === 'GAME' && activeLevel) {
        return (
            <GameScreen
                level={activeLevel}
                bestMoves={userData.stageProgress[activeLevel.id]?.bestMoves || null}
                onClear={(moves) => updateStageProgress(activeLevel.id, moves)}
                onExit={() => setScreen('STAGE_SELECT')}
            />
        );
    }

    return null;
}

export default App;
