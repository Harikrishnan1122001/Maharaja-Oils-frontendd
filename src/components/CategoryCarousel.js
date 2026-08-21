import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

// Carousel slider for browsing ALL product categories (replaces the old
// "first 4/5 categories only" static grid on the Home page). Clicking or
// tapping a slide is the category-selection action: it routes the user to
// /category/:slug, which renders the Shop page pre-filtered to that
// category (see App.js route + Shop.js).
const CategoryCarousel = ({ categories = [], loading = false }) => {
  const trackRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, categories.length, loading]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-cat-card]");
    const step = card ? card.offsetWidth + 22 : 260;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  const items = loading ? Array.from({ length: 5 }) : categories;

  return (
    <div style={styles.wrap} className="category-carousel-wrap">
      {!loading && canScrollPrev && (
        <button
          type="button"
          aria-label="Previous categories"
          onClick={() => scrollByCard(-1)}
          style={{ ...styles.navBtn, left: -6 }}
          className="category-carousel-nav category-carousel-nav-prev"
        >
          ‹
        </button>
      )}

      <div ref={trackRef} style={styles.track} className="category-carousel-track">
        {items.map((c, i) =>
          c ? (
            <Link
              key={c._id}
              to={`/category/${c.slug}`}
              data-cat-card
              className="card category-carousel-card"
              style={styles.catCard}
              aria-label={`Shop ${c.name}`}
            >
              <div style={styles.catImgWrap} className="category-carousel-img-wrap">
                {c.image?.url && <img src={c.image.url} alt={c.name} style={styles.catImg} />}
              </div>
              <span style={styles.catName}>{c.name}</span>
              <p style={styles.catDesc}>{c.description || "Pure, cold pressed and rich in nutrition."}</p>
              <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>Shop Now</span>
            </Link>
          ) : (
            <div key={i} data-cat-card className="skeleton category-carousel-card" style={{ ...styles.catCard, height: 300 }} />
          )
        )}
      </div>

      {!loading && canScrollNext && (
        <button
          type="button"
          aria-label="Next categories"
          onClick={() => scrollByCard(1)}
          style={{ ...styles.navBtn, right: -6 }}
          className="category-carousel-nav category-carousel-nav-next"
        >
          ›
        </button>
      )}

      {!loading && items.length > 1 && (
        <div className="category-carousel-hint" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
};

const styles = {
  wrap: { position: "relative", marginTop: 24 },
  track: {
    display: "flex",
    gap: 22,
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    scrollBehavior: "smooth",
    paddingBottom: 8,
    WebkitOverflowScrolling: "touch",
  },
  catCard: {
    textAlign: "center",
    padding: "26px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    flex: "0 0 auto",
    width: 220,
    scrollSnapAlign: "start",
  },
  catImgWrap: { width: "100%", maxWidth: 150, aspectRatio: "1/1.6", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--ivory-deep)", marginBottom: 6 },
  catImg: { width: "100%", height: "100%", objectFit: "contain" },
  catName: { fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", color: "var(--wood)", letterSpacing: "0.03em" },
  catDesc: { fontSize: "0.82rem", marginBottom: 6 },
  navBtn: {
    position: "absolute",
    top: "40%",
    transform: "translateY(-50%)",
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "1px solid var(--line)",
    background: "var(--white)",
    color: "var(--wood)",
    fontSize: "1.4rem",
    lineHeight: 1,
    cursor: "pointer",
    boxShadow: "var(--shadow-soft)",
    zIndex: 5,
  },
};

export default CategoryCarousel;
