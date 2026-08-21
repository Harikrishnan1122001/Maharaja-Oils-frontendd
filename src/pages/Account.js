import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/endpoints";

const Account = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await authApi.updateMe(form);
      setUser(res.data.user);
      localStorage.setItem("mo_user", JSON.stringify(res.data.user));
      setMessage("Profile updated");
    } catch {
      setMessage("Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 20px 70px", maxWidth: 720 }}>
      <h1>My Account</h1>
      <div style={styles.nav}>
        <Link to="/account" className="btn btn-primary btn-sm">Profile</Link>
        <Link to="/account/orders" className="btn btn-outline btn-sm">Orders</Link>
        <Link to="/account/addresses" className="btn btn-outline btn-sm">Addresses</Link>
      </div>

      <div className="card" style={{ padding: 26, marginTop: 20 }}>
        {message && <div className="form-success-banner">{message}</div>}
        <form onSubmit={handleSave}>
          <div className="field">
            <label>Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={user.email} disabled style={{ background: "var(--ivory)", color: "var(--wood-soft)" }} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
        </form>
      </div>
    </div>
  );
};

const styles = { nav: { display: "flex", gap: 10, marginTop: 10 } };

export default Account;
