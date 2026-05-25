import { useState, useEffect, useRef, useMemo, forwardRef, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { useKeyPress } from '../hooks/useKeyPress';
import { useDebounce } from '../hooks/useDebounce';

/**
 * CommandPalette
 * Mở bằng Ctrl+K (Windows) hoặc Cmd+K (Mac).
 * Pattern tổng hợp:
 *   - Portal (render ngoài DOM tree)
 *   - forwardRef (cha truyền ref vào SearchInput)
 *   - useDebounce (filter không chạy ngay khi gõ)
 *   - useMemo (tính toán filtered list chỉ khi cần)
 *   - useKeyPress (keyboard shortcut)
 *   - useRef (giữ tham chiếu input để focus)
 *   - useEffect (focus auto khi mở, lock scroll body)
 */

const NAV_ITEMS = [
  { id: 'hero',       label: 'Home',       icon: '⌂', desc: 'Back to top' },
  { id: 'about',      label: 'About Me',   icon: '◉', desc: 'Who I am' },
  { id: 'skills',     label: 'Skills',     icon: '◈', desc: 'Tech stack' },
  { id: 'experience', label: 'Experience', icon: '◎', desc: 'Work history' },
  { id: 'projects',   label: 'Projects',   icon: '◆', desc: 'Featured work' },
  { id: 'contact',    label: 'Contact',    icon: '◇', desc: 'Get in touch' },
];

// forwardRef: cho phép parent truyền ref xuống input bên trong
const SearchInput = forwardRef(function SearchInput({ value, onChange }, ref) {
  return (
    <div className="cp-search">
      <span className="cp-search-icon">❯</span>
      <input
        ref={ref}
        className="cp-input"
        type="text"
        placeholder="Type a section name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button className="cp-clear" onClick={() => onChange('')} aria-label="Clear">
          ×
        </button>
      )}
    </div>
  );
});

function CommandPaletteInner({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 120);

  // useMemo: chỉ filter lại khi query thay đổi
  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return NAV_ITEMS;
    return NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q),
    );
  }, [debouncedQuery]);

  // Reset khi mở/đóng
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(0);
      // Đợi animation xong rồi focus
      requestAnimationFrame(() => inputRef.current?.focus());
      // Lock scroll body khi modal mở
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Reset active index khi filter thay đổi
  useEffect(() => setActiveIdx(0), [filtered]);

  // useCallback: navigate không thay đổi reference giữa các render
  const navigate = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onClose();
  }, [onClose]);

  const handleKey = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (filtered[activeIdx]) navigate(filtered[activeIdx].id);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [filtered, activeIdx, navigate, onClose]);

  useKeyPress('Escape', onClose, { enabled: isOpen });

  if (!isOpen) return null;

  return createPortal(
    <div className="cp-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command Palette">
      <div className="cp-panel" onClick={(e) => e.stopPropagation()} onKeyDown={handleKey}>
        <div className="cp-header">
          <SearchInput ref={inputRef} value={query} onChange={setQuery} />
          <kbd className="cp-esc" onClick={onClose}>ESC</kbd>
        </div>
        <ul className="cp-list" role="listbox">
          {filtered.length === 0 ? (
            <li className="cp-empty">No results for "{debouncedQuery}"</li>
          ) : (
            filtered.map((item, idx) => (
              <li
                key={item.id}
                role="option"
                aria-selected={idx === activeIdx}
                className={`cp-item ${idx === activeIdx ? 'cp-item--active' : ''}`}
                onClick={() => navigate(item.id)}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                <span className="cp-item-icon">{item.icon}</span>
                <span className="cp-item-label">{item.label}</span>
                <span className="cp-item-desc">{item.desc}</span>
                <span className="cp-item-arrow">↵</span>
              </li>
            ))
          )}
        </ul>
        <div className="cp-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// memo: chỉ re-render khi isOpen hoặc onClose thay đổi
export const CommandPalette = memo(CommandPaletteInner);
