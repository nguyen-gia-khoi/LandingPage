import { memo, useCallback } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

/**
 * BackToTop
 * Nút scroll lên đầu, hiện khi đã scroll qua 300px.
 * Pattern: React.memo + useCallback
 *
 * scrollTo với behavior:'smooth' — Web API native, không cần thư viện.
 */
export const BackToTop = memo(function BackToTop() {
  const { pastThreshold } = useScrollProgress(300);

  // useCallback: hàm này không thay đổi → tránh tạo lại mỗi render
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <button
      className={`back-to-top ${pastThreshold ? 'back-to-top--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      ↑
    </button>
  );
});
