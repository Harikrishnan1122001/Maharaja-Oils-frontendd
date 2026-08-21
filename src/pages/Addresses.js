import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addressApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

const emptyForm = { label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "", landmark: "", city: "", state: "", pincode: "" };

const Addresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => addressApi.list().then((res) => setAddresses(res.data.addresses));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ ...emptyForm, fullName: user?.name || "", phone: user?.phone || "" });
    setEditingId(null);
    setShowForm(true);
  };
  const openEdit = (a) => { setForm(a); setEditingId(a._id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await addressApi.update(editingId, form);
      else await addressApi.add(form);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save address");
    }
  };

  const handleDelete = async (id) => {
    await addressApi.remove(id);
    load();
  };

  const handleSetDefault = async (id) => {
    setBusyId(id);
    try {
      await addressApi.setDefault(id);
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 20px 70px", maxWidth: 720 }}>
      <h1>My Account</h1>
      <div style={styles.nav}>
        <Link to="/account" className="btn btn-outline btn-sm">Profile</Link>
        <Link to="/account/orders" className="btn btn-outline btn-sm">Orders</Link>
        <Link to="/account/addresses" className="btn btn-primary btn-sm">Addresses</Link>
      </div>

      <div style={{ marginTop: 20 }}>
        {addresses.map((a) => (
          <div key={a._id} className="card" style={styles.addrCard}>
            <div>
              <b>{a.label}</b> {a.isDefault && <span className="badge badge-new">Default</span>}
              <p style={{ margin: "6px 0 0", fontSize: "0.9rem" }}>
                {a.fullName}<br />
                {a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ""}{a.landmark ? `, ${a.landmark}` : ""}, {a.city}, {a.state} - {a.pincode}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "0.85rem" }}>Phone: {a.phone}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {!a.isDefault && (
                <button className="btn btn-outline btn-sm" disabled={busyId === a._id} onClick={() => handleSetDefault(a._id)}>
                  Set Default
                </button>
              )}
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}>Edit</button>
              <button className="btn btn-outline btn-sm" onClick={() => handleDelete(a._id)}>Delete</button>
            </div>
          </div>
        ))}

        {!showForm && <button className="btn btn-primary btn-sm" onClick={openNew}>+ Add New Address</button>}

        {showForm && (
          <form onSubmit={handleSubmit} className="card" style={{ padding: 20, marginTop: 14 }}>
            {error && <div className="form-error-banner">{error}</div>}
            <div className="field"><label>Label</label><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></div>
            <div className="field"><label>Full Name</label><input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
            <div className="field"><label>Phone</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="field"><label>Address Line 1</label><input required value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} /></div>
            <div className="field"><label>Address Line 2</label><input value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} /></div>
            <div className="field"><label>Landmark</label><input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field"><label>City</label><input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div className="field"><label>State</label><input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
            </div>
            <div className="field"><label>Pincode</label><input required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn btn-primary btn-sm">Save</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  nav: { display: "flex", gap: 10, marginTop: 10 },
  addrCard: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: 18, marginBottom: 14, flexWrap: "wrap", gap: 10 },
};

export default Addresses;
