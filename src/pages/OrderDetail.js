import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { orderApi } from "../api/endpoints";
import OrderStatusStepper from "../components/OrderStatusStepper";

const OrderDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    orderApi.byId(id).then((res) => setOrder(res.data.order)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    setError("");
    try {
      const res = await orderApi.cancel(id);
      setOrder(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = order && !["Shipped", "Delivered", "Cancelled"].includes(order.orderStatus);

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

  if (loading) return <div style={{ padding: 80, textAlign: "center" }}>Loading…</div>;
  if (!order) return <div className="empty-state"><h3>Order not found</h3></div>;

  return (
    <div className="container" style={{ padding: "40px 20px 76px", maxWidth: 760 }}>
      {searchParams.get("success") && (
        <div className="form-success-banner">🎉 Your order was placed successfully! A confirmation email is on its way.</div>
      )}

      <Link to="/account/orders" style={styles.backLink}>← Back to Orders</Link>

      <div style={styles.headerRow}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 6 }}>Order Details</p>
          <h1 style={{ margin: 0 }}>#{order._id.slice(-8).toUpperCase()}</h1>
          <p style={styles.placedOn}>Placed on {new Date(order.createdAt).toLocaleString("en-IN")}</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={handleDownloadInvoice} disabled={downloadingInvoice} className="btn btn-primary btn-sm">
            {downloadingInvoice ? "Preparing…" : "⬇ Download Invoice"}
          </button>
          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling} className="btn btn-outline btn-sm">
              {cancelling ? "Cancelling…" : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <div className="card" style={{ marginTop: 18 }} data-reveal="1">
        <OrderStatusStepper status={order.orderStatus} />
      </div>

      <div className="card" style={styles.section} data-reveal="1">
        <h3 style={styles.sectionTitle}><span style={styles.sectionIcon}>🧴</span> Items</h3>
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

      <div style={styles.twoCol} className="split-grid">
        <div className="card" style={styles.section} data-reveal="2">
          <h3 style={styles.sectionTitle}><span style={styles.sectionIcon}>📍</span> Delivery Address</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <b>{order.shippingAddress.fullName}</b><br />
            {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
            {order.shippingAddress.landmark ? `, ${order.shippingAddress.landmark}` : ""}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
            Phone: {order.shippingAddress.phone}
          </p>
        </div>

        <div className="card" style={styles.section} data-reveal="3">
          <h3 style={styles.sectionTitle}><span style={styles.sectionIcon}>💳</span> Payment</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.9 }}>
            Method: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay (Online)"}<br />
            Paid: {order.isPaid ? `Yes, on ${new Date(order.paidAt).toLocaleString("en-IN")}` : "No"}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backLink: { fontSize: "0.85rem", color: "var(--wood-soft)", fontWeight: 600 },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginTop: 12 },
  placedOn: { margin: "6px 0 0", fontSize: "0.85rem", color: "var(--wood-soft)" },
  headerActions: { display: "flex", gap: 10, flexWrap: "wrap" },
  section: { padding: 22, marginTop: 16 },
  sectionTitle: { display: "flex", alignItems: "center", gap: 9, marginBottom: 16 },
  sectionIcon: { fontSize: "1.05rem" },
  itemRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 14 },
  itemImg: { width: 60, height: 60, objectFit: "cover", borderRadius: 8, background: "var(--ivory-deep)" },
  summaryBlock: { borderTop: "1px solid var(--line)", marginTop: 14, paddingTop: 14 },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.9rem", color: "var(--wood-soft)" },
  totalRow: { display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.02rem", color: "var(--wood)", paddingTop: 4 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 0 },
};

export default OrderDetail;
