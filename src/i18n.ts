import { createContext, useContext } from 'react';

// ビルド時デフォルト言語 (vite.config.ts の define で注入)
declare const __DEFAULT_LANG__: string;

export type Lang = 'ja' | 'en';

export const translations = {
    ja: {
        // タイトル画面
        start: 'スタート',
        continue: '続きから',
        stageSelect: 'ステージ選択',
        settings: '設定',

        // 設定画面
        soundEffects: 'サウンド',
        showAds: '広告表示',
        language: '言語',
        eraseData: 'データを削除',
        eraseConfirm: 'プレイデータをすべて削除してもよろしいですか？\nこの操作は取り消せません。',

        // ステージ選択
        stages: 'ステージ',

        // ゲーム画面
        moves: '手',
        best: 'ベスト',
        undo: '戻す',
        peek: '確認',
        stageClear: 'ステージクリア！',
        nextStage: '次のステージ',
        backToSelect: '選択に戻る',
        excellent: 'エクセレント',
        good: 'グッド',
        clear: 'クリア',
    },
    en: {
        // Title
        start: 'Start',
        continue: 'Continue',
        stageSelect: 'Stage Select',
        settings: 'Settings',

        // Settings
        soundEffects: 'Sound Effects',
        showAds: 'Show Ads',
        language: 'Language',
        eraseData: 'Erase Play Data',
        eraseConfirm: 'Erase all play data?\nThis cannot be undone.',

        // Stage Select
        stages: 'Stages',

        // Game
        moves: 'Moves',
        best: 'Best',
        undo: 'Undo',
        peek: 'Peek',
        stageClear: 'Stage Clear!',
        nextStage: 'Next Stage',
        backToSelect: 'Back to Select',
        excellent: 'Excellent',
        good: 'Good',
        clear: 'Clear',
    },
} as const;

export type TranslationKey = keyof typeof translations.ja;

// ビルド時デフォルト（undefined の場合は 'ja'）
export const DEFAULT_LANG: Lang =
    (typeof __DEFAULT_LANG__ !== 'undefined' && (__DEFAULT_LANG__ === 'ja' || __DEFAULT_LANG__ === 'en'))
        ? __DEFAULT_LANG__ as Lang
        : 'ja';

// Context
export interface LangContextValue {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: TranslationKey) => string;
}

export const LangContext = createContext<LangContextValue>({
    lang: DEFAULT_LANG,
    setLang: () => { },
    t: (key) => translations[DEFAULT_LANG][key],
});

export const useLang = () => useContext(LangContext);
