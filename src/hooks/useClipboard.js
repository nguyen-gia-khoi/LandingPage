import { useState, useCallback } from 'react';

/**
 * useClipboard
 * Copy text vào clipboard, trả về trạng thái copied trong `timeout` ms.
 * Dùng: copy email, copy code snippet, copy link.
 * Có fallback cho trình duyệt cũ không hỗ trợ Clipboard API.
 */
export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  // useCallback → tránh tạo lại function mỗi lần render
  const copy = useCallback(
    async (text) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          // Modern API (HTTPS only)
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback cho HTTP hoặc trình duyệt cũ
          const el = Object.assign(document.createElement('textarea'), {
            value: text,
            style: 'position:fixed;opacity:0',
          });
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
        }
        setCopied(true);
        const t = setTimeout(() => setCopied(false), timeout);
        return () => clearTimeout(t);
      } catch (err) {
        console.error('[useClipboard] Copy failed:', err);
      }
    },
    [timeout],
  );

  return { copied, copy };
}
