'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const LANG_SWITCH_SCROLL_KEY = 'lang-switch-scroll-y';

export default function ScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    const saved = sessionStorage.getItem(LANG_SWITCH_SCROLL_KEY);

    if (saved === null) return;

    sessionStorage.removeItem(LANG_SWITCH_SCROLL_KEY);

    const targetY = Number(saved);

    if (!Number.isFinite(targetY)) return;

    // Не позволяем браузеру самостоятельно менять scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const html = document.documentElement;

    html.classList.add('scroll-restoring', 'no-transition');

    let cancelled = false;
    let frame = 0;

    const startTime = performance.now();
    const MAX_WAIT = 3000;

    const restoreScroll = () => {
      if (cancelled) return;

      window.scrollTo(0, targetY);

      // Делаем несколько попыток подряд.
      // Это важно, потому что Next.js может изменить scroll
      // уже после первого scrollTo().
      requestAnimationFrame(() => {
        if (cancelled) return;

        window.scrollTo(0, targetY);

        requestAnimationFrame(() => {
          if (cancelled) return;

          window.scrollTo(0, targetY);

          html.classList.remove('no-transition');

          requestAnimationFrame(() => {
            if (!cancelled) {
              html.classList.remove('scroll-restoring');
            }
          });
        });
      });
    };

    const checkPage = () => {
      if (cancelled) return;

      const documentHeight = document.documentElement.scrollHeight;

      const pageIsTallEnough = documentHeight >= targetY + window.innerHeight;

      const timeout = performance.now() - startTime >= MAX_WAIT;

      if (pageIsTallEnough || timeout) {
        restoreScroll();
        return;
      }

      frame = requestAnimationFrame(checkPage);
    };

    frame = requestAnimationFrame(checkPage);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);

      html.classList.remove('scroll-restoring', 'no-transition');
    };
  }, [pathname]);

  return null;
}
