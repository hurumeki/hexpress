import React from 'react';

interface BackButtonProps {
    onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
    <button onClick={onClick} className="w-10 h-10 flex items-center justify-center bg-stone-800 rounded-xl border border-stone-600 hover:border-amber-500 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6" /></svg>
    </button>
);

export default BackButton;
