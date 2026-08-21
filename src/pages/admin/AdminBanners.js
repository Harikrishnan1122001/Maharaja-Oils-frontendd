import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../api/endpoints";

// Note: the backend Banner model has no placement zones — "position" is just a
// numeric sort order used across every banner shown on the storefront.
const emptyForm = { title: "", subtitle: "", link: "", position: 0, image: null };

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBanners = () => {
    setLoading(true);
    adminApi
      .allBanners()
      .then((res) => setBanners(res.data.banners))
      .catch((err) => setError(err.response?.data?.message || "Failed to load banners"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.image) {
      setError("Please choose a banner image");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("subtitle", form.subtitle);
      fd.append("link", form.link);
      fd.append("position", form.position);
      fd.append("image", form.image);

      await adminApi.createBanner(fd);
      setSuccess("Banner added successfully");
      setForm(emptyForm);
      setPreview(null);
      loadBanners();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add banner");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (b) => {
    try {
      const fd = new FormData();
      fd.append("isActive", !b.isActive);
      const res = await adminApi.updateBanner(b._id, fd);
      setBanners((prev) => prev.map((x) => (x._id === b._id ? res.data.banner : x)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update banner");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete banner "${title || "Untitled"}"?`)) return;
    try {
      await adminApi.deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete banner");
    }
  };

  return (
    <AdminLayout>
      <p className="eyebrow">Storefront</p>
      <h1>Banners</h1>

      <div style={styles.layout}>
        <form onSubmit={handleSubmit} className="card" style={styles.formCard}>
          <h3 style={{ marginBottom: 16 }}>Add Banner</h3>
          {error && <div className="form-error-banner">{error}</div>}
          {success && <div className="form-success-banner">{success}</div>}

          <div className="field">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Pure Cold Pressed Oils"
            />
          </div>

          <div className="field">
            <label>Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Short supporting line"
            />
          </div>

          <div className="field">
            <label>Link (optional)</label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="/product/gingelly-oil"
            />
          </div>

          <div className="field">
            <label>Display Order</label>
            <input
              type="number"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              placeholder="0"
            />
            <p style={{ fontSize: "0.75rem", color: "var(--wood-soft)", margin: "4px 0 0" }}>
              Lower numbers show first. All active banners appear together on the storefront.
            </p>
          </div>

          <div className="field">
            <label>Banner Image</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {preview && <img src={preview} alt="preview" style={styles.preview} />}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? "Saving…" : "Add Banner"}
          </button>
        </form>

        <div style={styles.listWrap}>
          <h3 style={{ marginBottom: 16 }}>All Banners ({banners.length})</h3>
          {loading && <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />}
          {!loading && banners.length === 0 && (
            <div className="empty-state card">
              <h3>No banners yet</h3>
              <p>Add your first banner using the form.</p>
            </div>
          )}
          <div style={styles.grid}>
            {banners.map((b) => (
              <div key={b._id} className="card" style={styles.bannerCard}>
                <div style={{ ...styles.bannerImg, backgroundImage: `url(${b.image?.url})` }} />
                <div style={{ padding: "12px 14px" }}>
                  <strong>{b.title || "Untitled"}</strong>
                  <p style={{ fontSize: "0.8rem", margin: "4px 0" }}>Order {b.position}</p>
                  <span className={`badge ${b.isActive ? "badge-new" : "badge-sale"}`} style={{ marginBottom: 10, display: "inline-block" }}>
                    {b.isActive ? "Active" : "Inactive"}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleToggleActive(b)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      {b.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => handleDelete(b._id, b.title)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      Delete
                    </button>
                  </div>
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
  layout: { display: "grid", gridTemplateColumns: "380px 1fr", gap: 28, alignItems: "start" },
  formCard: { padding: 26, position: "sticky", top: 20 },
  preview: { width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8, marginTop: 10, border: "1px solid var(--line)" },
  listWrap: { minWidth: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
  bannerCard: { overflow: "hidden" },
  bannerImg: { height: 110, background: "var(--ivory-deep) center/cover no-repeat" },
};

export default AdminBanners;
