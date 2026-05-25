import { createContext, useContext, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * ThemeContext
 * Pattern: Context API + useLocalStorage + useMemo
 *
 * Tại sao useMemo ở đây?
 *   Mỗi lần ThemeProvider re-render, nếu không memo value object,
 *   tất cả consumer sẽ re-render dù theme không đổi.
 */

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('ngk-theme', 'dark');

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Đồng bộ class lên <html> để CSS có thể dùng :root[data-theme]
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // useMemo: chỉ tạo lại object khi theme thực sự thay đổi
  const value = useMemo(() => ({ theme, toggle }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook để dùng context — throw error nếu dùng ngoài Provider
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
