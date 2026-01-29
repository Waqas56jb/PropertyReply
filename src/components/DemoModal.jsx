import React, { useEffect, useRef, useState } from 'react';

const DemoModal = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    if (!isMuted) video.volume = volume;
  }, [isMuted, volume]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 opacity-100 transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Live product demo"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Live demo card - realistic screen frame with subtle glow */}
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#0f172a] animate-fadeInUp ring-2 ring-primary/20 ring-offset-2 ring-offset-black/50"
        style={{ boxShadow: '0 0 60px rgba(37, 99, 235, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.6)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser-style top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-[#eab308]" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
            </div>
            <span className="text-white/60 text-sm font-medium ml-2">PropertyReply • Live Demo</span>
            <span className="ml-2 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/40">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              LIVE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close demo"
          >
            <i className="fas fa-times text-lg" />
          </button>
        </div>

        {/* Video container with on-screen volume controls */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src="/demo.mp4"
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Subtle gradient vignette for realism */}
          <div className="absolute inset-0 pointer-events-none rounded-b-2xl shadow-[inset_0_-40px_60px_-20px_rgba(0,0,0,0.4)]" />
          {/* Volume controls overlay - bottom left */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10">
            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              <i className={`fas text-lg ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`} />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <i className="fas fa-volume-down text-white/60 text-sm flex-shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  if (v > 0) setIsMuted(false);
                }}
                className="flex-1 h-2 rounded-full appearance-none bg-white/20 accent-primary cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
              />
              <i className="fas fa-volume-up text-white/60 text-sm flex-shrink-0" />
            </div>
            <span className="text-white/70 text-xs font-medium flex-shrink-0 w-10 text-right">
              {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>

        {/* Footer strip */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b]/80 border-t border-white/5 text-white/50 text-xs">
          <span>Real-time product walkthrough</span>
          <span>PropertyReply for UK estate agents</span>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
