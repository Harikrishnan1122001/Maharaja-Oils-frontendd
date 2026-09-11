import { useEffect, useState } from "react";
import { settingsApi } from "../api/endpoints";
const DEFAULT_ITEMS = ["100% Natural", "No Chemicals", "Transparent Sourcing"];
const DEFAULT_SPEED = 22;
const Marquee = () => {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [enabled, setEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    settingsApi
      .get()
      .then((res) => {
        if (!alive) return;
        const m = res.data?.settings?.marquee;
        if (m) {
          if (Array.isArray(m.items) && m.items.length > 0) setItems(m.items);
          if (typeof m.enabled === "boolean") setEnabled(m.enabled);
          if (typeof m.speed === "number" && m.speed > 0) setSpeed(m.speed);
        }
      })
      .catch(() => {
      })
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);
  if (loaded && (!enabled || items.length === 0)) return null;
  const track = [...items, ...items];
  return (
    <div className="hero-marquee" role="marquee" aria-label="Site highlights">
      <div className="hero-marquee-track" style={{ animationDuration: `${speed}s` }}>
        {track.map((text, i) => (
          <span className="hero-marquee-item" key={`${text}-${i}`}>
            <span className="hero-marquee-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="hero-marquee-text">{text}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
export default Marquee;