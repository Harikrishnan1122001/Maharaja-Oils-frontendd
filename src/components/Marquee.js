import { useEffect, useState } from "react";
import { settingsApi } from "../api/endpoints";

// Sensible fallback so the strip never looks broken before the admin has
// configured anything (or if the settings request fails).
const DEFAULT_ITEMS = ["100% Natural", "No Chemicals", "Transparent Sourcing"];
const DEFAULT_SPEED = 28;

// Bottom-of-site sliding marquee. Content (the list of ticker items, on/off
// switch, and scroll speed) is fully managed from the admin panel via
// Settings ➜ Marquee, so admins can add/update text without touching code.
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
        // Keep defaults on failure — the marquee still renders, just
        // with the fallback trust-tag copy instead of admin content.
      })
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  if (loaded && (!enabled || items.length === 0)) return null;

  // Duplicate the list so the track can loop from -50% back to 0%
  // seamlessly, with no visible seam or jump, regardless of how many
  // items the admin has added.
  const track = [...items, ...items];

  return (
    <div className="site-marquee" role="marquee" aria-label="Site highlights">
      <div
        className="site-marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {track.map((text, i) => (
          <span className="site-marquee-item" key={`${text}-${i}`}>
            <span className="site-marquee-text">{text}</span>
            <span className="site-marquee-dot" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
