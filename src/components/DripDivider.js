// Signature element: a trail of oil drops used as a section divider
// throughout the site instead of a generic hairline rule.
const DripDivider = () => (
  <div className="drip-divider" aria-hidden="true">
    <svg width="60" height="14" viewBox="0 0 60 14" fill="none">
      <circle cx="4" cy="7" r="2.4" fill="currentColor" opacity="0.35" />
      <path d="M20 2 C23 2 25 5.5 25 8 C25 10.5 23 12.5 20 12.5 C17 12.5 15 10.5 15 8 C15 5.5 17 2 20 2 Z" fill="currentColor" opacity="0.7" />
      <circle cx="35" cy="7" r="3" fill="currentColor" />
      <circle cx="50" cy="7" r="1.8" fill="currentColor" opacity="0.4" />
    </svg>
  </div>
);

export default DripDivider;
