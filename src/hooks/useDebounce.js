import { useState, useEffect } from 'react';

/**
 * useDebounce
 * Trì hoãn cập nhật value — tránh gọi API/filter quá nhiều lần.
 * Dùng: search input, autocomplete, resize handler.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup: hủy timer nếu value thay đổi trước khi delay xong
  }, [value, delay]);

  return debouncedValue;
}
