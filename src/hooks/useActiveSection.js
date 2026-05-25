import { useState, useEffect, useRef } from 'react';

/**
 * useActiveSection
 * Dùng IntersectionObserver để biết section nào đang hiện trên màn hình.
 * Dùng: active nav link, reading progress indicator.
 *
 * rootMargin '-40% 0px -50% 0px' → chỉ kích hoạt khi element ở giữa viewport
 */
export function useActiveSection(sectionIds, options = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');
  // useRef giữ Map mà không trigger re-render
  const ratioRef = useRef({});

  useEffect(() => {
    const { rootMargin = '-40% 0px -50% 0px', threshold = 0 } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratioRef.current[entry.target.id] = entry.intersectionRatio;
        });

        // chọn section có intersectionRatio cao nhất
        const visible = Object.entries(ratioRef.current)
          .filter(([, r]) => r > 0)
          .sort(([, a], [, b]) => b - a);

        if (visible.length > 0) setActiveId(visible[0][0]);
      },
      { rootMargin, threshold },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, options]);

  return activeId;
}
