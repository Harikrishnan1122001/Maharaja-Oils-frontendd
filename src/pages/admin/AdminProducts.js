// import { useEffect, useState } from "react";
// import AdminLayout from "../../components/admin/AdminLayout";
// import { categoryApi, productApi, adminApi } from "../../api/endpoints";

// // price = MRP-style base price, discountPrice = actual selling price (optional, must be lower)
// const emptyVariant = { size: "", price: "", discountPrice: "", stock: "" };
// const emptyForm = {
//   name: "",
//   category: "",
//   brand: "Maharaja Oils",
//   shortDescription: "",
//   description: "",
//   unit: "L",
//   tags: "",
//   isFeatured: false,
//   images: [],
// };

// const AdminProducts = () => {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [variants, setVariants] = useState([{ ...emptyVariant }]);
//   const [previews, setPreviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const loadData = () => {
//     setLoading(true);
//     Promise.all([categoryApi.list(), productApi.list({ limit: 100 })])
//       .then(([catRes, prodRes]) => {
//         setCategories(catRes.data.categories);
//         setProducts(prodRes.data.products);
//       })
//       .catch(() => setError("Failed to load data"))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const handleVariantChange = (idx, field, value) => {
//     setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));
//   };

//   const addVariantRow = () => setVariants((prev) => [...prev, { ...emptyVariant }]);
//   const removeVariantRow = (idx) => setVariants((prev) => prev.filter((_, i) => i !== idx));

//   const handleFiles = (e) => {
//     const files = Array.from(e.target.files).slice(0, 6);
//     setForm({ ...form, images: files });
//     setPreviews(files.map((f) => URL.createObjectURL(f)));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!form.name.trim() || !form.category || !form.description.trim()) {
//       setError("Name, category and description are required");
//       return;
//     }
//     const cleanVariants = variants
//       .filter((v) => v.size && v.price)
//       .map((v) => ({
//         size: v.size,
//         price: Number(v.price),
//         discountPrice: v.discountPrice ? Number(v.discountPrice) : 0,
//         stock: Number(v.stock) || 0,
//       }));
//     if (cleanVariants.length === 0) {
//       setError("Add at least one variant (size + price)");
//       return;
//     }

//     // Product schema requires a top-level price & stock even when variants are used —
//     // derive them from the variants so the backend validation passes.
//     const basePrice = Math.min(...cleanVariants.map((v) => v.price));
//     const baseDiscount = cleanVariants.find((v) => v.price === basePrice)?.discountPrice || 0;
//     const totalStock = cleanVariants.reduce((s, v) => s + v.stock, 0);

//     setSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append("name", form.name.trim());
//       fd.append("category", form.category);
//       fd.append("brand", form.brand);
//       fd.append("shortDescription", form.shortDescription);
//       fd.append("description", form.description);
//       fd.append("unit", form.unit);
//       fd.append("price", basePrice);
//       fd.append("discountPrice", baseDiscount);
//       fd.append("stock", totalStock);
//       fd.append("tags", form.tags);
//       fd.append("isFeatured", form.isFeatured);
//       fd.append("variants", JSON.stringify(cleanVariants));
//       form.images.forEach((img) => fd.append("images", img));

//       await adminApi.createProduct(fd);
//       setSuccess(`Product "${form.name}" added successfully`);
//       setForm(emptyForm);
//       setVariants([{ ...emptyVariant }]);
//       setPreviews([]);
//       loadData();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to add product");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (!window.confirm(`Delete product "${name}"?`)) return;
//     try {
//       await adminApi.deleteProduct(id);
//       setProducts((prev) => prev.filter((p) => p._id !== id));
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to delete product");
//     }
//   };

//   const displayPrice = (v) => (v.discountPrice > 0 ? v.discountPrice : v.price);

//   return (
//     <AdminLayout>
//       <p className="eyebrow">Catalog</p>
//       <h1>Products</h1>

//       <div style={styles.layout}>
//         <form onSubmit={handleSubmit} className="card" style={styles.formCard}>
//           <h3 style={{ marginBottom: 16 }}>Add Product</h3>
//           {error && <div className="form-error-banner">{error}</div>}
//           {success && <div className="form-success-banner">{success}</div>}

