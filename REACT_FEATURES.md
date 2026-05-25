# React Features — Tài liệu ôn tập

> Tài liệu này mô tả tất cả hooks, patterns, và tính năng đang được sử dụng trong project Landing Page.
> Mỗi mục đều có giải thích **tại sao dùng**, **khi nào dùng**, và **code thực tế trong project**.

---

## Mục lục

1. [Built-in Hooks](#1-built-in-hooks)
2. [Custom Hooks](#2-custom-hooks)
3. [Context API](#3-context-api)
4. [React Patterns](#4-react-patterns)
5. [Components](#5-components)
6. [Performance Optimization](#6-performance-optimization)
7. [File Structure](#7-file-structure)

---

## 1. Built-in Hooks

### `useState`
Quản lý state local trong component.

```jsx
const [query, setQuery] = useState('');
const [paletteOpen, setPaletteOpen] = useState(false);
```

**Khi nào dùng:** Bất kỳ khi nào cần lưu trữ dữ liệu thay đổi theo thời gian trong component.

---

### `useEffect`
Chạy side effect sau khi render (fetch API, subscribe event, DOM manipulation).

```jsx
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll); // cleanup
}, []); // [] → chỉ chạy 1 lần khi mount
```

**3 dạng dependency array:**
- `[]` → chạy 1 lần khi mount
- `[dep1, dep2]` → chạy lại khi dep thay đổi
- không có `[]` → chạy sau mỗi render (hiếm dùng)

**Cleanup function:** Luôn return cleanup để tránh memory leak (removeEventListener, clearTimeout, unsubscribe).

---

### `useRef`
Giữ tham chiếu mà **không trigger re-render** khi thay đổi. Cũng dùng để trỏ vào DOM element.

```jsx
const canvasRef = useRef(null);        // ref đến DOM element
const timerRef  = useRef(null);        // lưu timer ID, không cần re-render
const ratioRef  = useRef({});          // lưu Map intersection ratios

// Truy cập DOM:
inputRef.current?.focus();
canvas = canvasRef.current;
```

**useRef vs useState:**
| | `useRef` | `useState` |
|---|---|---|
| Trigger re-render | ❌ Không | ✅ Có |
| Persists giữa renders | ✅ Có | ✅ Có |
| Dùng cho | Timer, DOM ref, cache | UI state |

---

### `useMemo`
Cache kết quả tính toán nặng, chỉ tính lại khi dependency thay đổi.

```jsx
// Chỉ filter skills lại khi debouncedQuery thay đổi
const filteredSkills = useMemo(() => {
  const q = debouncedQuery.toLowerCase().trim();
  if (!q) return skills;
  return Object.fromEntries(
    Object.entries(skills)
      .map(([cat, items]) => [cat, items.filter(s => s.toLowerCase().includes(q))])
      .filter(([, items]) => items.length > 0)
  );
}, [debouncedQuery]);
```

**Khi nào dùng:**
- Tính toán nặng (filter/sort mảng lớn, regex)
- Tạo object/array làm prop để tránh reference thay đổi vô nghĩa
- **Đừng lạm dụng** — useMemo bản thân cũng tốn chi phí

---

### `useCallback`
Cache function reference, tránh tạo lại mỗi render. Quan trọng khi truyền function xuống component con dùng `React.memo`.

```jsx
const openPalette  = useCallback(() => setPaletteOpen(true),  []);
const closePalette = useCallback(() => setPaletteOpen(false), []);
const closeMenu    = useCallback(() => setOpen(false),        []);

// Trong ContactItem — copy không tạo lại khi render
const handleCopy = useCallback(async () => {
  await copy(value);
  toast.success(`Copied: ${value}`);
}, [copy, value, toast]);
```

---

### `useReducer`
Thay thế `useState` khi state phức tạp hoặc có nhiều loại action.

```jsx
// Trong ToastContext
function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD':    return [...state, { id: Date.now(), ...action.payload }];
    case 'REMOVE': return state.filter(t => t.id !== action.id);
    case 'CLEAR':  return [];
    default:       return state;
  }
}

const [toasts, dispatch] = useReducer(toastReducer, []);
dispatch({ type: 'ADD', payload: { message: 'Hello', type: 'success' } });
```

**useState vs useReducer:**
| | `useState` | `useReducer` |
|---|---|---|
| State đơn giản | ✅ Tốt | Overkill |
| Nhiều action type | Phức tạp | ✅ Tốt |
| Testability | Trung bình | ✅ Cao (pure function) |
| Redux-like pattern | ❌ | ✅ |

---

### `useContext`
Đọc giá trị từ Context, không cần truyền prop qua nhiều tầng (prop drilling).

```jsx
// Đọc theme ở bất kỳ component nào
const { theme, toggle } = useTheme(); // custom hook wrap useContext

// Đọc toast
const { toast } = useToast();
toast.success('Copied!');
```

---

## 2. Custom Hooks

### `useLocalStorage` — `src/hooks/useLocalStorage.js`
Đồng bộ state với `localStorage`, persist qua page reload.

```js
const [theme, setTheme] = useLocalStorage('ngk-theme', 'dark');
```

**Dùng trong:** `ThemeContext` để lưu theme preference của user.

**Key points:**
- Khởi tạo state từ localStorage (lazy initializer trong `useState`)
- Serialize/deserialize bằng `JSON.stringify/parse`
- Có `removeValue` để xóa khỏi storage

---

### `useDebounce` — `src/hooks/useDebounce.js`
Trì hoãn cập nhật value, tránh xử lý quá nhiều lần.

```js
const debouncedQuery = useDebounce(query, 200); // đợi 200ms sau khi user ngừng gõ
```

**Dùng trong:**
- `SkillsSection` — filter skills khi gõ vào search box
- `CommandPalette` — filter nav items (delay 120ms)

**Flow:**
```
User gõ "mon" → query = "mon"
         ↓ (useDebounce 200ms)
User gõ "mongo" → reset timer
         ↓ (200ms sau khi ngừng)
debouncedQuery = "mongo" → useMemo filter chạy
```

---

### `useScrollProgress` — `src/hooks/useScrollProgress.js`
Theo dõi % scroll + có vượt ngưỡng không.

```js
const { progress, pastThreshold } = useScrollProgress(300);
// progress: 0 → 100 (%)
// pastThreshold: true khi scrollY > 300px
```

**Dùng trong:**
- `ScrollProgress` component — progress bar trên đầu trang
- `BackToTop` component — hiện nút khi scroll > 300px

**Optimization:** `{ passive: true }` cho scroll listener → không block paint thread.

---

### `useActiveSection` — `src/hooks/useActiveSection.js`
Dùng `IntersectionObserver` để biết section nào đang hiện.

```js
const activeId = useActiveSection(['hero', 'about', 'skills', ...]);
// → 'about' khi About section đang ở giữa viewport
```

**Dùng trong:** `Navbar` — highlight nav link ứng với section đang đọc.

**Tại sao không dùng scroll event?**
IntersectionObserver chạy off main thread → performant hơn addEventListener scroll.

---

### `useClipboard` — `src/hooks/useClipboard.js`
Copy text, trả về trạng thái `copied` trong N ms.

```js
const { copied, copy } = useClipboard(2000);
await copy('giakhoi2004@gmail.com');
// copied = true trong 2 giây, sau đó tự reset về false
```

**Dùng trong:** `ContactItem` — copy email/LinkedIn/GitHub.

**Fallback:** Dùng `document.execCommand('copy')` cho HTTP/trình duyệt cũ vì Clipboard API chỉ chạy trên HTTPS.

---

### `useMediaQuery` — `src/hooks/useMediaQuery.js`
Theo dõi CSS media query, trả về boolean.

```js
const isMobile = useMediaQuery('(max-width: 680px)');
// → true/false tùy kích thước màn hình, cập nhật khi resize
```

**Dùng trong:** `Navbar` — ẩn label "K" trong nút command palette trên mobile.

---

### `useKeyPress` — `src/hooks/useKeyPress.js`
Lắng nghe tổ hợp phím toàn trang.

```js
useKeyPress('k', openPalette, { ctrl: true }); // Ctrl+K
useKeyPress('k', openPalette, { meta: true }); // Cmd+K (Mac)
useKeyPress('Escape', onClose, { enabled: isOpen }); // chỉ khi modal mở
```

**Dùng trong:**
- `App` — mở Command Palette bằng Ctrl/Cmd+K
- `CommandPalette` — đóng bằng Escape

---

## 3. Context API

### `ThemeContext` — `src/context/ThemeContext.jsx`

**Flow:**
```
ThemeProvider (lưu theme vào localStorage)
    ↓
useTheme() → { theme, toggle }
    ↓
Navbar (hiện toggle button)
    ↓
document.documentElement.setAttribute('data-theme', theme)
    ↓
CSS [data-theme="light"] { ... }
```

**Pattern: Custom hook wrap context**
```jsx
// Thay vì:
const ctx = useContext(ThemeContext); // có thể null nếu dùng ngoài Provider

// Dùng:
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside <ThemeProvider>');
  return ctx;
}
```

---

### `ToastContext` — `src/context/ToastContext.jsx`

**Architecture:**
```
ToastProvider (useReducer → [toasts, dispatch])
    ↓ value = { toasts, addToast, removeToast, toast }
useToast() → { toast }
    ↓
ContactItem: toast.success('Copied!')
    ↓
ToastContainer (Portal): render toasts lên body
```

**Shorthand API:**
```js
toast.success('Done!');
toast.error('Failed!');
toast.info('FYI...');
toast.warning('Careful!');
```

---

## 4. React Patterns

### `React.memo`
Bọc component để skip re-render khi props không đổi.

```jsx
// Component này không có prop → không bao giờ cần re-render từ parent
export const ScrollProgress = memo(function ScrollProgress() { ... });
export const BackToTop = memo(function BackToTop() { ... });
export const Footer = memo(function Footer() { ... });

// Component có prop nhưng ít thay đổi
export const TerminalWindow = memo(function TerminalWindow({ title, children, className }) { ... });
```

**Khi nào dùng:** Component render nặng, render thường xuyên từ parent, hoặc nhận callback props cần kết hợp với `useCallback`.

---

### `forwardRef`
Cho phép component cha truyền `ref` vào DOM element bên trong component con.

```jsx
// Trong CommandPalette.jsx
const SearchInput = forwardRef(function SearchInput({ value, onChange }, ref) {
  return <input ref={ref} ... />;
});

// Sử dụng:
const inputRef = useRef(null);
<SearchInput ref={inputRef} value={query} onChange={setQuery} />
inputRef.current?.focus(); // focus vào input bên trong SearchInput
```

---

### `createPortal`
Render component ra ngoài vị trí DOM hiện tại (thường là `document.body`).

```jsx
// Toast và CommandPalette đều dùng Portal
return createPortal(
  <div className="toast-container">...</div>,
  document.body  // render trực tiếp vào body, không bị ảnh hưởng bởi overflow/z-index của parent
);
```

**Tại sao cần Portal:**
- Toast/Modal cần z-index cao nhất
- Tránh bị cắt bởi `overflow: hidden` của parent
- Không bị ảnh hưởng bởi CSS stacking context

---

### `ErrorBoundary` (Class Component)
Bắt lỗi trong cây component con, hiện fallback UI thay vì crash toàn trang.

```jsx
// Hooks KHÔNG thể làm điều này → phải dùng Class Component
class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error }; // cập nhật state để hiện fallback
  }
  componentDidCatch(error, info) {
    console.error(error, info); // log lên Sentry, Datadog, ...
  }
}

// Dùng:
<ErrorBoundary>
  <main>...</main> {/* nếu bất kỳ section nào crash, trang vẫn hoạt động */}
</ErrorBoundary>
```

---

### Provider Pattern (Nested Providers)
```jsx
export default function App() {
  return (
    <ThemeProvider>      {/* outer: theme */}
      <ToastProvider>    {/* inner: toast */}
        <AppContent />   {/* có thể dùng cả useTheme() và useToast() */}
      </ToastProvider>
    </ThemeProvider>
  );
}
```

---

### Lazy Initializer trong `useState`
```jsx
// Tốn: khởi tạo mỗi lần render (dù chỉ dùng lần đầu)
const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'dark');

// Tốt: chỉ chạy 1 lần khi mount (lazy initializer)
const [theme, setTheme] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('ngk-theme')) ?? 'dark';
  } catch { return 'dark'; }
});
```

---

## 5. Components

| Component | File | Pattern | Mô tả |
|---|---|---|---|
| `ScrollProgress` | `components/ScrollProgress.jsx` | `memo` | Thanh progress bar ở đầu trang |
| `BackToTop` | `components/BackToTop.jsx` | `memo + useCallback` | Nút cuộn lên đầu |
| `ToastContainer` + `ToastItem` | `components/Toast.jsx` | `Portal + memo + useRef` | Hệ thống thông báo |
| `CommandPalette` | `components/CommandPalette.jsx` | `Portal + forwardRef + memo + useMemo` | Quick navigation Ctrl+K |
| `ErrorBoundary` | `components/ErrorBoundary.jsx` | `Class Component` | Bắt lỗi render |

---

## 6. Performance Optimization

### Tổng hợp các kỹ thuật đang dùng

| Kỹ thuật | Dùng ở đâu | Mục đích |
|---|---|---|
| `React.memo` | `TerminalWindow`, `SectionTitle`, `Footer`, `ScrollProgress`, `BackToTop`, `ParticleCanvas` | Skip re-render khi props không đổi |
| `useCallback` | `handleCopy`, `openPalette`, `closePalette`, `closeMenu`, `navigate` | Ổn định function reference cho `memo` component |
| `useMemo` | `filteredSkills`, `totalVisible`, `ThemeContext value`, `filtered` trong CommandPalette | Tránh tính toán nặng lặp lại |
| `useDebounce` | Skill search, Command Palette search | Giảm số lần filter/render khi gõ |
| `IntersectionObserver` | `useInView`, `useActiveSection` | Thay scroll event, chạy off main thread |
| `passive: true` | scroll event trong `useScrollProgress` | Không block paint thread |
| `requestAnimationFrame` | `ParticleCanvas`, focus trong `CommandPalette` | Đồng bộ với browser paint cycle |
| `lazy initializer` | `useLocalStorage`, `useMediaQuery` | Chỉ tính giá trị khởi tạo 1 lần |

---

### React Render Cycle (tóm tắt)

```
State/Props thay đổi
        ↓
React reconciliation (Virtual DOM diff)
        ↓
Re-render các component bị ảnh hưởng
        ↓ (có memo?)
  memo: so sánh props → skip nếu không đổi
        ↓
Commit phase: cập nhật real DOM
        ↓
useEffect cleanup (nếu có)
        ↓
useEffect của render mới
```

---

## 7. File Structure

```
src/
├── hooks/
│   ├── useLocalStorage.js     # persist state vào localStorage
│   ├── useDebounce.js         # delay value update
│   ├── useScrollProgress.js   # theo dõi scroll %
│   ├── useActiveSection.js    # IntersectionObserver nav tracking
│   ├── useClipboard.js        # copy to clipboard
│   ├── useMediaQuery.js       # responsive breakpoints in JS
│   └── useKeyPress.js         # keyboard shortcuts
│
├── context/
│   ├── ThemeContext.jsx        # dark/light theme + localStorage
│   └── ToastContext.jsx        # global notifications với useReducer
│
├── components/
│   ├── ErrorBoundary.jsx      # Class Component, bắt render errors
│   ├── ScrollProgress.jsx     # progress bar đầu trang
│   ├── BackToTop.jsx          # nút scroll lên đầu
│   ├── Toast.jsx              # Portal-based toast system
│   └── CommandPalette.jsx     # Ctrl+K quick nav với forwardRef
│
├── App.jsx                    # main component, tích hợp tất cả
├── App.css                    # styles
├── index.css                  # global styles + CSS variables
└── main.jsx                   # entry point, StrictMode
```

---

## Quick Reference

```jsx
// 1. Persist state
const [val, setVal] = useLocalStorage('key', defaultValue);

// 2. Debounce input
const debounced = useDebounce(inputValue, 300);

// 3. Scroll progress
const { progress, pastThreshold } = useScrollProgress(400);

// 4. Active nav section
const activeId = useActiveSection(['section1', 'section2']);

// 5. Copy to clipboard
const { copied, copy } = useClipboard(2000);
await copy('text to copy');

// 6. Responsive
const isMobile = useMediaQuery('(max-width: 768px)');

// 7. Keyboard shortcut
useKeyPress('k', handler, { ctrl: true });

// 8. Toast
const { toast } = useToast();
toast.success('Done!');

// 9. Theme
const { theme, toggle } = useTheme();

// 10. Memo + Callback combo
const MyComp = memo(function MyComp({ onAction }) { ... });
const handleAction = useCallback(() => { ... }, [deps]);
<MyComp onAction={handleAction} />
```
