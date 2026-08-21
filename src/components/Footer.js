// import { Link } from "react-router-dom";

// const Footer = () => (
//   <footer style={styles.footer}>
//     <div className="container footer-grid" style={styles.grid}>
//       <div>
//         <div style={styles.brandRow}>
//           <img src="https://maharajaoils.com/assets/img/logo.png" alt="Maharaja Oils" style={{ height: 44 }} />
//           <div>
//             <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--ivory)" }}>Maharaja Oils</div>
//             <div style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--saffron)" }}>Taste of Tradition</div>
//           </div>
//         </div>
//         <p style={{ color: "var(--ivory-deep)", maxWidth: 280, marginTop: 14 }}>
//           Bringing the goodness of traditionally cold pressed oils from the heart of Karaikudi to your home.
//         </p>
//         <div style={styles.socialRow}>
//           <span style={styles.socialIcon}>f</span>
//           <span style={styles.socialIcon}>◎</span>
//           <span style={styles.socialIcon}>▶</span>
//         </div>
//       </div>

//       <div>
//         <h4 style={styles.h4}>Quick Links</h4>
//         <Link style={styles.link} to="/">Home</Link>
//         <Link style={styles.link} to="/about">About Us</Link>
//         <Link style={styles.link} to="/shop">Our Products</Link>
//         <Link style={styles.link} to="/contact">Contact Us</Link>
//       </div>

//       <div>
//         <h4 style={styles.h4}>Our Products</h4>
//         <Link style={styles.link} to="/category/gingelly-oil">Gingelly Oil</Link>
//         <Link style={styles.link} to="/category/groundnut-oil">Groundnut Oil</Link>
//         <Link style={styles.link} to="/category/coconut-oil">Coconut Oil</Link>
//         <Link style={styles.link} to="/category/idly-podi-health-mix">Idly Podi &amp; Health Mix</Link>
//       </div>

//       <div>
//         <h4 style={styles.h4}>Customer Care</h4>
//         <Link style={styles.link} to="/account/orders">Shipping &amp; Refunds</Link>
//         <Link style={styles.link} to="/account/orders">Returns &amp; Refunds</Link>
//         <Link style={styles.link} to="/contact">Terms &amp; Conditions</Link>
//         <Link style={styles.link} to="/contact">Privacy Policy</Link>
//       </div>

//       <div>
//         <h4 style={styles.h4}>Contact Us</h4>
//         <p style={{ color: "var(--ivory-deep)", marginBottom: 6, fontSize: "0.9rem" }}>Sangam Thidal, Near Ayyanar Kovil, Karaikudi - 630003</p>
//         <p style={{ color: "var(--ivory-deep)", marginBottom: 6, fontSize: "0.9rem" }}>+91 73733 22866</p>
//         <p style={{ color: "var(--ivory-deep)", fontSize: "0.9rem" }}>maharajaoilmill@gmail.com</p>
//       </div>
//     </div>
//     <div style={styles.bottom}>© {new Date().getFullYear()} Maharaja Oils. All rights reserved.</div>
//   </footer>
// );

// const styles = {
//   footer: { background: "var(--wood)", color: "var(--ivory)", marginTop: 60, paddingTop: 50 },
//   grid: { display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1.2fr", gap: 32, paddingBottom: 30 },
//   brandRow: { display: "flex", alignItems: "center", gap: 12 },
//   socialRow: { display: "flex", gap: 10, marginTop: 16 },
//   socialIcon: {
//     width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--saffron)",
//     color: "var(--saffron)", display: "inline-flex", alignItems: "center", justifyContent: "center",
//     fontSize: "0.8rem",
//   },
//   h4: { color: "var(--saffron)", fontSize: "0.95rem", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" },
//   link: { display: "block", color: "var(--ivory-deep)", marginBottom: 9, fontSize: "0.88rem" },
//   bottom: { borderTop: "1px solid rgba(255,255,255,0.12)", textAlign: "center", padding: "18px 20px", fontSize: "0.8rem", color: "var(--ivory-deep)", background: "var(--maroon-dark)" },
// };