//           <div className="field">
//             <label>Name</label>
//             <input
//               type="text"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               placeholder="e.g. Cold Pressed Groundnut Oil"
//               required
//             />
//           </div>

//           <div className="field">
//             <label>Category</label>
//             <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
//               <option value="">Select category</option>
//               {categories.map((c) => (
//                 <option key={c._id} value={c._id}>{c.name}</option>
//               ))}
//             </select>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
//             <div className="field">
//               <label>Brand</label>
//               <input
//                 type="text"
//                 value={form.brand}
//                 onChange={(e) => setForm({ ...form, brand: e.target.value })}
//               />
//             </div>
//             <div className="field">
//               <label>Unit</label>
//               <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
//                 <option value="L">L</option>
//                 <option value="ml">ml</option>
//                 <option value="kg">kg</option>
//                 <option value="g">g</option>
//               </select>
//             </div>
//           </div>

//           <div className="field">
//             <label>Short Description</label>
//             <input
//               type="text"
//               value={form.shortDescription}
//               onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
//               placeholder="One-line summary for product cards"
//             />
//           </div>

//           <div className="field">
//             <label>Description</label>
//             <textarea
//               rows={3}
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               placeholder="Full product description"
//               required
//             />
//           </div>

//           <div className="field">
//             <label>Tags (comma separated)</label>
//             <input
//               type="text"
//               value={form.tags}
//               onChange={(e) => setForm({ ...form, tags: e.target.value })}
//               placeholder="New, Bestseller"
//             />
//           </div>

//           <div className="field">
//             <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <input
//                 type="checkbox"
//                 style={{ width: "auto" }}
//                 checked={form.isFeatured}
//                 onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
//               />
//               Feature on homepage
//             </label>
//           </div>

//           <div className="field">
//             <label>Variants (size / price / discount price / stock)</label>
//             <p style={{ fontSize: "0.75rem", color: "var(--wood-soft)", margin: "0 0 6px" }}>
//               Price is the regular (MRP) price. Discount price is optional and shown as the selling price if lower.
//             </p>
//             {variants.map((v, idx) => (
//               <div key={idx} style={styles.variantRow}>
//                 <input placeholder="500ml" value={v.size} onChange={(e) => handleVariantChange(idx, "size", e.target.value)} />
//                 <input placeholder="Price" type="number" value={v.price} onChange={(e) => handleVariantChange(idx, "price", e.target.value)} />
//                 <input placeholder="Discount ₹" type="number" value={v.discountPrice} onChange={(e) => handleVariantChange(idx, "discountPrice", e.target.value)} />
//                 <input placeholder="Stock" type="number" value={v.stock} onChange={(e) => handleVariantChange(idx, "stock", e.target.value)} />
//                 {variants.length > 1 && (
//                   <button type="button" onClick={() => removeVariantRow(idx)} style={styles.removeBtn}>✕</button>
//                 )}
//               </div>
//             ))}
//             <button type="button" onClick={addVariantRow} className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>
//               + Add Variant
//             </button>
//           </div>

//           <div className="field">
//             <label>Images (up to 6)</label>
//             <input type="file" accept="image/*" multiple onChange={handleFiles} />
//             {previews.length > 0 && (
//               <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
//                 {previews.map((src, i) => (
//                   <img key={i} src={src} alt="preview" style={styles.thumb} />
//                 ))}
//               </div>
//             )}
//           </div>

//           <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
//             {saving ? "Saving…" : "Add Product"}
//           </button>
//         </form>

