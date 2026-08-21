import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname;
      if (user.role === "admin") navigate("/admin", { replace: true });
      else navigate(redirectTo || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div className="card" style={styles.box}>
        <p className="eyebrow">Welcome back</p>
        <h1 style={{ marginBottom: 20 }}>Login</h1>
        {error && <div className="form-error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: "0.9rem" }}>
          New here? <Link to="/register" style={{ color: "var(--amber-deep)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrap: { display: "flex", justifyContent: "center", padding: "60px 20px" },
  box: { width: "100%", maxWidth: 420, padding: 34 },
};

export default Login;
