// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { addressApi, orderApi, paymentApi } from "../api/endpoints";
// import { useAuth } from "../context/AuthContext";
// import { useCart } from "../context/CartContext";

// const emptyAddr = { label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "", landmark: "", city: "", state: "", pincode: "" };

// const Checkout = () => {
//   const { user } = useAuth();
//   const { cart, subtotal, refreshCart } = useCart();
//   const navigate = useNavigate();

//   const [addresses, setAddresses] = useState([]);
//   const [selectedId, setSelectedId] = useState("");
//   const [showNewAddr, setShowNewAddr] = useState(false);
//   const [newAddr, setNewAddr] = useState({ ...emptyAddr, fullName: user?.name || "", phone: user?.phone || "" });
//   const [paymentMethod, setPaymentMethod] = useState("razorpay");
//   const [error, setError] = useState("");
//   const [placing, setPlacing] = useState(false);

//   const shipping = subtotal > 999 ? 0 : 60;
//   const total = subtotal + shipping;

//   useEffect(() => {
//     addressApi.list().then((res) => {
//       setAddresses(res.data.addresses);
//       const def = res.data.addresses.find((a) => a.isDefault) || res.data.addresses[0];
//       if (def) setSelectedId(def._id);
//       else setShowNewAddr(true);
//     });
//   }, []);

//   const handleAddAddress = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await addressApi.add({ ...newAddr, isDefault: addresses.length === 0 });
//       setAddresses(res.data.addresses);
//       const latest = res.data.addresses[res.data.addresses.length - 1];
//       setSelectedId(latest._id);
//       setShowNewAddr(false);
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not save address");
//     }
//   };

//   const buildShippingAddress = () => {
//     const addr = addresses.find((a) => a._id === selectedId);
//     if (!addr) return null;
//     const { label, fullName, phone, addressLine1, addressLine2, landmark, city, state, pincode, country } = addr;
//     return { label, fullName, phone, addressLine1, addressLine2, landmark, city, state, pincode, country };
//   };

//   const placeOrder = async (paymentResult) => {
//     const shippingAddress = buildShippingAddress();
//     const res = await orderApi.place({
//       shippingAddress,
//       paymentMethod,
//       paymentResult: paymentResult || {},
//     });
//     await refreshCart();
//     navigate(`/account/orders/${res.data.order._id}?success=1`);
//   };

//   const handlePay = async () => {
//     if (!selectedId) return setError("Please select a delivery address");
//     setError("");
//     setPlacing(true);

//     try {
//       if (paymentMethod === "cod") {
//         await placeOrder();
//         return;
//       }

//       // Razorpay flow: create a razorpay order for the cart total, open checkout, verify, then place the order
//       const { data } = await paymentApi.createOrder(total);
//       const { order: razorpayOrder, key_id } = data;

//       const rzp = new window.Razorpay({
//         key: key_id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         name: "Maharaja Oils",
//         description: "Order Payment",
//         order_id: razorpayOrder.id,
//         image: "https://maharajaoils.com/assets/img/logo.png",
//         prefill: { name: user.name, email: user.email, contact: user.phone },
//         theme: { color: "#5C0E18" },
//         handler: async (response) => {
//           try {
//             await paymentApi.verify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             });
//             await placeOrder({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               status: "success",
//             });
//           } catch (err) {
//             setError("Payment verification failed. Contact support if amount was deducted.");
//             setPlacing(false);
//           }
//         },
//         modal: { ondismiss: () => setPlacing(false) },
//       });
//       rzp.on("payment.failed", () => {
//         setError("Payment failed. Please try again.");
//         setPlacing(false);
//       });
//       rzp.open();
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not start checkout");
//       setPlacing(false);
//     }
//   };

//   if (cart.items.length === 0) {
//     return (
//       <div className="empty-state">
//         <h3>Your cart is empty</h3>
//         <Link to="/shop" className="btn btn-primary">Shop Now</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container" style={{ padding: "40px 20px 70px" }}>
//       <h1>Checkout</h1>
//       {error && <div className="form-error-banner">{error}</div>}

//       <div style={styles.grid}>
//         <div>
//           <h3>Delivery Address</h3>
//           {addresses.map((a) => (
//             <label key={a._id} className="card" style={{ ...styles.addrCard, borderColor: selectedId === a._id ? "var(--amber)" : "var(--line)" }}>
//               <input type="radio" name="addr" checked={selectedId === a._id} onChange={() => setSelectedId(a._id)} />
//               <div>
//                 <b>{a.label}</b>
//                 <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>
//                   {a.fullName} — {a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ""}{a.landmark ? `, ${a.landmark}` : ""}, {a.city}, {a.state} - {a.pincode}
//                 </p>
//                 <p style={{ margin: "2px 0 0", fontSize: "0.85rem" }}>Phone: {a.phone}</p>
//               </div>
//             </label>
//           ))}