// export default Footer;
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [open, setOpen] = useState({ links: false, products: false, care: false, contact: false });
  const toggle = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }));

  const FooterCol = ({ id, title, children }) => (
    <div className="footer-col">
      <button
        type="button"
        className="footer-col-toggle"
        onClick={() => toggle(id)}
        aria-expanded={open[id]}
      >
        <h4 style={styles.h4}>{title}</h4>
        <span className="footer-toggle-icon">{open[id] ? "−" : "+"}</span>
      </button>
      <div className={`footer-col-body${open[id] ? " is-open" : ""}`}>{children}</div>
    </div>
  );

  return (
    <footer style={styles.footer}>
      <div className="container footer-grid" style={styles.grid}>
        <div>
          <div style={styles.brandRow}>
            <img src="https://maharajaoils.com/assets/img/logo.png" alt="Maharaja Oils" style={{ height: 44 }} />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--ivory)" }}>Maharaja Oils</div>
              <div style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--saffron)" }}>Taste of Tradition</div>
            </div>
          </div>
          <p style={{ color: "var(--ivory-deep)", maxWidth: 280, marginTop: 14 }}>
            Bringing the goodness of traditionally cold pressed oils from the heart of Karaikudi to your home.
          </p>
          <div style={styles.socialRow}>
            <span style={styles.socialIcon}>f</span>
            <span style={styles.socialIcon}>◎</span>
            <span style={styles.socialIcon}>▶</span>
          </div>
        </div>

        <FooterCol id="links" title="Quick Links">
          <Link style={styles.link} to="/">Home</Link>
          <Link style={styles.link} to="/about">About Us</Link>
          <Link style={styles.link} to="/shop">Our Products</Link>
          <Link style={styles.link} to="/contact">Contact Us</Link>
        </FooterCol>

        <FooterCol id="products" title="Our Products">
          <Link style={styles.link} to="/category/gingelly-oil">Gingelly Oil</Link>
          <Link style={styles.link} to="/category/groundnut-oil">Groundnut Oil</Link>
          <Link style={styles.link} to="/category/coconut-oil">Coconut Oil</Link>
          <Link style={styles.link} to="/category/idly-podi-health-mix">Idly Podi &amp; Health Mix</Link>
        </FooterCol>

        <FooterCol id="care" title="Customer Care">
          <Link style={styles.link} to="/account/orders">Shipping &amp; Refunds</Link>
          <Link style={styles.link} to="/account/orders">Returns &amp; Refunds</Link>
          <Link style={styles.link} to="/contact">Terms &amp; Conditions</Link>
          <Link style={styles.link} to="/contact">Privacy Policy</Link>
        </FooterCol>

        <FooterCol id="contact" title="Contact Us">
          <p style={{ color: "var(--ivory-deep)", marginBottom: 6, fontSize: "0.9rem" }}>Sangam Thidal, Near Ayyanar Kovil, Karaikudi - 630003</p>
          <p style={{ color: "var(--ivory-deep)", marginBottom: 6, fontSize: "0.9rem" }}>+91 73733 22866</p>
          <p style={{ color: "var(--ivory-deep)", fontSize: "0.9rem" }}>maharajaoilmill@gmail.com</p>
        </FooterCol>
      </div>
      <div style={styles.bottom}>© {new Date().getFullYear()} Maharaja Oils. All rights reserved.</div>
    </footer>
  );
};

const styles = {
  footer: { background: "var(--wood)", color: "var(--ivory)", marginTop: 60, paddingTop: 50 },
  grid: { display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1.2fr", gap: 32, paddingBottom: 30 },
  brandRow: { display: "flex", alignItems: "center", gap: 12 },
  socialRow: { display: "flex", gap: 10, marginTop: 16 },
  socialIcon: {
    width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--saffron)",
    color: "var(--saffron)", display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.8rem",
  },
  h4: { color: "var(--saffron)", fontSize: "0.95rem", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" },
  link: { display: "block", color: "var(--ivory-deep)", marginBottom: 9, fontSize: "0.88rem" },
  bottom: { borderTop: "1px solid rgba(255,255,255,0.12)", textAlign: "center", padding: "18px 20px", fontSize: "0.8rem", color: "var(--ivory-deep)", background: "var(--maroon-dark)" },
};

export default Footer;