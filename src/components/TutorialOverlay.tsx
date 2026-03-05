import React, { useEffect, useState } from 'react';
import { useLang, TranslationKey } from '../i18n';

interface TutorialOverlayProps {
    isVisible: boolean;
    step: number;     // Describes which part of the tutorial we are at
    levelId: number;  // To determine which tutorial it is (0: Tut 1, 1: Tut 2, 2: Tut 3)
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isVisible, step, levelId }) => {
    const { t } = useLang();
    const [msgKey, setMsgKey] = useState<TranslationKey | null>(null);

    useEffect(() => {
        if (!isVisible) {
            setMsgKey(null);
            return;
        }

        if (levelId === 0) {
            if (step === 0) setMsgKey('tut1_msg1');
        } else if (levelId === 1) {
            if (step === 0) setMsgKey('tut2_msg1');
            else if (step === 1) setMsgKey('tut2_msg2');
            else if (step === 2) setMsgKey('tut2_msg3');
        } else if (levelId === 2) {
            if (step === 0) setMsgKey('tut3_msg1');
            else if (step === 1) setMsgKey('tut3_msg2');
            else if (step === 2) setMsgKey('tut3_msg3');
        }
    }, [levelId, step, isVisible]);

    if (!isVisible || !msgKey) return null;

    return (
        <div className="absolute inset-x-0 top-20 z-40 pointer-events-none flex items-start justify-center p-4">
            {/* The dark overlay is mostly handled per-step in GameScreen if needed, or we just rely on CSS pointer-events-none */}
            <div className="bg-stone-900/95 backdrop-blur-md text-white p-4 md:p-6 rounded-2xl shadow-2xl border-2 border-amber-500/50 max-w-sm text-center animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-auto">
                <p className="text-sm md:text-base font-bold leading-relaxed whitespace-pre-wrap">
                    {t(msgKey)}
                </p>
            </div>
            {/* Note: Specific pointers (like bouncing hands) are easier to position in GameScreen directly since they rely on SVG coordinates or specific hand slot indices */}
        </div>
    );
};

export default TutorialOverlay;