//           {!showNewAddr && (
//             <button className="btn btn-outline btn-sm" onClick={() => setShowNewAddr(true)}>+ Add New Address</button>
//           )}

//           {showNewAddr && (
//             <form onSubmit={handleAddAddress} className="card" style={{ padding: 18, marginTop: 14 }}>
//               <div className="field">
//                 <label>Label</label>
//                 <input value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} />
//               </div>
//               <div className="field">
//                 <label>Full Name</label>
//                 <input required value={newAddr.fullName} onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })} />
//               </div>
//               <div className="field">
//                 <label>Phone</label>
//                 <input required value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
//               </div>
//               <div className="field">
//                 <label>Address Line 1</label>
//                 <input required value={newAddr.addressLine1} onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })} />
//               </div>
//               <div className="field">
//                 <label>Address Line 2 (optional)</label>
//                 <input value={newAddr.addressLine2} onChange={(e) => setNewAddr({ ...newAddr, addressLine2: e.target.value })} />
//               </div>
//               <div className="field">
//                 <label>Landmark (optional)</label>
//                 <input value={newAddr.landmark} onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })} />
//               </div>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
//                 <div className="field">
//                   <label>City</label>
//                   <input required value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
//                 </div>
//                 <div className="field">
//                   <label>State</label>
//                   <input required value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
//                 </div>
//               </div>
//               <div className="field">
//                 <label>Pincode</label>
//                 <input required value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} />
//               </div>
//               <div style={{ display: "flex", gap: 10 }}>
//                 <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
//                 <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowNewAddr(false)}>Cancel</button>
//               </div>
//             </form>
//           )}

//           <div className="field" style={{ marginTop: 20 }}>
//             <label>Payment Method</label>
//             <div style={{ display: "flex", gap: 10 }}>
//               <label style={styles.payOption}>
//                 <input type="radio" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} /> Pay Online (Razorpay)
//               </label>
//               <label style={styles.payOption}>
//                 <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /> Cash on Delivery
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="card" style={styles.summary}>
//           <h3>Order Summary</h3>
//           {cart.items.map((i) => (
//             <div key={i._id} style={styles.summaryItem}>
//               <span>{i.name} {i.size ? `(${i.size})` : ""} × {i.quantity}</span>
//               <span>₹{i.price * i.quantity}</span>
//             </div>
//           ))}
//           <div style={{ ...styles.summaryItem, borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 6 }}>
//             <span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
//           </div>
//           <div style={{ ...styles.summaryItem, fontWeight: 700, fontSize: "1.1rem" }}>
//             <span>Total</span><span>₹{total}</span>
//           </div>
//           <button onClick={handlePay} className="btn btn-primary btn-block" disabled={placing} style={{ marginTop: 16 }}>
//             {placing ? "Processing…" : paymentMethod === "cod" ? "Place Order (COD)" : "Pay with Razorpay"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 30, marginTop: 24, alignItems: "flex-start" },
//   addrCard: { display: "flex", gap: 12, padding: 16, marginBottom: 12, border: "1.5px solid var(--line)", cursor: "pointer" },
//   payOption: { display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", border: "1px solid var(--line)", borderRadius: 8, padding: "8px 12px", cursor: "pointer" },
//   summary: { padding: 22, position: "sticky", top: 90 },
//   summaryItem: { display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: 10, color: "var(--wood-soft)" },
// };

// export default Checkout;
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addressApi, orderApi, paymentApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const emptyAddr = { label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "", landmark: "", city: "", state: "", pincode: "" };

