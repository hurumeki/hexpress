import React from 'react';

interface ConfirmPopupProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ message, onConfirm, onCancel }) => (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onCancel} />
        <div className="relative w-full max-w-xs bg-stone-800 rounded-3xl border border-stone-600 shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6 border border-red-800">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fecaca" strokeWidth="2.5">
                    <path d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <p className="text-white font-bold text-lg leading-snug mb-8 whitespace-pre-wrap">{message}</p>
            <div className="grid grid-cols-2 gap-3 w-full">
                <button onClick={onCancel} className="py-3 bg-stone-700 text-stone-300 font-black rounded-xl border border-stone-600 active:scale-95 transition-all uppercase italic text-sm">Cancel</button>
                <button onClick={onConfirm} className="py-3 bg-red-600 text-white font-black rounded-xl shadow-lg shadow-red-900/20 active:scale-95 transition-all uppercase italic text-sm">Delete</button>
            </div>
        </div>
    </div>
);

export default ConfirmPopup;
