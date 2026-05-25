import { useState, useEffect } from 'react';

/**
 * useScrollProgress
 * Theo dõi % đã scroll + có vượt ngưỡng không.
 * Dùng: progress bar, back-to-top button, parallax.
 */
export function useScrollProgress(threshold = 300) {
  const [progress, setProgress] = useState(0);
  const [pastThreshold, setPastThreshold] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, pct));
      setPastThreshold(scrollTop > threshold);
    };

    // passive: true → không block paint thread
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { progress, pastThreshold };
}
