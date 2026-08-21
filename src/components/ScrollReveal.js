import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Elements matching this selector fade + lift into view the first time they
// scroll into the viewport. Purely cosmetic — it only ever adds CSS classes,
// never touches markup, data or event handlers, so existing functionality
// is untouched. See the ".reveal" rules in styles/tokens.css.
const REVEAL_SELECTOR = ".section-head, .drip-divider, [data-reveal]";

/**
 * Mount once near the root of a layout (StoreLayout / AdminLayout). Re-scans
 * the DOM for revealable elements on every route change and observes any
 * that haven't already been revealed, so it works correctly with React
 * Router's client-side navigation and with content that loads in async
 * (product grids, order lists, etc — those elements simply get scanned once
 * the effect re-runs after their own data-driven render).
 */
const ScrollReveal = () => {
  const location = useLocation();

  useEffect(() => {
    // Enables the (initially-hidden) reveal styles only once JS is running,
    // so a script error or slow hydration never leaves content invisible.
    document.documentElement.classList.add("js-reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    const scan = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (!el.classList.contains("in-view") && !el.dataset.revealObserved) {
          el.dataset.revealObserved = "1";
          observer.observe(el);
        }
      });
    };

    scan();
    // Re-scan shortly after mount to catch content that renders after an
    // async fetch resolves (product lists, order details, etc).
    const rescan = setTimeout(scan, 400);

    return () => {
      clearTimeout(rescan);
      observer.disconnect();
    };
  }, [location.pathname]);

  return null;
};

export default ScrollReveal;
