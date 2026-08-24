import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi, settingsApi } from "../../api/endpoints";

// Admin page for the bottom-of-site sliding marquee. Lets admins add,
// edit, reorder, and remove ticker items, toggle it on/off, and tune the
// scroll speed — all without touching code. Saves to Settings ➜ marquee,
// which the public Marquee component (rendered at the bottom of every
// storefront page) reads from.
const AdminMarquee = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [speed, setSpeed] = useState(28);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    setLoading(true);
    settingsApi
      .get()
      .then((res) => {
        const m = res.data?.settings?.marquee;
        if (m) {
          setItems(Array.isArray(m.items) && m.items.length ? m.items : [""]);
          setEnabled(m.enabled !== false);
          setSpeed(m.speed || 28);
        } else {
          setItems([""]);
        }
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load marquee settings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateItem = (index, value) => {
    setItems((prev) => prev.map((it, i) => (i === index ? value : it)));
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const moveItem = (index, dir) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addItem = () => {
    const text = newItem.trim();
    if (!text) return;
    setItems((prev) => [...prev, text]);
    setNewItem("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleaned = items.map((t) => t.trim()).filter(Boolean);
    if (cleaned.length === 0) {
      setError("Add at least one marquee text before saving.");
      return;
    }

    setSaving(true);
    try {
      const res = await adminApi.updateMarquee({ items: cleaned, enabled, speed: Number(speed) || 28 });
      const m = res.data?.settings?.marquee;
      if (m) {
        setItems(m.items || cleaned);
        setEnabled(m.enabled);
        setSpeed(m.speed);
      }
      setSuccess("Marquee updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update marquee");
    } finally {
      setSaving(false);
    }
  };

  const previewItems = items.map((t) => t.trim()).filter(Boolean);
  const previewTrack = previewItems.length ? [...previewItems, ...previewItems] : [];

  return (
    <AdminLayout>
      <p className="eyebrow">Storefront</p>
      <h1>Bottom Marquee</h1>
      <p style={{ color: "var(--wood-soft)", marginTop: -6, marginBottom: 22, maxWidth: 640 }}>
        Manage the sliding text strip shown at the bottom of every page on the website
        (e.g. "100% Natural", "No Chemicals", "Transparent Sourcing"). Add, edit, reorder,
        or remove items — changes go live as soon as you save.
      </p>

      {loading ? (
        <div className="skeleton" style={{ height: 260, borderRadius: 16 }} />
      ) : (
        <div className="admin-split-layout" style={styles.layout}>
          <form onSubmit={handleSave} className="card admin-form-card" style={styles.formCard}>
            <h3 style={{ marginBottom: 16 }}>Marquee Settings</h3>
            {error && <div className="form-error-banner">{error}</div>}
            {success && <div className="form-success-banner">{success}</div>}

            <div className="field" style={styles.toggleRow}>
              <label style={{ marginBottom: 0 }}>Show marquee on website</label>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                style={{ width: 18, height: 18 }}
              />
            </div>

            <div className="field">
              <label>Scroll Speed (seconds per loop)</label>
              <input
                type="number"
                min="8"
                max="90"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
              />
              <p style={{ fontSize: "0.75rem", color: "var(--wood-soft)", margin: "4px 0 0" }}>
                Lower = faster scroll. Try 20–35 for a smooth, readable pace.
              </p>
            </div>

            <div className="field">
              <label>Add New Text</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem();
                    }
                  }}
                  placeholder="e.g. Free Shipping Over ₹999"
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-outline btn-sm" onClick={addItem}>
                  Add
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={saving} style={{ marginTop: 10 }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>

          <div className="admin-list-wrap" style={styles.listWrap}>
            <h3 style={{ marginBottom: 16 }}>Marquee Items ({items.length})</h3>

            {items.length === 0 && (
              <div className="empty-state card">
                <h3>No marquee text yet</h3>
                <p>Add your first line using the form.</p>
              </div>
            )}

            <div style={styles.itemsList}>
              {items.map((text, i) => (
                <div key={i} className="card" style={styles.itemRow}>
                  <span style={styles.itemHandle}>{i + 1}</span>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => updateItem(i, e.target.value)}
                    style={styles.itemInput}
                    placeholder="Marquee text"
                  />
                  <div style={styles.itemActions}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => moveItem(i, -1)}
                      disabled={i === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => moveItem(i, 1)}
                      disabled={i === items.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => removeItem(i)}
                      title="Remove"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {previewTrack.length > 0 && enabled && (
              <>
                <h3 style={{ margin: "26px 0 12px" }}>Live Preview</h3>
                <div className="site-marquee" style={{ borderRadius: 12 }}>
                  <div
                    className="site-marquee-track"
                    style={{ animationDuration: `${Number(speed) || 28}s` }}
                  >
                    {previewTrack.map((text, i) => (
                      <span className="site-marquee-item" key={`${text}-${i}`}>
                        <span className="site-marquee-text">{text}</span>
                        <span className="site-marquee-dot" aria-hidden="true" />
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const styles = {
  layout: { display: "grid", gridTemplateColumns: "380px 1fr", gap: 28, alignItems: "start" },
  formCard: { padding: 26, position: "sticky", top: 20 },
  toggleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  listWrap: { minWidth: 0 },
  itemsList: { display: "flex", flexDirection: "column", gap: 10 },
  itemRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" },
  itemHandle: {
    width: 24, height: 24, borderRadius: "50%", background: "var(--ivory-deep)",
    color: "var(--wood)", fontSize: "0.75rem", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  itemInput: { flex: 1, minWidth: 0 },
  itemActions: { display: "flex", gap: 6, flexShrink: 0 },
};

export default AdminMarquee;
