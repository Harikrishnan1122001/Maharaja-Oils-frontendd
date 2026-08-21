// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import AdminLayout from "../../components/admin/AdminLayout";
// import { adminApi } from "../../api/endpoints";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     adminApi
//       .dashboard()
//       .then((res) => setStats(res.data.stats))
//       .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"))
//       .finally(() => setLoading(false));
//   }, []);

//   const cards = stats
//     ? [
//         { label: "Total Users", value: stats.totalUsers, icon: "👤" },
//         { label: "Paid Orders", value: stats.totalOrders, icon: "📦" },
//         { label: "Total Products", value: stats.totalProducts, icon: "◫" },
//         { label: "Total Revenue", value: `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`, icon: "₹" },
//         { label: "Low Stock Items", value: stats.lowStockCount, icon: "⚠", warn: stats.lowStockCount > 0 },
//       ]
//     : [];

//   return (
//     <AdminLayout>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
//         <div>
//           <p className="eyebrow">Overview</p>
//           <h1 style={{ marginBottom: 0 }}>Admin Dashboard</h1>
//         </div>
//         <div style={{ display: "flex", gap: 10 }}>
//           <Link to="/admin/categories" className="btn btn-outline btn-sm">+ Add Category</Link>
//           <Link to="/admin/products" className="btn btn-primary btn-sm">+ Add Product</Link>
//         </div>
//       </div>

//       {loading && <div className="skeleton" style={{ height: 120, borderRadius: 16 }} />}
//       {error && <div className="form-error-banner">{error}</div>}

//       {stats && (
//         <div style={styles.grid}>
//           {cards.map((c) => (
//             <div key={c.label} className="card" style={{ ...styles.statCard, ...(c.warn ? styles.statCardWarn : {}) }}>
//               <div style={styles.statIcon}>{c.icon}</div>
//               <div>
//                 <div style={styles.statValue}>{c.value}</div>
//                 <div style={styles.statLabel}>{c.label}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="drip-divider" />

//       <div style={styles.quickGrid}>
//         <Link to="/admin/categories" className="card" style={styles.quickCard}>
//           <h3>Manage Categories</h3>
//           <p>Create, edit, and organize product categories shown on the storefront.</p>
//         </Link>
//         <Link to="/admin/products" className="card" style={styles.quickCard}>
//           <h3>Manage Products</h3>
//           <p>Add new oils and podi products, set variants, pricing, and stock.</p>
//         </Link>
//         <Link to="/admin/orders" className="card" style={styles.quickCard}>
//           <h3>Manage Orders</h3>
//           <p>View order details, update status, and download the orders Excel sheet.</p>
//         </Link>
//         <Link to="/admin/users" className="card" style={styles.quickCard}>
//           <h3>Manage Users</h3>
//           <p>View customer details, order history, and block/unblock accounts.</p>
//         </Link>
//         <Link to="/admin/banners" className="card" style={styles.quickCard}>
//           <h3>Manage Banners</h3>
//           <p>Add and remove homepage and sitewide promotional banners.</p>
//         </Link>
//       </div>
//     </AdminLayout>
//   );
// };

// const styles = {
//   grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16 },
//   statCard: { padding: 22, display: "flex", alignItems: "center", gap: 14 },
//   statCardWarn: { border: "1.5px solid var(--clay)" },
//   statIcon: { fontSize: "1.6rem" },
//   statValue: { fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)" },
//   statLabel: { fontSize: "0.8rem", color: "var(--wood-soft)" },
//   quickGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 },
//   quickCard: { padding: 24, transition: "box-shadow 0.15s ease" },
// };

// export default AdminDashboard;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../api/endpoints";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .dashboard()
      .then((res) => setStats(res.data.stats))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: "👤" },
        { label: "Paid Orders", value: stats.totalOrders, icon: "📦" },
        { label: "Total Products", value: stats.totalProducts, icon: "◫" },
        { label: "Total Revenue", value: `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`, icon: "₹" },
        { label: "Low Stock Items", value: stats.lowStockCount, icon: "⚠", warn: stats.lowStockCount > 0 },
      ]
    : [];

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26, flexWrap: "wrap", gap: 12 }} className="admin-dashboard-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 style={{ marginBottom: 0 }}>Admin Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/categories" className="btn btn-outline btn-sm">+ Add Category</Link>
          <Link to="/admin/products" className="btn btn-primary btn-sm">+ Add Product</Link>
        </div>
      </div>

      {loading && <div className="skeleton" style={{ height: 120, borderRadius: 16 }} />}
      {error && <div className="form-error-banner">{error}</div>}

      {stats && (
        <div style={styles.grid}>
          {cards.map((c) => (
            <div key={c.label} className="card" style={{ ...styles.statCard, ...(c.warn ? styles.statCardWarn : {}) }}>
              <div style={styles.statIcon}>{c.icon}</div>
              <div>
                <div style={styles.statValue}>{c.value}</div>
                <div style={styles.statLabel}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="drip-divider" />

      <div style={styles.quickGrid}>
        <Link to="/admin/categories" className="card" style={styles.quickCard}>
          <h3>Manage Categories</h3>
          <p>Create, edit, and organize product categories shown on the storefront.</p>
        </Link>
        <Link to="/admin/products" className="card" style={styles.quickCard}>
          <h3>Manage Products</h3>
          <p>Add new oils and podi products, set variants, pricing, and stock.</p>
        </Link>
        <Link to="/admin/orders" className="card" style={styles.quickCard}>
          <h3>Manage Orders</h3>
          <p>View order details, update status, and download the orders Excel sheet.</p>
        </Link>
        <Link to="/admin/users" className="card" style={styles.quickCard}>
          <h3>Manage Users</h3>
          <p>View customer details, order history, and block/unblock accounts.</p>
        </Link>
        <Link to="/admin/banners" className="card" style={styles.quickCard}>
          <h3>Manage Banners</h3>
          <p>Add and remove homepage and sitewide promotional banners.</p>
        </Link>
      </div>
    </AdminLayout>
  );
};

const styles = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16 },
  statCard: { padding: 22, display: "flex", alignItems: "center", gap: 14 },
  statCardWarn: { border: "1.5px solid var(--clay)" },
  statIcon: { fontSize: "1.6rem" },
  statValue: { fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)" },
  statLabel: { fontSize: "0.8rem", color: "var(--wood-soft)" },
  quickGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 },
  quickCard: { padding: 24, transition: "box-shadow 0.15s ease" },
};

export default AdminDashboard;