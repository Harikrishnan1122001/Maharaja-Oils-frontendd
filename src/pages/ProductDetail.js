import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productApi, wishlistApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMessage("");
    productApi
      .bySlug(slug)
      .then((res) => {
        setProduct(res.data.product);
        setSelectedVariant(res.data.product.variants?.[0] || null);
        setActiveImg(0);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) return (window.location.href = "/login");
    if (!selectedVariant) return;
    setAdding(true);
    setMessage("");
    try {
      await addItem(product._id, selectedVariant._id, qty);
      setMessage("Added to cart!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) return (window.location.href = "/login");
    if (wished) {
      await wishlistApi.remove(product._id);
      setWished(false);
    } else {
      await wishlistApi.add(product._id);
      setWished(true);
    }
  };

  if (loading) return <div style={{ padding: 80, textAlign: "center" }}>Loading…</div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3><Link to="/shop" className="btn btn-outline">Back to Shop</Link></div>;

  return (
    <div className="container" style={{ padding: "40px 20px 76px" }}>
      <div style={styles.breadcrumb}>
        <Link to="/">Home</Link> <span style={styles.crumbSep}>/</span> <Link to="/shop">Shop</Link> <span style={styles.crumbSep}>/</span> <span style={{ color: "var(--wood)", fontWeight: 600 }}>{product.name}</span>
      </div>

      <div style={styles.grid}>
        <div data-reveal="1">
          <div style={styles.mainImgWrap} className="card">
            <img src={product.images?.[activeImg]?.url} alt={product.name} style={styles.mainImg} />
          </div>
          {product.images?.length > 1 && (
            <div style={styles.thumbRow}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{ ...styles.thumb, borderColor: i === activeImg ? "var(--amber)" : "var(--line)" }}
                >
                  <img src={img.url} alt="" style={styles.thumbImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div data-reveal="2">
          {product.tags?.includes("New") && <span className="badge badge-new" style={{ marginBottom: 12, display: "inline-block" }}>New</span>}
          <h1 style={{ marginBottom: 10 }}>{product.name}</h1>
          <p style={styles.description}>{product.description}</p>

          {selectedVariant && (
            <div style={styles.priceRow}>
              <span style={styles.price}>
                ₹{selectedVariant.discountPrice > 0 ? selectedVariant.discountPrice : selectedVariant.price}
              </span>
              {selectedVariant.discountPrice > 0 && selectedVariant.discountPrice < selectedVariant.price && (
                <>
                  <span style={styles.mrp}>₹{selectedVariant.price}</span>
                  <span className="badge badge-sale">
                    {Math.round(100 - (selectedVariant.discountPrice / selectedVariant.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          )}

          <div className="drip-divider" style={{ margin: "22px 0" }} />

          <div className="field">
            <label>Pack Size</label>
            <div style={styles.variantRow}>
              {product.variants.map((v) => (
                <button
                  key={v._id}
                  onClick={() => setSelectedVariant(v)}
                  className={selectedVariant?._id === v._id ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
                  disabled={v.stock === 0}
                >
                  {v.size} {v.stock === 0 ? "(Sold out)" : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="field" style={{ maxWidth: 140 }}>
            <label>Quantity</label>
            <div style={styles.qtyRow}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="btn-icon">−</button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(selectedVariant?.stock || 1, q + 1))} className="btn-icon">+</button>
            </div>
          </div>

          {message && <div className={message.includes("Added") ? "form-success-banner" : "form-error-banner"}>{message}</div>}

          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              disabled={adding || !selectedVariant || selectedVariant.stock === 0}
            >
              {selectedVariant?.stock === 0 ? "Sold Out" : adding ? "Adding…" : "Add to Cart"}
            </button>
            <button onClick={handleWishlist} className={`btn-icon ${wished ? "active" : ""}`} style={{ width: 48, height: 48 }} aria-label="Wishlist">
              {wished ? "♥" : "♡"}
            </button>
          </div>

          <div style={styles.metaBox} className="card">
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>Category</span>
              <span style={styles.metaValue}>{product.category?.name || "—"}</span>
            </div>
            {selectedVariant && (
              <div style={styles.metaRow}>
                <span style={styles.metaLabel}>In stock</span>
                <span style={styles.metaValue}>{selectedVariant.stock} units</span>
              </div>
            )}
            <div style={{ ...styles.metaRow, borderBottom: "none" }}>
              <span style={styles.metaLabel}>Sourcing</span>
              <span style={styles.metaValue}>Traditionally cold-pressed, no preservatives</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  breadcrumb: { fontSize: "0.85rem", color: "var(--wood-soft)", marginBottom: 26 },
  crumbSep: { color: "var(--line)", margin: "0 2px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 },
  mainImgWrap: { aspectRatio: "1/1", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--ivory-deep)", padding: 0 },
  mainImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  thumbRow: { display: "flex", gap: 10, marginTop: 14 },
  thumb: { width: 70, height: 70, borderRadius: 8, overflow: "hidden", border: "2px solid var(--line)", padding: 0, cursor: "pointer", transition: "border-color 0.2s ease, transform 0.15s ease" },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  description: { fontSize: "1.02rem", lineHeight: 1.7 },
  priceRow: { display: "flex", alignItems: "center", gap: 12, margin: "10px 0 0", flexWrap: "wrap" },
  price: { fontSize: "1.7rem", fontWeight: 700, color: "var(--amber-deep)", fontFamily: "var(--font-display)" },
  mrp: { textDecoration: "line-through", color: "#B3A492", fontSize: "1.05rem" },
  variantRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  qtyRow: { display: "flex", alignItems: "center", gap: 14 },
  metaBox: { marginTop: 32, padding: "18px 20px", fontSize: "0.9rem", color: "var(--wood-soft)" },
  metaRow: { display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: "1px solid var(--line)" },
  metaLabel: { color: "var(--wood-soft)", fontWeight: 600 },
  metaValue: { color: "var(--wood)", textAlign: "right" },
};

export default ProductDetail;
