import { memo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '../context/ToastContext';

/**
 * ToastContainer
 * Pattern: ReactDOM.createPortal — render ngoài cây DOM thông thường.
 * Tại sao Portal?
 *   Toast cần hiện trên cùng (z-index cao nhất), không bị ảnh hưởng bởi
 *   overflow:hidden hay stacking context của parent.
 */
export const ToastContainer = memo(function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return createPortal(
    <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>,
    document.body,
  );
});

/**
 * ToastItem
 * useRef để lưu timeout ID mà không trigger re-render.
 * useEffect cleanup để hủy timeout khi unmount (tránh memory leak).
 */
const ToastItem = memo(function ToastItem({ toast, onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (toast.duration > 0) {
      timerRef.current = setTimeout(onClose, toast.duration);
    }
    return () => clearTimeout(timerRef.current); // cleanup on unmount
  }, [toast.duration, onClose]);

  const icons = { success: '✔', error: '✖', info: 'ℹ', warning: '⚠' };

  return (
    <div
      className={`toast toast--${toast.type}`}
      role="alert"
      onClick={onClose}
      title="Click to dismiss"
    >
      <span className="toast-icon">{icons[toast.type] ?? 'ℹ'}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
});
