import { useState, useCallback } from 'react';

/**
 * useLocalStorage
 * Đồng bộ state với localStorage — persist qua reload.
 * Pattern: state + side-effect wrapper
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.warn(`[useLocalStorage] Failed to write "${key}":`, err);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn(`[useLocalStorage] Failed to remove "${key}":`, err);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
