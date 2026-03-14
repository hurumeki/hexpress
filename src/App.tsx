import { useState, useEffect, useMemo } from 'react';
import type { ScreenMode, UserData, GlobalAchievement } from './types';
import { LEVELS, STORAGE_KEY } from './constants';
import { DEFAULT_LANG, LangContext, translations, useLang, type Lang } from './i18n';
import BackButton from './components/BackButton';
import ConfirmPopup from './components/ConfirmPopup';
import { getGlobalAchievementStatus } from './utils';
import StageSelectScreen from './screens/StageSelectScreen';
import GameScreen from './screens/GameScreen';
import TitleScreen from './screens/TitleScreen';
import GlobalAchievementOverlay from './components/GlobalAchievementOverlay';
import { setAudioEnabled, playClickSound } from './audio';

// --- 設定画面 ---
function SettingsScreen({ userData, setUserData, onBack }: {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
    onBack: () => void;
}) {
    const { t, lang, setLang } = useLang();
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const ToggleRow = ({ label, icon, value, onToggle }: { label: string; icon: React.ReactNode; value: boolean; onToggle: () => void }) => (
        <div className="flex justify-between items-center bg-stone-900/40 p-3 rounded-2xl border border-stone-700/50">
            <div className="flex items-center gap-4">
                <div className="text-amber-500/80">{icon}</div>
                <span className="text-lg font-bold uppercase italic tracking-tight">{label}</span>
            </div>
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
                        <BackButton onClick={() => { playClickSound(); onBack(); }} />
                        <h2 className="text-xl md:text-2xl font-black italic uppercase">{t('settings')}</h2>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 md:gap-8 max-w-2xl mx-auto w-full">
                    <ToggleRow
                        label={t('soundEffects')}
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>}
                        value={userData.soundEnabled}
                        onToggle={() => {
                            playClickSound();
                            setUserData(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
                        }} />



                    {/* 言語切替 */}
                    <div className="flex justify-between items-center bg-stone-900/40 p-3 rounded-2xl border border-stone-700/50">
                        <div className="flex items-center gap-4">
                            <div className="text-amber-500/80">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                            </div>
                            <span className="text-lg font-bold uppercase italic tracking-tight">{t('language')}</span>
                        </div>
                        <div className="flex bg-stone-800 rounded-xl p-1 gap-1 border border-stone-700">
                            {(['ja', 'en'] as Lang[]).map(l => (
                                <button
                                    key={l}
                                    onClick={() => {
                                        playClickSound();
                                        setLang(l);
                                        setUserData(prev => ({ ...prev, language: l }));
                                    }}
                                    className={`px-4 py-1.5 rounded-lg font-black text-sm transition-all ${lang === l ? 'bg-amber-500 text-black shadow-lg' : 'text-stone-400 hover:text-white'}`}
                                >
                                    {l === 'ja' ? '日本語' : 'English'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 p-6 md:p-8 rounded-3xl border-2 border-dashed border-red-900/30 bg-red-900/5 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-red-500/80">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            <span className="text-xs font-black uppercase tracking-[0.2em] italic">Danger Zone</span>
                        </div>
                        <button onClick={() => { playClickSound(); setShowClearConfirm(true); }}
                            className="w-full py-4 bg-red-900/40 text-red-200 font-bold rounded-xl border border-red-800/50 hover:bg-red-900/60 active:scale-95 transition-all uppercase tracking-tighter shadow-lg shadow-red-900/20">
                            {t('eraseData')}
                        </button>
                    </div>
                </div>
            </div>
            {showClearConfirm && (
                <ConfirmPopup
                    message={t('eraseConfirm')}
                    onConfirm={() => {
                        playClickSound();
                        setUserData(prev => ({
                            soundEnabled: true,
                            stageProgress: {}, lastActiveLevelId: null, language: prev.language
                        }));
                        setShowClearConfirm(false);
                    }}
                    onCancel={() => {
                        playClickSound();
                        setShowClearConfirm(false);
                    }}
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
            stageProgress: parsed.stageProgress ?? {},
            lastActiveLevelId: parsed.lastActiveLevelId ?? null,
            language: parsed.language ?? DEFAULT_LANG,
        };
    });

    const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
    const [lang, setLangState] = useState<Lang>(userData.language);
    const [justAchievedGlobalStatus, setJustAchievedGlobalStatus] = useState<GlobalAchievement>(null);

    const currentGlobalStatus = useMemo(() => getGlobalAchievementStatus(userData.stageProgress, LEVELS), [userData.stageProgress]);

    const setLang = (l: Lang) => setLangState(l);

    const langCtx = useMemo(() => ({
        lang,
        setLang,
        t: (key: keyof typeof translations.ja) => translations[lang][key],
    }), [lang]);

    // `t` を直接使うためのヘルパー

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setAudioEnabled(userData.soundEnabled);
    }, [userData]);

    // userData.language が変わったら lang も同期
    useEffect(() => {
        setLangState(userData.language);
    }, [userData.language]);

    const activeLevel = useMemo(() => LEVELS.find(l => l.id === currentLevelId), [currentLevelId]);

    const updateStageProgress = (levelId: number, moves: number) => {
        const oldStatus = getGlobalAchievementStatus(userData.stageProgress, LEVELS);

        setUserData(prev => {
            const current = prev.stageProgress[levelId];
            const best = (current && current.bestMoves !== null) ? Math.min(current.bestMoves, moves) : moves;
            const newProgress = { ...prev.stageProgress, [levelId]: { cleared: true, bestMoves: best } };

            const newStatus = getGlobalAchievementStatus(newProgress, LEVELS);
            const rank = { gold: 3, silver: 2, bronze: 1, 'null': 0 };
            const oldRank = oldStatus ? rank[oldStatus] : 0;
            const newRank = newStatus ? rank[newStatus] : 0;

            if (newRank > oldRank) {
                setJustAchievedGlobalStatus(newStatus);
            }

            return {
                ...prev,
                stageProgress: newProgress,
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
            {screen === 'TITLE' && (
                <TitleScreen
                    userData={userData}
                    globalStatus={currentGlobalStatus}
                    onContinue={handleContinue}
                    onStart={() => selectLevel(0)}
                    onStageSelect={() => setScreen('STAGE_SELECT')}
                    onSettings={() => setScreen('SETTINGS')}
                />
            )}

            {screen === 'SETTINGS' && (
                <SettingsScreen userData={userData} setUserData={setUserData} onBack={() => setScreen('TITLE')} />
            )}

            {screen === 'STAGE_SELECT' && (
                <StageSelectScreen userData={userData} globalStatus={currentGlobalStatus} onSelect={selectLevel} onBack={() => setScreen('TITLE')} />
            )}

            {screen === 'GAME' && activeLevel && (
                <GameScreen
                    key={activeLevel.id}
                    level={activeLevel}
                    bestMoves={userData.stageProgress[activeLevel.id]?.bestMoves || null}
                    onClear={(moves) => updateStageProgress(activeLevel.id, moves)}
                    onExit={() => setScreen('STAGE_SELECT')}
                    onNext={activeLevel.id < LEVELS.length - 1 ? () => selectLevel(activeLevel.id + 1) : undefined}
                />
            )}

            {justAchievedGlobalStatus && (
                <GlobalAchievementOverlay
                    status={justAchievedGlobalStatus}
                    onClose={() => setJustAchievedGlobalStatus(null)}
                />
            )}
        </LangContext.Provider>
    );
}

export default App;
