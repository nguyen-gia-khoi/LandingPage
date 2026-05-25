import { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * ToastContext
 * Pattern: Context API + useReducer (thay vì useState khi state phức tạp hơn)
 *
 * useReducer tốt hơn useState khi:
 *   - State là array/object lồng nhau
 *   - Có nhiều loại action khác nhau
 *   - Logic update phức tạp cần test riêng
 */

// ── Reducer ──────────────────────────────────────────────────────────────────

function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now() + Math.random(), ...action.payload }];
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  // useCallback: đảm bảo các function này không thay đổi reference
  // → consumer dùng React.memo sẽ không bị re-render thừa
  const addToast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'ADD', payload: { id, message, type, duration } });
    if (duration > 0) {
      setTimeout(() => dispatch({ type: 'REMOVE', id }), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  // Shorthand helpers
  const toast = {
    success: (msg, opts) => addToast({ message: msg, type: 'success', ...opts }),
    error: (msg, opts) => addToast({ message: msg, type: 'error', ...opts }),
    info: (msg, opts) => addToast({ message: msg, type: 'info', ...opts }),
    warning: (msg, opts) => addToast({ message: msg, type: 'warning', ...opts }),
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
