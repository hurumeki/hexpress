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
        <div className="fixed inset-0 bg-stone-800 flex flex-col select-none touch-none text-white overflow-hidden">
            <div className="w-full flex flex-col h-full">
                <div className="p-4 md:p-6 bg-stone-900 border-b border-stone-700 flex justify-between items-center shadow-md z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <BackButton onClick={onBack} />
                        <h2 className="text-xl md:text-2xl font-black italic uppercase">{t('settings')}</h2>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 md:gap-8 max-w-2xl mx-auto w-full">
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
                    <div className="fixed inset-0 bg-stone-900 flex flex-col items-center justify-center select-none touch-none text-white overflow-hidden">
                        {/* 背景の装飾的なヘキサゴン */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="absolute bg-stone-800/50 border border-amber-500/20"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        width: `${60 + Math.random() * 120}px`,
                                        height: `${60 + Math.random() * 120}px`,
                                        transform: `translate(-50%, -50%) rotate(${Math.random() * 60}deg)`,
                                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                    }}
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
                                <button onClick={() => hasData ? handleContinue() : selectLevel(0)}
                                    className="w-full py-5 bg-amber-500 text-stone-900 font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                                    {hasData ? t('continue') : t('start')}
                                </button>
                                <button onClick={() => setScreen('STAGE_SELECT')}
                                    className="w-full py-5 bg-stone-800 text-stone-200 font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic border border-stone-700 shadow-lg hover:bg-stone-700">
                                    {t('stageSelect')}
                                </button>
                                <button onClick={() => setScreen('SETTINGS')}
                                    className="w-full py-5 bg-stone-800 text-stone-200 font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic border border-stone-700 shadow-lg hover:bg-stone-700">
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
