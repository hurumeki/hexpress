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
        stages: 'ステージ選択',

        // ゲーム画面
        moves: '手数',
        best: 'ベスト',
        undo: '戻す',
        peek: '確認',
        stageClear: 'ステージクリア！',
        nextStage: '次のステージ',
        backToSelect: '選択に戻る',
        excellent: 'Excellent',
        good: 'Good',
        clear: 'Clear',

        // チュートリアル
        tut1_msg1: '下の手駒をタップして選択し、\n上の盤面の手前のマスを\nタップして挿入しましょう。',
        tut2_msg1: '盤面を長押し（タップしたまま）に\nすると、ルートが表示されます。',
        tut2_msg2: '溝の方向に押し出すことができます\n下のマスに駒を入れて押し出しましょう。',
        tut2_msg3: '次は左上のマスに駒を入れて、\n駒を目標まで運びましょう。',
        tut3_msg1: '赤い手駒をタップして\n選択状態にしましょう。',
        tut3_msg2: '真ん中のマスに赤い駒を\n挿入しましょう。',
        tut3_msg3: '白い駒を選択し、手前のマスに\n挿入して押し出しましょう。',
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

        // Tutorial
        tut1_msg1: 'Tap the piece below to select it,\nthen tap the bottom slot\non the board to insert it.',
        tut2_msg1: 'Tap and hold on the board\nto see the paths.',
        tut2_msg2: 'You can push in the direction of the groove.\nInsert a piece in the bottom slot to push out.',
        tut2_msg3: 'Next, insert a piece into the top-left slot\nand carry the piece to the target.',
        tut3_msg1: 'Tap the red piece\nto select it.',
        tut3_msg2: 'Insert the red piece\ninto the middle slot.',
        tut3_msg3: 'Select the white piece and insert it\ninto the bottom slot to push.',
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
