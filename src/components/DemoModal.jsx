import React, { useEffect, useRef, useState } from 'react';

// Video URL: use env if set (for Vercel/external hosting), else absolute URL from current origin
const getDemoVideoUrl = () => {
  if (typeof window === 'undefined') return '';
  const envUrl = process.env.REACT_APP_DEMO_VIDEO_URL;
  if (envUrl) return envUrl;
  const origin = window.location.origin;
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  return `${origin}${base}/demo.mp4`;
};

const DemoModal = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [videoSrc, setVideoSrc] = useState('');
  const [loadError, setLoadError] = useState(false);

  // When modal opens: set video URL (client-side origin for Vercel) and reset volume
  useEffect(() => {
    if (!isOpen) {
      setLoadError(false);
      return;
    }
    setVolume(1);
    setVideoSrc(getDemoVideoUrl());
  }, [isOpen]);

  // When we have src: load and play (defer one frame so ref is attached after mount)
  useEffect(() => {
    if (!videoSrc || !isOpen) return;
    setLoadError(false);
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      const video = videoRef.current;
      if (!video) return;
      video.muted = true;
      video.volume = 1;
      video.load();
      const play = () => video.play().catch(() => {});
      const onCanPlay = () => play();
      const onError = () => setLoadError(true);
      video.addEventListener('canplay', onCanPlay, { once: true });
      video.addEventListener('error', onError, { once: true });
      if (video.readyState >= 2) play();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [videoSrc, isOpen]);

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
      className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Live product demo"
    >
      {/* Backdrop - deep blur + gradient vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(37,99,235,0.08)_0%,transparent_50%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main card - premium glass frame with gradient border */}
      <div
        className="relative w-full max-w-5xl rounded-3xl overflow-hidden animate-fadeInUp"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 80px rgba(37,99,235,0.2), 0 32px 64px -24px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.5)',
          background: 'linear-gradient(160deg, #0f172a 0%, #0c1222 50%, #0a0f1a 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient border glow - top edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent z-10" aria-hidden="true" />

        {/* Top bar - refined browser chrome */}
        <div
          className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 border-b border-white/[0.06] flex-shrink-0"
          style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)' }}
        >
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#febc2e] shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#28c840] shadow-inner" />
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <i className="fas fa-play text-primary/80 text-xs" />
              <span className="text-white/70 text-sm font-medium">PropertyReply Demo</span>
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-emerald-400/95 border border-emerald-500/30"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.15) 100%)', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              LIVE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Close demo"
          >
            <i className="fas fa-times text-lg" />
          </button>
        </div>

        {/* Video area - balanced 16:9 proportion (taller, less letterboxing) */}
        <div className="relative bg-black flex-shrink min-h-0 flex flex-col">
          <div className="relative w-full aspect-video min-h-[240px] max-h-[50vh] sm:max-h-[55vh] md:max-h-[432px] overflow-hidden">
            {videoSrc && (
              <video
                key={videoSrc}
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-contain"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            )}
            {loadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center bg-black/90">
                <i className="fas fa-exclamation-triangle text-4xl text-amber-400" />
                <p className="text-white/90 font-medium">Video could not be loaded</p>
                <p className="text-white/60 text-sm">Ensure demo.mp4 is in the public folder and deployed, or set REACT_APP_DEMO_VIDEO_URL in Vercel.</p>
                <a
                  href={videoSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Open video link
                </a>
              </div>
            )}
            {/* Soft edge vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 80px 0 rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.03)',
              }}
            />
          </div>

          {/* Volume bar - glass pill, responsive padding */}
          <div
            className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 md:bottom-4 md:left-4 md:right-4 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-white/[0.08]"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.75) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              <i className={`fas text-base sm:text-lg ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`} />
            </button>
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <i className="fas fa-volume-down text-white/40 text-xs sm:text-sm flex-shrink-0 hidden sm:block" />
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
                className="demo-volume-slider flex-1 h-1.5 sm:h-2 rounded-full appearance-none bg-white/15 cursor-pointer"
              />
              <i className="fas fa-volume-up text-white/40 text-xs sm:text-sm flex-shrink-0 hidden sm:block" />
            </div>
            <span className="text-white/60 text-xs font-semibold tabular-nums flex-shrink-0 w-9 sm:w-11 text-right">
              {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>

        {/* Footer - subtle gradient strip */}
        <div
          className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 border-t border-white/[0.06] flex-shrink-0"
          style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.95) 100%)' }}
        >
          <span className="text-white/40 text-xs font-medium flex items-center gap-2">
            <i className="fas fa-film text-white/30" />
            Product walkthrough
          </span>
          <span className="text-white/30 text-xs">
            PropertyReply · UK estate agents
          </span>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
