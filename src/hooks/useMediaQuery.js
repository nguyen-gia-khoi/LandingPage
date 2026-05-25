import { useState, useEffect } from 'react';

/**
 * useMediaQuery
 * Theo dõi CSS media query, trả về boolean.
 * Dùng: responsive logic trong JS, conditional rendering theo breakpoint.
 *
 * Ví dụ:
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    // addEventListener (modern) vs addListener (deprecated)
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, [query]);

  return matches;
}
