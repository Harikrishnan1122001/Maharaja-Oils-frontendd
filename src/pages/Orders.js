import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../api/endpoints";

const statusColor = { Pending: "badge-low", Processing: "badge-low", Shipped: "badge-new", Delivered: "badge-new", Cancelled: "badge-sale" };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.myOrders().then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: "40px 20px 70px", maxWidth: 820 }}>
      <h1>My Account</h1>
      <div style={styles.nav}>
        <Link to="/account" className="btn btn-outline btn-sm">Profile</Link>
        <Link to="/account/orders" className="btn btn-primary btn-sm">Orders</Link>
        <Link to="/account/addresses" className="btn btn-outline btn-sm">Addresses</Link>
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center" }}>Loading…</div>}

      {!loading && orders.length === 0 && (
        <div className="empty-state"><h3>No orders yet</h3><Link to="/shop" className="btn btn-primary">Shop Now</Link></div>
      )}

      <div style={{ marginTop: 20 }}>
        {orders.map((o) => (
          <Link key={o._id} to={`/account/orders/${o._id}`} className="card" style={styles.row}>
            <div>
              <b>Order #{o._id.slice(-8).toUpperCase()}</b>
              <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>{new Date(o.createdAt).toLocaleDateString()} · {o.orderItems.length} item(s)</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className={`badge ${statusColor[o.orderStatus] || "badge-low"}`}>{o.orderStatus}</span>
              <p style={{ margin: "6px 0 0", fontWeight: 700 }}>₹{o.totalPrice}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  nav: { display: "flex", gap: 10, marginTop: 10 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 18, marginBottom: 12 },
};

export default Orders;
