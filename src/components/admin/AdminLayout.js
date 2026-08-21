// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import ScrollReveal from "../ScrollReveal";

// const links = [
//   { to: "/admin", label: "Dashboard", end: true, icon: "▦" },
//   { to: "/admin/categories", label: "Categories", icon: "▤" },
//   { to: "/admin/products", label: "Products", icon: "◫" },
//   { to: "/admin/orders", label: "Orders", icon: "📦" },
//   { to: "/admin/users", label: "Users", icon: "👤" },
//   { to: "/admin/banners", label: "Banners", icon: "🖼" },
// ];

// const AdminLayout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div style={styles.shell}>
//       <ScrollReveal />
//       <aside style={styles.sidebar}>
//         <div style={styles.brand}>
//           <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>Maharaja</span>
//           <span style={styles.brandSub}>Admin Panel</span>
//         </div>
//         <nav style={styles.nav}>
//           {links.map((l) => (
//             <NavLink
//               key={l.to}
//               to={l.to}
//               end={l.end}
//               style={({ isActive }) => ({
//                 ...styles.navItem,
//                 ...(isActive ? styles.navItemActive : {}),
//               })}
//             >
//               <span style={{ fontSize: "1.05rem" }}>{l.icon}</span> {l.label}
//             </NavLink>
//           ))}
//         </nav>
//         <div style={styles.sidebarFooter}>
//           <div style={{ fontSize: "0.85rem", color: "var(--ivory-deep)" }}>{user?.name}</div>
//           <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
//           <NavLink to="/" style={styles.backLink}>← Back to store</NavLink>
//         </div>
//       </aside>
//       <main style={styles.content}>{children}</main>
//     </div>
//   );
// };

// const styles = {
//   shell: { display: "flex", minHeight: "100vh", background: "var(--ivory)" },
//   sidebar: {
//     width: 230, flexShrink: 0, background: "var(--wood)", color: "var(--ivory)",
//     display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh",
//   },
//   brand: { marginBottom: 30, paddingLeft: 8, display: "flex", flexDirection: "column" },
//   brandSub: { fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--saffron)", marginTop: 2 },
//   nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
//   navItem: {
//     display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 8,
//     color: "var(--ivory-deep)", fontWeight: 600, fontSize: "0.92rem",
//   },
//   navItemActive: { background: "var(--wood-soft)", color: "var(--white)" },
//   sidebarFooter: { borderTop: "1px solid var(--wood-soft)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 },
//   logoutBtn: {
//     background: "var(--clay)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 12px",
//     fontWeight: 600, cursor: "pointer", fontSize: "0.85rem",
//   },
//   backLink: { fontSize: "0.8rem", color: "var(--saffron)" },
//   content: { flex: 1, padding: "32px 40px", maxWidth: "calc(100% - 230px)" },
// };

// export default AdminLayout;
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ScrollReveal from "../ScrollReveal";

const links = [
  { to: "/admin", label: "Dashboard", end: true, icon: "▦" },
  { to: "/admin/categories", label: "Categories", icon: "▤" },
  { to: "/admin/products", label: "Products", icon: "◫" },
  { to: "/admin/orders", label: "Orders", icon: "📦" },
  { to: "/admin/users", label: "Users", icon: "👤" },
  { to: "/admin/banners", label: "Banners", icon: "🖼" },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={styles.shell} className="admin-shell">
      <ScrollReveal />

      {/* Mobile-only top bar: hamburger to open the sidebar as a drawer */}
      <div className="admin-topbar">
        <button
          type="button"
          className="admin-topbar-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open admin menu"
        >
          ☰
        </button>
        <span className="admin-topbar-title">Maharaja Admin</span>
      </div>

      {sidebarOpen && (
        <div className="admin-backdrop" onClick={closeSidebar} aria-hidden="true" />
      )}

      <aside style={styles.sidebar} className={`admin-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div style={styles.brand}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>Maharaja</span>
          <span style={styles.brandSub}>Admin Panel</span>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close admin menu"
          >
            ✕
          </button>
        </div>
        <nav style={styles.nav}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={closeSidebar}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <span style={{ fontSize: "1.05rem" }}>{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={{ fontSize: "0.85rem", color: "var(--ivory-deep)" }}>{user?.name}</div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          <NavLink to="/" style={styles.backLink}>← Back to store</NavLink>
        </div>
      </aside>
      <main style={styles.content} className="admin-content">{children}</main>
    </div>
  );
};

const styles = {
  shell: { display: "flex", minHeight: "100vh", background: "var(--ivory)" },
  sidebar: {
    width: 230, flexShrink: 0, background: "var(--wood)", color: "var(--ivory)",
    display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh",
  },
  brand: { marginBottom: 30, paddingLeft: 8, display: "flex", flexDirection: "column", position: "relative" },
  brandSub: { fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--saffron)", marginTop: 2 },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: {
    display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 8,
    color: "var(--ivory-deep)", fontWeight: 600, fontSize: "0.92rem",
  },
  navItemActive: { background: "var(--wood-soft)", color: "var(--white)" },
  sidebarFooter: { borderTop: "1px solid var(--wood-soft)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 },
  logoutBtn: {
    background: "var(--clay)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 12px",
    fontWeight: 600, cursor: "pointer", fontSize: "0.85rem",
  },
  backLink: { fontSize: "0.8rem", color: "var(--saffron)" },
  content: { flex: 1, padding: "32px 40px", maxWidth: "calc(100% - 230px)" },
};

export default AdminLayout;