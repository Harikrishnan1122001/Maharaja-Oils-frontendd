// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import AdminLayout from "../../components/admin/AdminLayout";
// import { adminApi } from "../../api/endpoints";
// import { exportToExcel } from "../../utils/exportSheet";

// const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

// const statusColors = {
//   Pending: { bg: "#F6E3D8", color: "var(--clay)" },
//   Processing: { bg: "#FDEBC8", color: "#8A5A00" },
//   Shipped: { bg: "#DCE8F5", color: "#2A5C8A" },
//   Delivered: { bg: "#DDEEDD", color: "#2E7D32" },
//   Cancelled: { bg: "#F5D8D8", color: "#B23A3A" },
// };

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [search, setSearch] = useState("");
//   const [updatingId, setUpdatingId] = useState(null);

//   const loadOrders = () => {
//     setLoading(true);
//     adminApi
//       .allOrders()
//       .then((res) => setOrders(res.data.orders))
//       .catch((err) => setError(err.response?.data?.message || "Failed to load orders"))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const filtered = useMemo(() => {
//     return orders.filter((o) => {
//       const matchStatus = statusFilter ? o.orderStatus === statusFilter : true;
//       const q = search.trim().toLowerCase();
//       const matchSearch = q
//         ? o._id.toLowerCase().includes(q) ||
//           o.user?.name?.toLowerCase().includes(q) ||
//           o.user?.email?.toLowerCase().includes(q)
//         : true;
//       return matchStatus && matchSearch;
//     });
//   }, [orders, statusFilter, search]);

//   const totals = useMemo(() => {
//     const totalOrders = filtered.length;
//     const totalAmount = filtered.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
//     return { totalOrders, totalAmount };
//   }, [filtered]);

//   const handleStatusChange = async (id, orderStatus) => {
//     setUpdatingId(id);
//     try {
//       const res = await adminApi.updateOrderStatus(id, orderStatus);
//       setOrders((prev) => prev.map((o) => (o._id === id ? res.data.order : o)));
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update order status");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleExport = () => {
//     exportToExcel(
//       `orders-${new Date().toISOString().slice(0, 10)}`,
//       [
//         { key: "id", label: "Order ID", value: (o) => o._id },
//         { key: "date", label: "Date", value: (o) => new Date(o.createdAt).toLocaleString("en-IN") },
//         { key: "customer", label: "Customer", value: (o) => o.user?.name || "" },
//         { key: "email", label: "Email", value: (o) => o.user?.email || "" },
//         { key: "phone", label: "Phone", value: (o) => o.user?.phone || "" },
//         { key: "items", label: "Items", value: (o) => o.orderItems?.length || 0 },
//         { key: "itemsPrice", label: "Items Price", value: (o) => o.itemsPrice },
//         { key: "shippingPrice", label: "Shipping", value: (o) => o.shippingPrice },
//         { key: "totalPrice", label: "Total", value: (o) => o.totalPrice },
//         { key: "isPaid", label: "Paid", value: (o) => (o.isPaid ? "Yes" : "No") },
//         { key: "status", label: "Status", value: (o) => o.orderStatus },
//       ],
//       filtered
//     );
//   };

//   return (
//     <AdminLayout>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
//         <div>
//           <p className="eyebrow">Sales</p>
//           <h1 style={{ marginBottom: 0 }}>Orders</h1>
//         </div>
//         <button onClick={handleExport} className="btn btn-primary btn-sm" disabled={filtered.length === 0}>
//           ⬇ Download Excel Sheet
//         </button>
//       </div>

//       <div style={styles.summaryRow}>
//         <div className="card" style={styles.summaryCard}>
//           <div style={styles.summaryValue}>{totals.totalOrders}</div>
//           <div style={styles.summaryLabel}>Orders (filtered)</div>
//         </div>
//         <div className="card" style={styles.summaryCard}>
//           <div style={styles.summaryValue}>₹{totals.totalAmount.toLocaleString("en-IN")}</div>
//           <div style={styles.summaryLabel}>Total Amount (filtered)</div>
//         </div>
//       </div>

//       {error && <div className="form-error-banner">{error}</div>}

