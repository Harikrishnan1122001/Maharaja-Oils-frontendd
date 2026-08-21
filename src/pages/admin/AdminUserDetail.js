import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../api/endpoints";
import { exportToExcel } from "../../utils/exportSheet";

const AdminUserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([adminApi.userById(id), adminApi.allOrders()])
      .then(([userRes, ordersRes]) => {
        setUser(userRes.data.user);
        setOrders(ordersRes.data.orders.filter((o) => o.user?._id === id));
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load user"))
      .finally(() => setLoading(false));
  }, [id]);

  const totals = useMemo(() => {
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    return { totalOrders, totalAmount };
  }, [orders]);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await adminApi.updateUserStatus(id, !user.isActive);
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setToggling(false);
    }
  };

  const handleExport = () => {
    exportToExcel(
      `${user?.name || "user"}-orders`,
      [
        { key: "id", label: "Order ID", value: (o) => o._id },
        { key: "date", label: "Date", value: (o) => new Date(o.createdAt).toLocaleString("en-IN") },
        { key: "items", label: "Items", value: (o) => o.orderItems?.length || 0 },
        { key: "totalPrice", label: "Total", value: (o) => o.totalPrice },
        { key: "status", label: "Status", value: (o) => o.orderStatus },
      ],
      orders
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="empty-state card">
          <h3>User not found</h3>
          <Link to="/admin/users" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>← Back to Users</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Link to="/admin/users" style={{ fontSize: "0.85rem" }}>← Back to Users</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginTop: 8, marginBottom: 20 }}>
        <div>
          <p className="eyebrow">User</p>
          <h1 style={{ marginBottom: 4 }}>{user.name}</h1>
          <span className={`badge ${user.isActive ? "badge-new" : "badge-sale"}`}>
            {user.isActive ? "Active" : "Blocked"}
          </span>
        </div>
        <button onClick={handleToggle} disabled={toggling} className="btn btn-outline btn-sm">
          {user.isActive ? "Block User" : "Unblock User"}
        </button>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <div style={styles.summaryRow}>
        <div className="card" style={styles.summaryCard}>
          <div style={styles.summaryValue}>{totals.totalOrders}</div>
          <div style={styles.summaryLabel}>Total Orders</div>
        </div>
        <div className="card" style={styles.summaryCard}>
          <div style={styles.summaryValue}>₹{totals.totalAmount.toLocaleString("en-IN")}</div>
          <div style={styles.summaryLabel}>Total Amount Spent</div>
        </div>
      </div>

      <div style={styles.layout}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ marginBottom: 10 }}>Contact Details</h3>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              Email: {user.email}<br />
              Phone: {user.phone}<br />
              Joined: {new Date(user.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ marginBottom: 10 }}>Addresses ({user.addresses?.length || 0})</h3>
            {(!user.addresses || user.addresses.length === 0) && (
              <p style={{ fontSize: "0.85rem", color: "var(--wood-soft)" }}>No saved addresses.</p>
            )}
            {user.addresses?.map((a) => (
              <div key={a._id} style={styles.addressBlock}>
                <b>{a.label}{a.isDefault ? " · Default" : ""}</b>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>
                  {a.fullName}<br />
                  {a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ""}{a.landmark ? `, ${a.landmark}` : ""}<br />
                  {a.city}, {a.state} - {a.pincode}<br />
                  Phone: {a.phone}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0 }}>Order History</h3>
            <button onClick={handleExport} className="btn btn-outline btn-sm" disabled={orders.length === 0}>
              ⬇ Excel
            </button>
          </div>
          {orders.length === 0 && <p style={{ fontSize: "0.85rem", color: "var(--wood-soft)" }}>No orders yet.</p>}
          {orders.map((o) => (
            <div key={o._id} style={styles.orderRow}>
              <div>
                <Link to={`/admin/orders/${o._id}`} style={{ fontWeight: 600 }}>#{o._id.slice(-8).toUpperCase()}</Link>
                <p style={{ margin: "2px 0", fontSize: "0.78rem", color: "var(--wood-soft)" }}>
                  {new Date(o.createdAt).toLocaleDateString("en-IN")} · {o.orderItems.length} item(s)
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600 }}>₹{o.totalPrice}</div>
                <span className="badge badge-new" style={{ fontSize: "0.7rem" }}>{o.orderStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  summaryRow: { display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  summaryCard: { padding: "16px 22px", minWidth: 180 },
  summaryValue: { fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-display)" },
  summaryLabel: { fontSize: "0.8rem", color: "var(--wood-soft)" },
  layout: { display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20, alignItems: "start" },
  addressBlock: { borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 10 },
  orderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", padding: "10px 0" },
};

export default AdminUserDetail;
