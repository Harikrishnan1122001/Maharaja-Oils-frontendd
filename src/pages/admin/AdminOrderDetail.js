import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import OrderStatusStepper from "../../components/OrderStatusStepper";
import { adminApi, orderApi } from "../../api/endpoints";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    adminApi
      .orderById(id)
      .then((res) => setOrder(res.data.order))
      .catch((err) => setError(err.response?.data?.message || "Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (e) => {
    const orderStatus = e.target.value;
    setSaving(true);
    try {
      const res = await adminApi.updateOrderStatus(id, orderStatus);
      setOrder(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true);
    setError("");
    try {
      const res = await orderApi.invoice(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order._id.slice(-8).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Could not download invoice. Please try again.");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="empty-state card">
          <h3>Order not found</h3>
          <Link to="/admin/orders" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>← Back to Orders</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Link to="/admin/orders" style={styles.backLink}>← Back to Orders</Link>
      <div style={styles.headerRow}>
        <div>
          <p className="eyebrow">Order</p>
          <h1 style={{ marginBottom: 4 }}>#{order._id.slice(-8).toUpperCase()}</h1>
          <p style={{ margin: 0, color: "var(--wood-soft)", fontSize: "0.85rem" }}>
            Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>
        <div>
          <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4, color: "var(--wood-soft)" }}>Order Status</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select value={order.orderStatus} onChange={handleStatusChange} disabled={saving} style={styles.statusSelect}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={handleDownloadInvoice} disabled={downloadingInvoice} className="btn btn-primary btn-sm">
              {downloadingInvoice ? "Preparing…" : "⬇ Invoice"}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <div className="card" style={{ marginTop: 4, marginBottom: 20 }} data-reveal="1">
        <OrderStatusStepper status={order.orderStatus} />
      </div>

      <div style={styles.layout}>
        <div className="card" style={styles.section} data-reveal="1">
          <h3 style={styles.sectionTitle}><span style={styles.sectionIcon}>🧴</span> Items ({order.orderItems.length})</h3>
          {order.orderItems.map((item, i) => (
            <div key={i} style={styles.itemRow}>
              <img src={item.image} alt={item.name} style={styles.itemImg} />
              <div style={{ flex: 1 }}>
                <b>{item.name}</b>
                <p style={{ margin: "2px 0", fontSize: "0.85rem", color: "var(--wood-soft)" }}>Size: {item.size} × {item.quantity}</p>
              </div>
              <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={styles.summaryBlock}>
            <div style={styles.summaryRow}><span>Items</span><span>₹{order.itemsPrice}</span></div>
            {order.discountAmount > 0 && (
              <div style={styles.summaryRow}><span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span><span>−₹{order.discountAmount}</span></div>
            )}
            <div style={styles.summaryRow}><span>Shipping</span><span>{order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}</span></div>
            <div style={styles.totalRow}><span>Total</span><span>₹{order.totalPrice}</span></div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={styles.section} data-reveal="2">
            <h3 style={styles.sectionTitle}><span style={styles.sectionIcon}>👤</span> Customer</h3>
            <p style={{ margin: 0, lineHeight: 1.8 }}>
              {order.user?.name && (
                <>
                  <Link to={`/admin/users/${order.user._id}`} style={{ fontWeight: 600 }}>{order.user.name}</Link><br />
                </>
              )}
              {order.user?.email}<br />
              {order.user?.phone}
            </p>
          </div>

          <div className="card" style={styles.section} data-reveal="2">
            <h3 style={styles.sectionTitle}><span style={styles.sectionIcon}>📍</span> Delivery Address</h3>
            <p style={{ margin: 0, lineHeight: 1.8 }}>
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
              {order.shippingAddress.landmark ? `, ${order.shippingAddress.landmark}` : ""}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          <div className="card" style={styles.section} data-reveal="3">
            <h3 style={styles.sectionTitle}><span style={styles.sectionIcon}>💳</span> Payment</h3>
            <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.8 }}>
              Method: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay (Online)"}<br />
              Paid: {order.isPaid ? `Yes, on ${new Date(order.paidAt).toLocaleString("en-IN")}` : "No"}<br />
              {order.paymentResult?.razorpay_payment_id && <>Payment ID: {order.paymentResult.razorpay_payment_id}</>}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  backLink: { fontSize: "0.85rem", color: "var(--wood-soft)", fontWeight: 600 },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginTop: 8, marginBottom: 20 },
  layout: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" },
  section: { padding: 22 },
  sectionTitle: { display: "flex", alignItems: "center", gap: 9, marginBottom: 14 },
  sectionIcon: { fontSize: "1.05rem" },
  itemRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 14 },
  itemImg: { width: 56, height: 56, objectFit: "cover", borderRadius: 8, background: "var(--ivory-deep)" },
  summaryBlock: { borderTop: "1px solid var(--line)", marginTop: 14, paddingTop: 14 },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.9rem", color: "var(--wood-soft)" },
  totalRow: { display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.02rem", color: "var(--wood)", paddingTop: 4 },
  statusSelect: { padding: "9px 12px", borderRadius: 8, border: "1px solid var(--line)", fontWeight: 600 },
};

export default AdminOrderDetail;