//         <div style={styles.listWrap}>
//           <h3 style={{ marginBottom: 16 }}>All Products ({products.length})</h3>
//           {loading && <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />}
//           {!loading && products.length === 0 && (
//             <div className="empty-state card">
//               <h3>No products yet</h3>
//               <p>Add your first product using the form.</p>
//             </div>
//           )}
//           <div style={styles.grid}>
//             {products.map((p) => (
//               <div key={p._id} className="card" style={styles.prodCard}>
//                 <div
//                   style={{
//                     ...styles.prodImg,
//                     backgroundImage: p.images?.[0]?.url ? `url(${p.images[0].url})` : "none",
//                   }}
//                 />
//                 <div style={{ padding: "12px 14px" }}>
//                   <strong>{p.name}</strong>
//                   <p style={{ fontSize: "0.8rem", margin: "4px 0" }}>{p.category?.name || "Uncategorized"}</p>
//                   <p style={{ fontSize: "0.85rem", fontWeight: 600, margin: "0 0 10px" }}>
//                     {p.variants?.[0] ? `₹${displayPrice(p.variants[0])} · ${p.variants[0].size}` : "No variants"}
//                   </p>
//                   <button onClick={() => handleDelete(p._id, p.name)} className="btn btn-outline btn-sm" style={{ width: "100%" }}>
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// const styles = {
//   layout: { display: "grid", gridTemplateColumns: "400px 1fr", gap: 28, alignItems: "start" },
//   formCard: { padding: 26, position: "sticky", top: 20, maxHeight: "calc(100vh - 40px)", overflowY: "auto" },
//   variantRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 6, marginBottom: 8 },
//   removeBtn: { background: "none", border: "none", color: "var(--clay)", cursor: "pointer", fontWeight: 700 },
//   thumb: { width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid var(--line)" },
//   listWrap: { minWidth: 0 },
//   grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16 },
//   prodCard: { overflow: "hidden" },
//   prodImg: { height: 130, background: "var(--ivory-deep) center/cover no-repeat" },
// };

// export default AdminProducts;
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { categoryApi, productApi, adminApi } from "../../api/endpoints";

// price = MRP-style base price, discountPrice = actual selling price (optional, must be lower)
const emptyVariant = { size: "", price: "", discountPrice: "", stock: "" };
const emptyForm = {
  name: "",
  category: "",
  brand: "Maharaja Oils",
  shortDescription: "",
  description: "",
  unit: "L",
  tags: "",
  isFeatured: false,
  images: [],
};

const AdminProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [variants, setVariants] = useState([{ ...emptyVariant }]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = () => {
    setLoading(true);
    Promise.all([categoryApi.list(), productApi.list({ limit: 100 })])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data.categories);
        setProducts(prodRes.data.products);
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVariantChange = (idx, field, value) => {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));
  };

  const addVariantRow = () => setVariants((prev) => [...prev, { ...emptyVariant }]);
  const removeVariantRow = (idx) => setVariants((prev) => prev.filter((_, i) => i !== idx));

  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    setForm({ ...form, images: files });
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.category || !form.description.trim()) {
      setError("Name, category and description are required");
      return;
    }
    const cleanVariants = variants
      .filter((v) => v.size && v.price)
      .map((v) => ({
        size: v.size,
        price: Number(v.price),
        discountPrice: v.discountPrice ? Number(v.discountPrice) : 0,
        stock: Number(v.stock) || 0,
      }));
    if (cleanVariants.length === 0) {
      setError("Add at least one variant (size + price)");
      return;
    }

    // Product schema requires a top-level price & stock even when variants are used —
    // derive them from the variants so the backend validation passes.
    const basePrice = Math.min(...cleanVariants.map((v) => v.price));
    const baseDiscount = cleanVariants.find((v) => v.price === basePrice)?.discountPrice || 0;
    const totalStock = cleanVariants.reduce((s, v) => s + v.stock, 0);

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("category", form.category);
      fd.append("brand", form.brand);
      fd.append("shortDescription", form.shortDescription);
      fd.append("description", form.description);
      fd.append("unit", form.unit);
      fd.append("price", basePrice);
      fd.append("discountPrice", baseDiscount);
      fd.append("stock", totalStock);
      fd.append("tags", form.tags);
      fd.append("isFeatured", form.isFeatured);
      fd.append("variants", JSON.stringify(cleanVariants));
      form.images.forEach((img) => fd.append("images", img));

      await adminApi.createProduct(fd);
      setSuccess(`Product "${form.name}" added successfully`);
      setForm(emptyForm);
      setVariants([{ ...emptyVariant }]);
      setPreviews([]);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    try {
      await adminApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const displayPrice = (v) => (v.discountPrice > 0 ? v.discountPrice : v.price);

  return (
    <AdminLayout>
      <p className="eyebrow">Catalog</p>
      <h1>Products</h1>

      <div className="admin-split-layout" style={styles.layout}>
        <form onSubmit={handleSubmit} className="card admin-form-card" style={styles.formCard}>
          <h3 style={{ marginBottom: 16 }}>Add Product</h3>
          {error && <div className="form-error-banner">{error}</div>}
          {success && <div className="form-success-banner">{success}</div>}

          <div className="field">
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Cold Pressed Groundnut Oil"
              required
            />
          </div>

          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="field">
              <label>Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Unit</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option value="L">L</option>
                <option value="ml">ml</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Short Description</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="One-line summary for product cards"
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Full product description"
              required
            />
          </div>

          <div className="field">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="New, Bestseller"
            />
          </div>

          <div className="field">
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                style={{ width: "auto" }}
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Feature on homepage
            </label>
          </div>

          <div className="field">
            <label>Variants (size / price / discount price / stock)</label>
            <p style={{ fontSize: "0.75rem", color: "var(--wood-soft)", margin: "0 0 6px" }}>
              Price is the regular (MRP) price. Discount price is optional and shown as the selling price if lower.
            </p>
            {variants.map((v, idx) => (
              <div key={idx} className="admin-variant-row" style={styles.variantRow}>
                <input placeholder="500ml" value={v.size} onChange={(e) => handleVariantChange(idx, "size", e.target.value)} />
                <input placeholder="Price" type="number" value={v.price} onChange={(e) => handleVariantChange(idx, "price", e.target.value)} />
                <input placeholder="Discount ₹" type="number" value={v.discountPrice} onChange={(e) => handleVariantChange(idx, "discountPrice", e.target.value)} />
                <input placeholder="Stock" type="number" value={v.stock} onChange={(e) => handleVariantChange(idx, "stock", e.target.value)} />
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariantRow(idx)} className="admin-variant-remove" style={styles.removeBtn}>
                    ✕<span className="admin-variant-remove-label"> Remove</span>
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addVariantRow} className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>
              + Add Variant
            </button>
          </div>

          <div className="field">
            <label>Images (up to 6)</label>
            <input type="file" accept="image/*" multiple onChange={handleFiles} />
            {previews.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="preview" style={styles.thumb} />
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? "Saving…" : "Add Product"}
          </button>
        </form>

        <div className="admin-list-wrap" style={styles.listWrap}>
          <h3 style={{ marginBottom: 16 }}>All Products ({products.length})</h3>
          {loading && <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />}
          {!loading && products.length === 0 && (
            <div className="empty-state card">
              <h3>No products yet</h3>
              <p>Add your first product using the form.</p>
            </div>
          )}
          <div style={styles.grid}>
            {products.map((p) => (
              <div key={p._id} className="card" style={styles.prodCard}>
                <div
                  style={{
                    ...styles.prodImg,
                    backgroundImage: p.images?.[0]?.url ? `url(${p.images[0].url})` : "none",
                  }}
                />
                <div style={{ padding: "12px 14px" }}>
                  <strong>{p.name}</strong>
                  <p style={{ fontSize: "0.8rem", margin: "4px 0" }}>{p.category?.name || "Uncategorized"}</p>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, margin: "0 0 10px" }}>
                    {p.variants?.[0] ? `₹${displayPrice(p.variants[0])} · ${p.variants[0].size}` : "No variants"}
                  </p>
                  <button onClick={() => handleDelete(p._id, p.name)} className="btn btn-outline btn-sm" style={{ width: "100%" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  layout: { display: "grid", gridTemplateColumns: "400px 1fr", gap: 28, alignItems: "start" },
  formCard: { padding: 26, position: "sticky", top: 20, maxHeight: "calc(100vh - 40px)", overflowY: "auto" },
  variantRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 6, marginBottom: 8 },
  removeBtn: { background: "none", border: "none", color: "var(--clay)", cursor: "pointer", fontWeight: 700 },
  thumb: { width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid var(--line)" },
  listWrap: { minWidth: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16 },
  prodCard: { overflow: "hidden" },
  prodImg: { height: 130, background: "var(--ivory-deep) center/cover no-repeat" },
};

export default AdminProducts;