//       <div style={styles.filters}>
//         <input
//           type="text"
//           placeholder="Search by order id, name or email"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={styles.searchInput}
//         />
//         <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.statusSelect}>
//           <option value="">All Statuses</option>
//           {STATUS_OPTIONS.map((s) => (
//             <option key={s} value={s}>{s}</option>
//           ))}
//         </select>
//       </div>

//       {loading && <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />}

//       {!loading && filtered.length === 0 && (
//         <div className="empty-state card">
//           <h3>No orders found</h3>
//           <p>Try adjusting your search or filter.</p>
//         </div>
//       )}

//       {!loading && filtered.length > 0 && (
//         <div className="card" style={{ overflowX: "auto", padding: 0 }}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Order ID</th>
//                 <th style={styles.th}>Date</th>
//                 <th style={styles.th}>Customer</th>
//                 <th style={styles.th}>Items</th>
//                 <th style={styles.th}>Total</th>
//                 <th style={styles.th}>Paid</th>
//                 <th style={styles.th}>Status</th>
//                 <th style={styles.th}></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((o) => {
//                 const sc = statusColors[o.orderStatus] || statusColors.Pending;
//                 return (
//                   <tr key={o._id}>
//                     <td style={styles.td}>
//                       <Link to={`/admin/orders/${o._id}`} style={{ fontWeight: 600 }}>
//                         #{o._id.slice(-8).toUpperCase()}
//                       </Link>
//                     </td>
//                     <td style={styles.td}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
//                     <td style={styles.td}>
//                       <div>{o.user?.name}</div>
//                       <div style={{ fontSize: "0.78rem", color: "var(--wood-soft)" }}>{o.user?.email}</div>
//                     </td>
//                     <td style={styles.td}>{o.orderItems?.length}</td>
//                     <td style={styles.td}>₹{o.totalPrice}</td>
//                     <td style={styles.td}>{o.isPaid ? "✅" : "—"}</td>
//                     <td style={styles.td}>
//                       <select
//                         value={o.orderStatus}
//                         disabled={updatingId === o._id}
//                         onChange={(e) => handleStatusChange(o._id, e.target.value)}
//                         style={{ ...styles.statusPill, background: sc.bg, color: sc.color }}
//                       >
//                         {STATUS_OPTIONS.map((s) => (
//                           <option key={s} value={s}>{s}</option>
//                         ))}
//                       </select>
//                     </td>
//                     <td style={styles.td}>
//                       <Link to={`/admin/orders/${o._id}`} className="btn btn-outline btn-sm">View</Link>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </AdminLayout>
//   );
// };

// const styles = {
//   summaryRow: { display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" },
//   summaryCard: { padding: "16px 22px", minWidth: 180 },
//   summaryValue: { fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-display)" },
//   summaryLabel: { fontSize: "0.8rem", color: "var(--wood-soft)" },
//   filters: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
//   searchInput: { flex: 1, minWidth: 220, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)" },
//   statusSelect: { padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)" },
//   table: { width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", minWidth: 760 },
//   th: { textAlign: "left", padding: "12px 14px", borderBottom: "1.5px solid var(--line)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--wood-soft)" },
//   td: { padding: "12px 14px", borderBottom: "1px solid var(--line)", verticalAlign: "middle" },
//   statusPill: { border: "none", borderRadius: 20, padding: "6px 10px", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" },
// };

