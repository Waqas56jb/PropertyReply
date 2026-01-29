// Shared demo video URL for preload and modal (Vercel/external hosting)
export const getDemoVideoUrl = () => {
  if (typeof window === 'undefined') return '';
  const envUrl = process.env.REACT_APP_DEMO_VIDEO_URL;
  if (envUrl) return envUrl;
  const origin = window.location.origin;
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  return `${origin}${base}/demo.mp4`;
};