const Checkout = () => {
  const { user } = useAuth();
  const { cart, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ ...emptyAddr, fullName: user?.name || "", phone: user?.phone || "" });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const shipping = subtotal > 999 ? 0 : 60;
  const total = subtotal + shipping;

  useEffect(() => {
    addressApi.list().then((res) => {
      setAddresses(res.data.addresses);
      const def = res.data.addresses.find((a) => a.isDefault) || res.data.addresses[0];
      if (def) setSelectedId(def._id);
      else setShowNewAddr(true);
    });
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await addressApi.add({ ...newAddr, isDefault: addresses.length === 0 });
      setAddresses(res.data.addresses);
      const latest = res.data.addresses[res.data.addresses.length - 1];
      setSelectedId(latest._id);
      setShowNewAddr(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save address");
    }
  };

  const buildShippingAddress = () => {
    const addr = addresses.find((a) => a._id === selectedId);
    if (!addr) return null;
    const { label, fullName, phone, addressLine1, addressLine2, landmark, city, state, pincode, country } = addr;
    return { label, fullName, phone, addressLine1, addressLine2, landmark, city, state, pincode, country };
  };

  const placeOrder = async (paymentResult) => {
    const shippingAddress = buildShippingAddress();
    const res = await orderApi.place({
      shippingAddress,
      paymentMethod,
      paymentResult: paymentResult || {},
    });
    await refreshCart();
    navigate(`/account/orders/${res.data.order._id}?success=1`);
  };

  const handlePay = async () => {
    if (!selectedId) return setError("Please select a delivery address");
    setError("");
    setPlacing(true);

    try {
      if (paymentMethod === "cod") {
        await placeOrder();
        return;
      }

      // Razorpay flow: create a razorpay order for the cart total, open checkout, verify, then place the order
      const { data } = await paymentApi.createOrder(total);
      const { order: razorpayOrder, key_id } = data;

      const rzp = new window.Razorpay({
        key: key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Maharaja Oils",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        image: "https://maharajaoils.com/assets/img/logo.png",
        prefill: { name: user.name, email: user.email, contact: user.phone },
        theme: { color: "#5C0E18" },
        handler: async (response) => {
          try {
            await paymentApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await placeOrder({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              status: "success",
            });
          } catch (err) {
            setError("Payment verification failed. Contact support if amount was deducted.");
            setPlacing(false);
          }
        },
        modal: { ondismiss: () => setPlacing(false) },
      });
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setPlacing(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not start checkout");
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="empty-state">
        <h3>Your cart is empty</h3>
        <Link to="/shop" className="btn btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px 70px" }}>
      <h1>Checkout</h1>
      {error && <div className="form-error-banner">{error}</div>}

      <div style={styles.grid} className="checkout-grid">
        <div>
          <h3>Delivery Address</h3>
          {addresses.map((a) => (
            <label key={a._id} className="card" style={{ ...styles.addrCard, borderColor: selectedId === a._id ? "var(--amber)" : "var(--line)" }}>
              <input type="radio" name="addr" checked={selectedId === a._id} onChange={() => setSelectedId(a._id)} />
              <div>
                <b>{a.label}</b>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>
                  {a.fullName} — {a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ""}{a.landmark ? `, ${a.landmark}` : ""}, {a.city}, {a.state} - {a.pincode}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "0.85rem" }}>Phone: {a.phone}</p>
              </div>
            </label>
          ))}

          {!showNewAddr && (
            <button className="btn btn-outline btn-sm" onClick={() => setShowNewAddr(true)}>+ Add New Address</button>
          )}

          {showNewAddr && (
            <form onSubmit={handleAddAddress} className="card" style={{ padding: 18, marginTop: 14 }}>
              <div className="field">
                <label>Label</label>
                <input value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} />
              </div>
              <div className="field">
                <label>Full Name</label>
                <input required value={newAddr.fullName} onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input required value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
              </div>
              <div className="field">
                <label>Address Line 1</label>
                <input required value={newAddr.addressLine1} onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })} />
              </div>
              <div className="field">
                <label>Address Line 2 (optional)</label>
                <input value={newAddr.addressLine2} onChange={(e) => setNewAddr({ ...newAddr, addressLine2: e.target.value })} />
              </div>
              <div className="field">
                <label>Landmark (optional)</label>
                <input value={newAddr.landmark} onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field">
                  <label>City</label>
                  <input required value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
                </div>
                <div className="field">
                  <label>State</label>
                  <input required value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label>Pincode</label>
                <input required value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowNewAddr(false)}>Cancel</button>
              </div>
            </form>
          )}

          <div className="field" style={{ marginTop: 20 }}>
            <label>Payment Method</label>
            <div style={{ display: "flex", gap: 10 }} className="checkout-payment-row">
              <label style={styles.payOption} className="checkout-payment-option">
                <input type="radio" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} /> Pay Online (Razorpay)
              </label>
              <label style={styles.payOption} className="checkout-payment-option">
                <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /> Cash on Delivery
              </label>
            </div>
          </div>
        </div>

        <div className="card" style={styles.summary}>
          <h3>Order Summary</h3>
          {cart.items.map((i) => (
            <div key={i._id} style={styles.summaryItem}>
              <span>{i.name} {i.size ? `(${i.size})` : ""} × {i.quantity}</span>
              <span>₹{i.price * i.quantity}</span>
            </div>
          ))}
          <div style={{ ...styles.summaryItem, borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 6 }}>
            <span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          <div style={{ ...styles.summaryItem, fontWeight: 700, fontSize: "1.1rem" }}>
            <span>Total</span><span>₹{total}</span>
          </div>
          <button onClick={handlePay} className="btn btn-primary btn-block" disabled={placing} style={{ marginTop: 16 }}>
            {placing ? "Processing…" : paymentMethod === "cod" ? "Place Order (COD)" : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 30, marginTop: 24, alignItems: "flex-start" },
  addrCard: { display: "flex", gap: 12, padding: 16, marginBottom: 12, border: "1.5px solid var(--line)", cursor: "pointer" },
  payOption: { display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", border: "1px solid var(--line)", borderRadius: 8, padding: "8px 12px", cursor: "pointer" },
  summary: { padding: 22, position: "sticky", top: 90 },
  summaryItem: { display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: 10, color: "var(--wood-soft)" },
};

export default Checkout;