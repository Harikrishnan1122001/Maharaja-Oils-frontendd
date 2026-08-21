import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { categoryApi, adminApi } from "../../api/endpoints";

const emptyForm = { name: "", description: "", image: null };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = () => {
    setLoading(true);
    categoryApi
      .list()
      .then((res) => setCategories(res.data.categories))
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
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
    if (!form.name.trim()) {
      setError("Category name is required");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("description", form.description);
      if (form.image) fd.append("image", form.image);

      await adminApi.createCategory(fd);
      setSuccess(`Category "${form.name}" added successfully`);
      setForm(emptyForm);
      setPreview(null);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await adminApi.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <AdminLayout>
      <p className="eyebrow">Catalog</p>
      <h1>Categories</h1>

      <div style={styles.layout}>
        <form onSubmit={handleSubmit} className="card" style={styles.formCard}>
          <h3 style={{ marginBottom: 16 }}>Add Category</h3>
          {error && <div className="form-error-banner">{error}</div>}
          {success && <div className="form-success-banner">{success}</div>}

          <div className="field">
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Cold Pressed Oils"
              required
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description shown on the category page"
            />
          </div>

          <div className="field">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {preview && <img src={preview} alt="preview" style={styles.preview} />}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? "Saving…" : "Add Category"}
          </button>
        </form>

        <div style={styles.listWrap}>
          <h3 style={{ marginBottom: 16 }}>All Categories ({categories.length})</h3>
          {loading && <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />}
          {!loading && categories.length === 0 && (
            <div className="empty-state card">
              <h3>No categories yet</h3>
              <p>Add your first category using the form.</p>
            </div>
          )}
          <div style={styles.grid}>
            {categories.map((c) => (
              <div key={c._id} className="card" style={styles.catCard}>
                <div
                  style={{
                    ...styles.catImg,
                    backgroundImage: c.image?.url ? `url(${c.image.url})` : "none",
                  }}
                />
                <div style={{ padding: "12px 14px" }}>
                  <strong>{c.name}</strong>
                  <p style={{ fontSize: "0.82rem", margin: "4px 0 10px" }}>
                    {c.description || "No description"}
                  </p>
                  <button onClick={() => handleDelete(c._id, c.name)} className="btn btn-outline btn-sm" style={{ width: "100%" }}>
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
  layout: { display: "grid", gridTemplateColumns: "360px 1fr", gap: 28, alignItems: "start" },
  formCard: { padding: 26, position: "sticky", top: 20 },
  preview: { marginTop: 10, width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "1px solid var(--line)" },
  listWrap: { minWidth: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16 },
  catCard: { overflow: "hidden" },
  catImg: { height: 110, background: "var(--ivory-deep) center/cover no-repeat" },
};

export default AdminCategories;
