import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { wishlistApi } from "../api/endpoints";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishlistApi.get().then((res) => setItems(res.data.wishlist?.products || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 80, textAlign: "center" }}>Loading…</div>;

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h3>Your wishlist is empty</h3>
        <p>Save oils you love to come back to them later.</p>
        <Link to="/shop" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px 70px" }}>
      <h1>Your Wishlist</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 22, marginTop: 24 }}>
        {items.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
};

export default Wishlist;
