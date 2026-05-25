import { memo } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

/**
 * ScrollProgress
 * Thanh tiến trình mỏng trên đầu trang.
 * Pattern: React.memo — component này không nhận prop nên không bao giờ cần re-render từ parent.
 * useScrollProgress hook tự quản lý re-render khi scroll.
 */
export const ScrollProgress = memo(function ScrollProgress() {
  const { progress } = useScrollProgress();

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
});
