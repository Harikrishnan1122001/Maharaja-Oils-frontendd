import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, subtotal, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;

  if (cart.items.length === 0) {
    return (
      <div className="empty-state">
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any oils yet.</p>
        <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px 70px" }}>
      <h1>Your Cart</h1>
      <div style={styles.grid}>
        <div>
          {cart.items.map((item) => (
            <div key={item._id} className="card" style={styles.itemRow}>
              <img src={item.image} alt={item.name} style={styles.itemImg} />
              <div style={{ flex: 1 }}>
                <Link to={`/product/${item.product}`} style={{ fontWeight: 600 }}>{item.name}</Link>
                {item.size && <p style={{ margin: "4px 0", fontSize: "0.85rem" }}>Size: {item.size}</p>}
                <p style={{ margin: 0, fontWeight: 700, color: "var(--amber-deep)" }}>₹{item.price}</p>
              </div>
              <div style={styles.qtyRow}>
                <button onClick={() => updateItem(item._id, item.quantity - 1)} className="btn-icon">−</button>
                <span style={{ minWidth: 20, textAlign: "center", fontWeight: 700 }}>{item.quantity}</span>
                <button onClick={() => updateItem(item._id, item.quantity + 1)} className="btn-icon">+</button>
              </div>
              <button onClick={() => removeItem(item._id)} style={styles.removeBtn} aria-label="Remove item">✕</button>
            </div>
          ))}
        </div>

        <div className="card" style={styles.summary}>
          <h3>Order Summary</h3>
          <div style={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div style={styles.summaryRow}><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
          <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: "1.1rem", borderTop: "1px solid var(--line)", paddingTop: 12 }}>
            <span>Total</span><span>₹{subtotal + shipping}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn btn-primary btn-block" style={{ marginTop: 16 }}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 30, marginTop: 24, alignItems: "flex-start" },
  itemRow: { display: "flex", alignItems: "center", gap: 16, padding: 16, marginBottom: 14 },
  itemImg: { width: 84, height: 84, objectFit: "cover", borderRadius: 10, background: "var(--ivory-deep)" },
  qtyRow: { display: "flex", alignItems: "center", gap: 10 },
  removeBtn: { background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "var(--clay)" },
  summary: { padding: 22, position: "sticky", top: 90 },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: 12, color: "var(--wood-soft)" },
};

export default Cart;
