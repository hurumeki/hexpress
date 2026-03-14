// src/audio.ts

let audioCtx: AudioContext | null = null;
let isAudioEnabled = true;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

export const setAudioEnabled = (enabled: boolean) => {
    isAudioEnabled = enabled;
};

export const playClickSound = () => {
    if (!isAudioEnabled) return;
    initAudio();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
};

export const playMoveSound = () => {
    if (!isAudioEnabled) return;
    initAudio();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
};

export const playClearSound = () => {
    if (!isAudioEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const ctx = audioCtx; // closure var

    notes.forEach((freq, idx) => {
        const time = ctx.currentTime + idx * 0.1;
        
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.15, time + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(time);
        osc.stop(time + 0.4);
    });
};

export const playInvalidSound = () => {
    if (!isAudioEnabled) return;
    initAudio();
    if (!audioCtx) return;
    
    const ctx = audioCtx;
    [0, 0.15].forEach((delay) => {
        const time = ctx.currentTime + delay;
        
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, time);
        
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.1, time + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(time);
        osc.stop(time + 0.1);
    });
};

export const initAudioOnInteraction = () => {
    initAudio();
};

if (typeof window !== 'undefined') {
    window.addEventListener('pointerdown', initAudioOnInteraction, { once: true });
}
