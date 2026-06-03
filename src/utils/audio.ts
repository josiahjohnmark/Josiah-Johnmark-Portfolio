let sharedAudioCtx: AudioContext | null = null;

export const getAudioContext = (): AudioContext => {
  if (typeof window === 'undefined') {
    throw new Error('AudioContext can only be used in client environments');
  }
  
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    sharedAudioCtx = new AudioContextClass();
  }
  
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(err => console.warn("Failed to resume audio context:", err));
  }
  
  return sharedAudioCtx;
};
