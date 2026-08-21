// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import AdminLayout from "../../components/admin/AdminLayout";
// import { adminApi } from "../../api/endpoints";
// import { exportToExcel } from "../../utils/exportSheet";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [togglingId, setTogglingId] = useState(null);

//   const loadUsers = () => {
//     setLoading(true);
//     adminApi
//       .allUsers()
//       .then((res) => setUsers(res.data.users))
//       .catch((err) => setError(err.response?.data?.message || "Failed to load users"))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return users;
//     return users.filter(
//       (u) =>
//         u.name?.toLowerCase().includes(q) ||
//         u.email?.toLowerCase().includes(q) ||
//         u.phone?.toLowerCase().includes(q)
//     );
//   }, [users, search]);

//   const handleToggle = async (id, currentlyActive) => {
//     setTogglingId(id);
//     try {
//       const res = await adminApi.updateUserStatus(id, !currentlyActive);
//       setUsers((prev) => prev.map((u) => (u._id === id ? res.data.user : u)));
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update user");
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   const handleExport = () => {
//     exportToExcel(
//       `users-${new Date().toISOString().slice(0, 10)}`,
//       [
//         { key: "name", label: "Name", value: (u) => u.name },
//         { key: "email", label: "Email", value: (u) => u.email },
//         { key: "phone", label: "Phone", value: (u) => u.phone },
//         { key: "addresses", label: "Addresses", value: (u) => u.addresses?.length || 0 },
//         { key: "status", label: "Status", value: (u) => (u.isActive ? "Active" : "Blocked") },
//         { key: "joined", label: "Joined", value: (u) => new Date(u.createdAt).toLocaleDateString("en-IN") },
//       ],
//       filtered
//     );
//   };

//   return (
//     <AdminLayout>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
//         <div>
//           <p className="eyebrow">People</p>
//           <h1 style={{ marginBottom: 0 }}>Users ({filtered.length})</h1>
//         </div>
//         <button onClick={handleExport} className="btn btn-primary btn-sm" disabled={filtered.length === 0}>
//           ⬇ Download Excel Sheet
//         </button>
//       </div>

//       {error && <div className="form-error-banner">{error}</div>}

//       <input
//         type="text"
//         placeholder="Search by name, email or phone"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={styles.searchInput}
//       />

//       {loading && <div className="skeleton" style={{ height: 300, borderRadius: 16, marginTop: 16 }} />}

//       {!loading && filtered.length === 0 && (
//         <div className="empty-state card" style={{ marginTop: 16 }}>
//           <h3>No users found</h3>
//         </div>
//       )}

//       {!loading && filtered.length > 0 && (
//         <div className="card" style={{ overflowX: "auto", padding: 0, marginTop: 16 }}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Name</th>
//                 <th style={styles.th}>Email</th>
//                 <th style={styles.th}>Phone</th>
//                 <th style={styles.th}>Joined</th>
//                 <th style={styles.th}>Status</th>
//                 <th style={styles.th}></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((u) => (
//                 <tr key={u._id}>
//                   <td style={styles.td}>
//                     <Link to={`/admin/users/${u._id}`} style={{ fontWeight: 600 }}>{u.name}</Link>
//                   </td>
//                   <td style={styles.td}>{u.email}</td>
//                   <td style={styles.td}>{u.phone}</td>
//                   <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
//                   <td style={styles.td}>
//                     <span className={`badge ${u.isActive ? "badge-new" : "badge-sale"}`}>
//                       {u.isActive ? "Active" : "Blocked"}
//                     </span>
//                   </td>
//                   <td style={styles.td}>
//                     <div style={{ display: "flex", gap: 8 }}>
//                       <Link to={`/admin/users/${u._id}`} className="btn btn-outline btn-sm">View</Link>
//                       <button
//                         onClick={() => handleToggle(u._id, u.isActive)}
//                         disabled={togglingId === u._id}
//                         className="btn btn-outline btn-sm"
//                       >
//                         {u.isActive ? "Block" : "Unblock"}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </AdminLayout>
//   );
// };

// const styles = {
//   searchInput: { width: "100%", maxWidth: 360, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)" },
//   table: { width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", minWidth: 680 },
//   th: { textAlign: "left", padding: "12px 14px", borderBottom: "1.5px solid var(--line)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--wood-soft)" },
//   td: { padding: "12px 14px", borderBottom: "1px solid var(--line)", verticalAlign: "middle" },
// };

// export default AdminUsers;
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../api/endpoints";
import { exportToExcel } from "../../utils/exportSheet";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    adminApi
      .allUsers()
      .then((res) => setUsers(res.data.users))
      .catch((err) => setError(err.response?.data?.message || "Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleToggle = async (id, currentlyActive) => {
    setTogglingId(id);
    try {
      const res = await adminApi.updateUserStatus(id, !currentlyActive);
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data.user : u)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setTogglingId(null);
    }
  };

  const handleExport = () => {
    exportToExcel(
      `users-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: "name", label: "Name", value: (u) => u.name },
        { key: "email", label: "Email", value: (u) => u.email },
        { key: "phone", label: "Phone", value: (u) => u.phone },
        { key: "addresses", label: "Addresses", value: (u) => u.addresses?.length || 0 },
        { key: "status", label: "Status", value: (u) => (u.isActive ? "Active" : "Blocked") },
        { key: "joined", label: "Joined", value: (u) => new Date(u.createdAt).toLocaleDateString("en-IN") },
      ],
      filtered
    );
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <p className="eyebrow">People</p>
          <h1 style={{ marginBottom: 0 }}>Users ({filtered.length})</h1>
        </div>
        <button onClick={handleExport} className="btn btn-primary btn-sm" disabled={filtered.length === 0}>
          ⬇ Download Excel Sheet
        </button>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <input
        type="text"
        placeholder="Search by name, email or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-search-input admin-search-input-wide"
        style={styles.searchInput}
      />

      {loading && <div className="skeleton" style={{ height: 300, borderRadius: 16, marginTop: 16 }} />}

      {!loading && filtered.length === 0 && (
        <div className="empty-state card" style={{ marginTop: 16 }}>
          <h3>No users found</h3>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="card" style={{ overflowX: "auto", padding: 0, marginTop: 16 }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td style={styles.td}>
                    <Link to={`/admin/users/${u._id}`} style={{ fontWeight: 600 }}>{u.name}</Link>
                  </td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.phone}</td>
                  <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                  <td style={styles.td}>
                    <span className={`badge ${u.isActive ? "badge-new" : "badge-sale"}`}>
                      {u.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link to={`/admin/users/${u._id}`} className="btn btn-outline btn-sm">View</Link>
                      <button
                        onClick={() => handleToggle(u._id, u.isActive)}
                        disabled={togglingId === u._id}
                        className="btn btn-outline btn-sm"
                      >
                        {u.isActive ? "Block" : "Unblock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

const styles = {
  searchInput: { width: "100%", maxWidth: 360, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", minWidth: 680 },
  th: { textAlign: "left", padding: "12px 14px", borderBottom: "1.5px solid var(--line)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--wood-soft)" },
  td: { padding: "12px 14px", borderBottom: "1px solid var(--line)", verticalAlign: "middle" },
};

export default AdminUsers;