import { useEffect, useCallback } from 'react';

/**
 * useKeyPress
 * Lắng nghe tổ hợp phím, gọi handler khi khớp.
 * Dùng: keyboard shortcuts, command palette (Cmd+K), modal close (Escape).
 *
 * Ví dụ:
 *   useKeyPress('k', openPalette, { meta: true });   // Cmd+K (Mac)
 *   useKeyPress('k', openPalette, { ctrl: true });   // Ctrl+K (Windows)
 *   useKeyPress('Escape', closePalette);
 */
export function useKeyPress(key, handler, options = {}) {
  const { ctrl = false, meta = false, shift = false, enabled = true } = options;

  // useCallback để tránh thêm/xóa listener mỗi render
  const stableHandler = useCallback(handler, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e) => {
      const ctrlOk = !ctrl || e.ctrlKey;
      const metaOk = !meta || e.metaKey;
      const shiftOk = !shift || e.shiftKey;
      if (e.key === key && ctrlOk && metaOk && shiftOk) {
        e.preventDefault();
        stableHandler(e);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, ctrl, meta, shift, enabled, stableHandler]);
}
