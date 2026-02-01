import React, { useEffect } from 'react';
import DemoRequestForm from './DemoRequestForm';

const DemoRequestModal = ({ isOpen, onClose }) => {
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

  const handleSubmit = (formData) => {
    // Optional: Handle successful submission
    console.log('Demo request submitted:', formData);
  };

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-2 sm:p-4 md:p-6 pt-safe pb-safe pl-safe pr-safe min-h-[100dvh] min-h-[100vh] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Request a Demo"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(37,99,235,0.08)_0%,transparent_50%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main card */}
      <div
        className="relative w-full max-w-2xl max-h-[90dvh] max-h-[90vh] rounded-2xl sm:rounded-3xl overflow-hidden animate-fadeInUp flex flex-col my-auto"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 80px rgba(37,99,235,0.2), 0 32px 64px -24px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.5)',
          background: 'linear-gradient(160deg, #0f172a 0%, #0c1222 50%, #0a0f1a 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient border glow - top edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent z-10" aria-hidden="true" />

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-white/[0.06] flex-shrink-0"
          style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)' }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <i className="fas fa-calendar-check text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Request a Demo</h2>
              <p className="text-xs sm:text-sm text-white/60">Schedule a personalized demonstration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Close demo request"
          >
            <i className="fas fa-times text-base sm:text-lg" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-6 md:p-8">
          <DemoRequestForm onSubmit={handleSubmit} onCancel={onClose} />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-t border-white/[0.06] flex-shrink-0"
          style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.95) 100%)' }}
        >
          <span className="text-white/40 text-xs font-medium flex items-center gap-2">
            <i className="fas fa-shield-alt text-white/30" />
            Your information is secure and confidential
          </span>
          <span className="text-white/30 text-xs">
            PropertyReply · UK estate agents
          </span>
        </div>
      </div>
    </div>
  );
};

export default DemoRequestModal;
