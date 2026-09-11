import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const REVEAL_SELECTOR = ".section-head, .drip-divider, [data-reveal]";
const ScrollReveal = () => {
  const location = useLocation();
  useEffect(() => {
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
    const rescan = setTimeout(scan, 400);
    return () => {
      clearTimeout(rescan);
      observer.disconnect();
    };
  }, [location.pathname]);
  return null;
};
export default ScrollReveal;