// export default AdminOrders;
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../api/endpoints";
import { exportToExcel } from "../../utils/exportSheet";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColors = {
  Pending: { bg: "#F6E3D8", color: "var(--clay)" },
  Processing: { bg: "#FDEBC8", color: "#8A5A00" },
  Shipped: { bg: "#DCE8F5", color: "#2A5C8A" },
  Delivered: { bg: "#DDEEDD", color: "#2E7D32" },
  Cancelled: { bg: "#F5D8D8", color: "#B23A3A" },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    adminApi
      .allOrders()
      .then((res) => setOrders(res.data.orders))
      .catch((err) => setError(err.response?.data?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter ? o.orderStatus === statusFilter : true;
      const q = search.trim().toLowerCase();
      const matchSearch = q
        ? o._id.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q)
        : true;
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  const totals = useMemo(() => {
    const totalOrders = filtered.length;
    const totalAmount = filtered.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    return { totalOrders, totalAmount };
  }, [filtered]);

  const handleStatusChange = async (id, orderStatus) => {
    setUpdatingId(id);
    try {
      const res = await adminApi.updateOrderStatus(id, orderStatus);
      setOrders((prev) => prev.map((o) => (o._id === id ? res.data.order : o)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = () => {
    exportToExcel(
      `orders-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: "id", label: "Order ID", value: (o) => o._id },
        { key: "date", label: "Date", value: (o) => new Date(o.createdAt).toLocaleString("en-IN") },
        { key: "customer", label: "Customer", value: (o) => o.user?.name || "" },
        { key: "email", label: "Email", value: (o) => o.user?.email || "" },
        { key: "phone", label: "Phone", value: (o) => o.user?.phone || "" },
        { key: "items", label: "Items", value: (o) => o.orderItems?.length || 0 },
        { key: "itemsPrice", label: "Items Price", value: (o) => o.itemsPrice },
        { key: "shippingPrice", label: "Shipping", value: (o) => o.shippingPrice },
        { key: "totalPrice", label: "Total", value: (o) => o.totalPrice },
        { key: "isPaid", label: "Paid", value: (o) => (o.isPaid ? "Yes" : "No") },
        { key: "status", label: "Status", value: (o) => o.orderStatus },
      ],
      filtered
    );
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <p className="eyebrow">Sales</p>
          <h1 style={{ marginBottom: 0 }}>Orders</h1>
        </div>
        <button onClick={handleExport} className="btn btn-primary btn-sm" disabled={filtered.length === 0}>
          ⬇ Download Excel Sheet
        </button>
      </div>

      <div style={styles.summaryRow}>
        <div className="card" style={styles.summaryCard}>
          <div style={styles.summaryValue}>{totals.totalOrders}</div>
          <div style={styles.summaryLabel}>Orders (filtered)</div>
        </div>
        <div className="card" style={styles.summaryCard}>
          <div style={styles.summaryValue}>₹{totals.totalAmount.toLocaleString("en-IN")}</div>
          <div style={styles.summaryLabel}>Total Amount (filtered)</div>
        </div>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <div className="admin-filters-row" style={styles.filters}>
        <input
          type="text"
          placeholder="Search by order id, name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
          style={styles.searchInput}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-status-select" style={styles.statusSelect}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />}

      {!loading && filtered.length === 0 && (
        <div className="empty-state card">
          <h3>No orders found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="card" style={{ overflowX: "auto", padding: 0 }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Paid</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const sc = statusColors[o.orderStatus] || statusColors.Pending;
                return (
                  <tr key={o._id}>
                    <td style={styles.td}>
                      <Link to={`/admin/orders/${o._id}`} style={{ fontWeight: 600 }}>
                        #{o._id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td style={styles.td}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                    <td style={styles.td}>
                      <div>{o.user?.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--wood-soft)" }}>{o.user?.email}</div>
                    </td>
                    <td style={styles.td}>{o.orderItems?.length}</td>
                    <td style={styles.td}>₹{o.totalPrice}</td>
                    <td style={styles.td}>{o.isPaid ? "✅" : "—"}</td>
                    <td style={styles.td}>
                      <select
                        value={o.orderStatus}
                        disabled={updatingId === o._id}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        style={{ ...styles.statusPill, background: sc.bg, color: sc.color }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td style={styles.td}>
                      <Link to={`/admin/orders/${o._id}`} className="btn btn-outline btn-sm">View</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

const styles = {
  summaryRow: { display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  summaryCard: { padding: "16px 22px", minWidth: 180 },
  summaryValue: { fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-display)" },
  summaryLabel: { fontSize: "0.8rem", color: "var(--wood-soft)" },
  filters: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  searchInput: { flex: 1, minWidth: 220, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)" },
  statusSelect: { padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", minWidth: 760 },
  th: { textAlign: "left", padding: "12px 14px", borderBottom: "1.5px solid var(--line)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--wood-soft)" },
  td: { padding: "12px 14px", borderBottom: "1px solid var(--line)", verticalAlign: "middle" },
  statusPill: { border: "none", borderRadius: 20, padding: "6px 10px", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" },
};

export default AdminOrders;