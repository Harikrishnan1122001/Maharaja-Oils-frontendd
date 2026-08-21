import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showAddress, setShowAddress] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [address, setAddress] = useState({ addressLine1: "", addressLine2: "", landmark: "", city: "", state: "", pincode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (obj, setObj) => (e) => setObj({ ...obj, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form };
      if (showAddress && address.addressLine1 && address.city && address.state && address.pincode) {
        payload.address = { ...address, fullName: form.name, phone: form.phone };
      }
      await register(payload);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div className="card" style={styles.box}>
        <p className="eyebrow">Join Maharaja Oils</p>
        <h1 style={{ marginBottom: 20 }}>Create Account</h1>
        {error && <div className="form-error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input name="name" required value={form.name} onChange={set(form, setForm)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" required value={form.email} onChange={set(form, setForm)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" required value={form.phone} onChange={set(form, setForm)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" required minLength={6} value={form.password} onChange={set(form, setForm)} />
          </div>

          <button type="button" onClick={() => setShowAddress((v) => !v)} style={styles.toggleAddr}>
            {showAddress ? "− Hide address" : "+ Add delivery address now (optional)"}
          </button>

          {showAddress && (
            <div style={styles.addressBox}>
              <div className="field">
                <label>Address Line 1</label>
                <input name="addressLine1" placeholder="House no., street" value={address.addressLine1} onChange={set(address, setAddress)} />
              </div>
              <div className="field">
                <label>Address Line 2 (optional)</label>
                <input name="addressLine2" value={address.addressLine2} onChange={set(address, setAddress)} />
              </div>
              <div className="field">
                <label>Landmark (optional)</label>
                <input name="landmark" value={address.landmark} onChange={set(address, setAddress)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field">
                  <label>City</label>
                  <input name="city" value={address.city} onChange={set(address, setAddress)} />
                </div>
                <div className="field">
                  <label>State</label>
                  <input name="state" value={address.state} onChange={set(address, setAddress)} />
                </div>
              </div>
              <div className="field">
                <label>Pincode</label>
                <input name="pincode" value={address.pincode} onChange={set(address, setAddress)} />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: "0.9rem" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--amber-deep)", fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrap: { display: "flex", justifyContent: "center", padding: "60px 20px" },
  box: { width: "100%", maxWidth: 460, padding: 34 },
  toggleAddr: { background: "none", border: "none", color: "var(--amber-deep)", fontWeight: 600, cursor: "pointer", padding: "6px 0 18px", fontSize: "0.9rem" },
  addressBox: { background: "var(--ivory)", padding: 16, borderRadius: 10, marginBottom: 18 },
};

export default Register;
