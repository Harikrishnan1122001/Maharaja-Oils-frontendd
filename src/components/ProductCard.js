import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { wishlistApi } from "../api/endpoints";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);

  const sellPrice = (v) => (v.discountPrice > 0 ? v.discountPrice : v.price);
  const cheapestVariant = product.variants?.length
    ? [...product.variants].sort((a, b) => sellPrice(a) - sellPrice(b))[0]
    : null;
  const totalStock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!user) return (window.location.href = "/login");
    if (!cheapestVariant) return;
    setAdding(true);
    try {
      await addItem(product._id, cheapestVariant._id, 1);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return (window.location.href = "/login");
    try {
      if (wished) {
        await wishlistApi.remove(product._id);
        setWished(false);
      } else {
        await wishlistApi.add(product._id);
        setWished(true);
      }
    } catch {
      /* noop */
    }
  };

  return (
    <Link to={`/product/${product.slug}`} className="card" style={styles.card}>
      <div style={styles.imgWrap}>
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          style={styles.img}
          loading="lazy"
        />
        {product.images?.[1]?.url && (
          <img src={product.images[1].url} alt="" style={{ ...styles.img, ...styles.imgHover }} className="hover-img" loading="lazy" />
        )}
        <button
          onClick={handleWishlist}
          className={`btn-icon ${wished ? "active" : ""}`}
          style={styles.wishBtn}
          aria-label="Add to wishlist"
        >
          {wished ? "♥" : "♡"}
        </button>
        {product.tags?.includes("New") && <span className="badge badge-new" style={styles.badge}>New</span>}
        {totalStock > 0 && totalStock < 5 && <span className="badge badge-low" style={styles.badgeLow}>Only {totalStock} left</span>}
      </div>
      <div style={styles.body}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: 4 }}>{product.name}</h3>
        <p style={styles.desc}>{product.shortDescription}</p>
        <div style={styles.priceRow}>
          <div>
            {cheapestVariant && (
              <>
                <span style={styles.price}>₹{sellPrice(cheapestVariant)}</span>
                {cheapestVariant.discountPrice > 0 && cheapestVariant.discountPrice < cheapestVariant.price && (
                  <span style={styles.mrp}>₹{cheapestVariant.price}</span>
                )}
              </>
            )}
          </div>
          <button onClick={handleQuickAdd} className="btn btn-primary btn-sm" disabled={adding || totalStock === 0}>
            {totalStock === 0 ? "Sold Out" : adding ? "Adding…" : "Shop Now"}
          </button>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: { display: "block", overflow: "hidden", position: "relative", transition: "transform 0.15s ease, box-shadow 0.15s ease" },
  imgWrap: { position: "relative", aspectRatio: "1 / 1", overflow: "hidden", background: "var(--ivory-deep)", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" },
  img: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, transition: "opacity 0.25s ease" },
  imgHover: { opacity: 0 },
  wishBtn: { position: "absolute", top: 10, right: 10, zIndex: 2 },
  badge: { position: "absolute", top: 10, left: 10, zIndex: 2 },
  badgeLow: { position: "absolute", bottom: 10, left: 10, zIndex: 2 },
  body: { padding: "16px 16px 18px" },
  desc: { fontSize: "0.85rem", marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { fontWeight: 700, fontSize: "1.05rem", color: "var(--wood)" },
  mrp: { textDecoration: "line-through", color: "#B3A492", fontSize: "0.85rem", marginLeft: 8 },
};

export default ProductCard;
