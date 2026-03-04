import { useState, useEffect, useMemo } from 'react';
import type { ScreenMode, UserData } from './types';
import { LEVELS, STORAGE_KEY } from './constants';
import { DEFAULT_LANG, LangContext, translations, useLang, type Lang } from './i18n';
import BackButton from './components/BackButton';
import ConfirmPopup from './components/ConfirmPopup';
import StageSelectScreen from './screens/StageSelectScreen';
import GameScreen from './screens/GameScreen';

// --- 設定画面 ---
function SettingsScreen({ userData, setUserData, onBack }: {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
    onBack: () => void;
}) {
    const { t, lang, setLang } = useLang();
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const ToggleRow = ({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) => (
        <div className="flex justify-between items-center">
            <span className="text-xl font-bold uppercase italic tracking-tight">{label}</span>
            <button onClick={onToggle} className={`w-16 h-8 rounded-full relative transition-colors ${value ? 'bg-amber-500' : 'bg-stone-600'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${value ? 'right-1' : 'left-1'}`} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-700 flex flex-col items-center justify-center p-4 select-none touch-none text-white">
            <div className="w-full max-w-md bg-stone-800 rounded-3xl shadow-2xl border border-stone-600 overflow-hidden flex flex-col">
                <div className="p-6 bg-stone-900 border-b border-stone-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BackButton onClick={onBack} />
                        <h2 className="text-2xl font-black italic uppercase">{t('settings')}</h2>
                    </div>
                </div>
                <div className="p-8 flex flex-col gap-8">
                    <ToggleRow label={t('soundEffects')} value={userData.soundEnabled}
                        onToggle={() => setUserData(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))} />
                    <ToggleRow label={t('showAds')} value={userData.adsEnabled}
                        onToggle={() => setUserData(prev => ({ ...prev, adsEnabled: !prev.adsEnabled }))} />

                    {/* 言語切替 */}
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold uppercase italic tracking-tight">{t('language')}</span>
                        <div className="flex bg-stone-700 rounded-xl p-1 gap-1">
                            {(['ja', 'en'] as Lang[]).map(l => (
                                <button
                                    key={l}
                                    onClick={() => {
                                        setLang(l);
                                        setUserData(prev => ({ ...prev, language: l }));
                                    }}
                                    className={`px-4 py-1.5 rounded-lg font-black text-sm transition-all ${lang === l ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-white'}`}
                                >
                                    {l === 'ja' ? '日本語' : 'English'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-stone-700">
                        <button onClick={() => setShowClearConfirm(true)}
                            className="w-full py-4 bg-red-900/50 text-red-200 font-bold rounded-xl border border-red-800 hover:bg-red-900 active:scale-95 transition-all uppercase tracking-tighter">
                            {t('eraseData')}
                        </button>
                    </div>
                </div>
            </div>
            {showClearConfirm && (
                <ConfirmPopup
                    message={t('eraseConfirm')}
                    onConfirm={() => {
                        setUserData(prev => ({
                            soundEnabled: true, adsEnabled: true,
                            stageProgress: {}, lastActiveLevelId: null, language: prev.language
                        }));
                        setShowClearConfirm(false);
                    }}
                    onCancel={() => setShowClearConfirm(false)}
                />
            )}
        </div>
    );
}

// --- メインアプリ ---
function App() {
    const [screen, setScreen] = useState<ScreenMode>('TITLE');
    const [userData, setUserData] = useState<UserData>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed: Partial<UserData> = saved ? JSON.parse(saved) : {};
        return {
            soundEnabled: parsed.soundEnabled ?? true,
            adsEnabled: parsed.adsEnabled ?? true,
            stageProgress: parsed.stageProgress ?? {},
            lastActiveLevelId: parsed.lastActiveLevelId ?? null,
            language: parsed.language ?? DEFAULT_LANG,
        };
    });

    const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
    const [lang, setLangState] = useState<Lang>(userData.language);

    const setLang = (l: Lang) => setLangState(l);

    const langCtx = useMemo(() => ({
        lang,
        setLang,
        t: (key: keyof typeof translations.ja) => translations[lang][key],
    }), [lang]);

    // `t` を直接使うためのヘルパー
    const t = langCtx.t;

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }, [userData]);

    // userData.language が変わったら lang も同期
    useEffect(() => {
        setLangState(userData.language);
    }, [userData.language]);

    const activeLevel = useMemo(() => LEVELS.find(l => l.id === currentLevelId), [currentLevelId]);

    const updateStageProgress = (levelId: number, moves: number) => {
        setUserData(prev => {
            const current = prev.stageProgress[levelId];
            const best = (current && current.bestMoves !== null) ? Math.min(current.bestMoves, moves) : moves;
            return {
                ...prev,
                stageProgress: { ...prev.stageProgress, [levelId]: { cleared: true, bestMoves: best } },
                lastActiveLevelId: levelId
            };
        });
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

    const selectLevel = (id: number) => { setCurrentLevelId(id); setScreen('GAME'); };

    return (
        <LangContext.Provider value={langCtx}>
            {screen === 'TITLE' && (() => {
                const hasData = Object.keys(userData.stageProgress).length > 0;
                return (
                    <div className="min-h-screen bg-stone-700 flex flex-col items-center justify-center p-4 select-none touch-none text-white">
                        <div className="w-full max-w-md bg-stone-800 rounded-3xl shadow-2xl border border-stone-600 overflow-hidden p-8 flex flex-col items-center">
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">HEXA SLIDE</h1>
                            <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-12">Puzzle Odyssey</p>
                            <div className="flex flex-col gap-4 w-full">
                                <button onClick={() => hasData ? handleContinue() : selectLevel(0)}
                                    className="w-full py-5 bg-amber-500 text-black font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic">
                                    {hasData ? t('continue') : t('start')}
                                </button>
                                <button onClick={() => setScreen('STAGE_SELECT')}
                                    className="w-full py-5 bg-stone-700 text-white font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic border border-stone-600">
                                    {t('stageSelect')}
                                </button>
                                <button onClick={() => setScreen('SETTINGS')}
                                    className="w-full py-5 bg-stone-700 text-white font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic border border-stone-600">
                                    {t('settings')}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {screen === 'SETTINGS' && (
                <SettingsScreen userData={userData} setUserData={setUserData} onBack={() => setScreen('TITLE')} />
            )}

            {screen === 'STAGE_SELECT' && (
                <StageSelectScreen userData={userData} onSelect={selectLevel} onBack={() => setScreen('TITLE')} />
            )}

            {screen === 'GAME' && activeLevel && (
                <GameScreen
                    level={activeLevel}
                    bestMoves={userData.stageProgress[activeLevel.id]?.bestMoves || null}
                    onClear={(moves) => updateStageProgress(activeLevel.id, moves)}
                    onExit={() => setScreen('STAGE_SELECT')}
                />
            )}
        </LangContext.Provider>
    );
}

export default App;
