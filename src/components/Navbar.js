// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useCart } from "../context/CartContext";
// import { categoryApi, productApi } from "../api/endpoints";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const { itemCount } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [categories, setCategories] = useState([]);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [scrolled, setScrolled] = useState(false);

//   // Purely cosmetic: gives the sticky header a soft lifted shadow once the
//   // page has scrolled a little, so it reads as "above" the content instead
//   // of blending flat into it. No effect on layout or behavior.
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 8);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // On the order pages the search bar tends to feel cramped next to the
//   // logo/Home nav, so we nudge the logo+nav cluster a little further left
//   // there (purely cosmetic — no behavior change).
//   const isOrdersPage = location.pathname.startsWith("/account/orders");

//   // --- Search control: live matching-product suggestions as the user types ---
//   const [searchResults, setSearchResults] = useState([]);
//   const [showResults, setShowResults] = useState(false);
//   const [searching, setSearching] = useState(false);
//   const searchWrapRef = useRef(null);

//   useEffect(() => {
//     categoryApi.list().then((res) => setCategories(res.data.categories)).catch(() => {});
//   }, []);

//   // Debounced live search: fetches matching products while the user types
//   // and shows them in a dropdown, without changing the existing submit flow.
//   useEffect(() => {
//     const term = search.trim();
//     if (!term) {
//       setSearchResults([]);
//       setSearching(false);
//       return;
//     }
//     setSearching(true);
//     const timer = setTimeout(() => {
//       productApi
//         .search(term)
//         .then((res) => setSearchResults(res.data.products || []))
//         .catch(() => setSearchResults([]))
//         .finally(() => setSearching(false));
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [search]);

//   // Close the results dropdown when clicking outside the search control
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
//         setShowResults(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const goToProduct = (product) => {
//     setShowResults(false);
//     setMenuOpen(false);
//     navigate(`/product/${product.slug}`);
//   };

//   const submitSearch = (e) => {
//     e.preventDefault();
//     setShowResults(false);
//     if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
//     setMenuOpen(false);
//   };

//   return (
//     <header style={styles.header} className={scrolled ? "navbar-scrolled" : ""}>
//       {/* Utility bar */}
//       <div style={styles.utilityBar}>
//         <div className="container" style={styles.utilityInner}>
//           <span style={styles.utilityTag}>Pure &amp; Natural — Traditionally Pressed</span>
//           <div style={styles.utilityRight} className="utility-right-desktop">
//             <span>100% Natural</span>
//             <span style={styles.dot} />
//             <span>No Preservatives</span>
//             <span style={styles.dot} />
//             <span>Traditionally Pressed</span>
//           </div>
//         </div>
//       </div>

//       {/* Main nav */}
//       <div className="container navbar-bar" style={styles.bar}>
//         <Link to="/" style={{ ...styles.logoLink, marginLeft: isOrdersPage ? -14 : -6 }} className="navbar-logo-link">
//           <img
//             src="https://maharajaoils.com/assets/img/logo.png"
//             alt="Maharaja Oils"
//             style={styles.logoImg}
//             className="navbar-logo-img"
//           />
//           <span style={styles.brandText} className="navbar-brand-text">
//             <span style={styles.brandName} className="navbar-brand-name">Maharaja Oils</span>
//             <span style={styles.brandTagline} className="navbar-brand-tagline">Taste of Tradition</span>
//           </span>
//         </Link>

//         <div style={styles.navDivider} className="nav-divider-desktop" />

//         <nav style={{ ...styles.navLinks, marginLeft: isOrdersPage ? -8 : 0 }} className="nav-links-desktop">
//           <Link to="/" className="navbar-home-link">Home</Link>
//           {/* <Link to="/about">About Us</Link> */}
//           <Link to="/shop">Shop</Link>
//           <div style={styles.dropdownWrap}>
//             <span style={{ cursor: "pointer" }}>Categories ▾</span>
//             <div style={styles.dropdown} className="dropdown-menu">
//               {categories.map((c) => (
//                 <Link key={c._id} to={`/category/${c.slug}`} style={styles.dropdownItem}>
//                   {c.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//           <Link to="/contact">Contact Us</Link>
//         </nav>

//         <div style={styles.actions} className="navbar-actions">
//           <div ref={searchWrapRef} style={styles.searchWrap} className="search-form-desktop">
//             <form onSubmit={submitSearch} style={styles.searchForm}>
//               <input
//                 type="text"
//                 placeholder="Search oils, podi..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 onFocus={() => setShowResults(true)}
//                 style={styles.searchInput}
//                 aria-label="Search products"
//               />
//               <button type="submit" style={styles.searchIconBtn} aria-label="Search">⌕</button>
//             </form>
//             {showResults && search.trim() && (
//               <div style={styles.searchDropdown}>
//                 {searching ? (
//                   <div style={styles.searchDropdownMsg}>Searching…</div>
//                 ) : searchResults.length > 0 ? (
//                   <>
//                     {searchResults.map((p) => (
//                       <button
//                         key={p._id}
//                         type="button"
//                         onClick={() => goToProduct(p)}
//                         style={styles.searchResultItem}
//                       >
//                         {p.images?.[0]?.url && (
//                           <img src={p.images[0].url} alt={p.name} style={styles.searchResultImg} />
//                         )}
//                         <span style={styles.searchResultText}>
//                           <span style={styles.searchResultName}>{p.name}</span>
//                           {p.category?.name && (
//                             <span style={styles.searchResultCat}>{p.category.name}</span>
//                           )}
//                         </span>
//                       </button>
//                     ))}
//                     <button type="button" onClick={submitSearch} style={styles.searchViewAll}>
//                       View all results for “{search.trim()}”
//                     </button>
//                   </>
//                 ) : (
//                   <div style={styles.searchDropdownMsg}>No matching products</div>
//                 )}
//               </div>
//             )}
//           </div>
//           <Link to="/wishlist" style={styles.iconBtn} className="navbar-icon navbar-wishlist" aria-label="Wishlist">♡</Link>
//           <Link to="/cart" style={styles.iconBtn} className="navbar-icon navbar-cart" aria-label="Cart">
//             🛒
//             {itemCount > 0 && <span style={styles.cartBadge}>{itemCount}</span>}
//           </Link>
//           {user ? (
//             <div style={styles.dropdownWrap} className="navbar-account-desktop">
//               <span style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.88rem" }}>{user.name.split(" ")[0]} ▾</span>
//               <div style={styles.dropdown} className="dropdown-menu">
//                 <Link to="/account" style={styles.dropdownItem}>My Account</Link>
//                 <Link to="/account/orders" style={styles.dropdownItem}>My Orders</Link>
//                 <Link to="/account/addresses" style={styles.dropdownItem}>Addresses</Link>
//                 {user.role === "admin" && (
//                   <Link to="/admin" style={styles.dropdownItem}>Admin Panel</Link>
//                 )}
//                 <button onClick={logout} style={styles.logoutBtn}>Logout</button>
//               </div>
//             </div>
//           ) : (
//             <Link to="/login" className="btn btn-primary btn-sm navbar-login-btn navbar-account-desktop">Login</Link>
//           )}
//           <button style={styles.hamburger} className="hamburger-mobile" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
//             ☰
//           </button>
//         </div>
//       </div>

//       {menuOpen && (
//         <div style={styles.mobileMenu}>
//           <form onSubmit={submitSearch} style={{ marginBottom: 14 }}>
//             <input
//               type="text"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               style={{ ...styles.searchInput, width: "100%" }}
//             />
//           </form>
//           <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
//           {categories.map((c) => (
//             <Link key={c._id} to={`/category/${c.slug}`} onClick={() => setMenuOpen(false)}>{c.name}</Link>
//           ))}
//           <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
//           <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
//           <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
//           {user ? (
//             <>
//               <Link to="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
//               <Link to="/account/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
//               <Link to="/account/addresses" onClick={() => setMenuOpen(false)}>Addresses</Link>
//               {user.role === "admin" && (
//                 <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
//               )}
//               <button
//                 onClick={() => { logout(); setMenuOpen(false); }}
//                 style={{ textAlign: "left", padding: 0, background: "none", border: "none", cursor: "pointer", color: "var(--clay)", fontWeight: 600, fontSize: "1rem" }}
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
//           )}
//         </div>
//       )}
//     </header>
//   );
// };

// const styles = {
//   header: { position: "sticky", top: 0, zIndex: 50, transition: "box-shadow 0.25s ease" },
//   utilityBar: { background: "var(--maroon-dark)", color: "var(--ivory-deep)" },
//   utilityInner: {
//     display: "flex", alignItems: "center", justifyContent: "space-between",
//     padding: "8px 20px", fontSize: "0.72rem", letterSpacing: "0.03em", flexWrap: "wrap", gap: 6,
//   },
//   utilityTag: { opacity: 0.9 },
//   utilityRight: { display: "flex", alignItems: "center", gap: 12 },
//   dot: { width: 3, height: 3, borderRadius: "50%", background: "var(--saffron)", display: "inline-block" },
//   bar: { display: "flex", alignItems: "center", gap: 28, padding: "16px 20px", flexWrap: "wrap", background: "var(--ivory)", borderBottom: "1px solid var(--line)" },
//   logoLink: { display: "flex", alignItems: "center", gap: 13, marginLeft: -6, transition: "transform 0.2s ease" },
//   logoImg: { height: 46, objectFit: "contain", transition: "transform 0.2s ease" },
//   brandText: { display: "flex", flexDirection: "column", lineHeight: 1.25 },
//   brandName: { fontFamily: "var(--font-display)", fontSize: "1.28rem", color: "var(--wood)", letterSpacing: "0.02em" },
//   brandTagline: { fontSize: "0.66rem", letterSpacing: "0.17em", textTransform: "uppercase", color: "var(--amber-deep)", marginTop: 1 },
//   navDivider: { width: 1, alignSelf: "stretch", minHeight: 30, background: "var(--line)", margin: "0 2px" },
//   navLinks: { display: "flex", gap: 30, fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--wood)" },
//   dropdownWrap: { position: "relative" },
//   dropdown: {
//     position: "absolute", top: "130%", left: 0, background: "var(--white)",
//     border: "1px solid var(--line)", borderRadius: 10, minWidth: 180,
//     boxShadow: "var(--shadow-lift)", display: "none", flexDirection: "column", padding: 6, zIndex: 60,
//   },
//   dropdownItem: { padding: "9px 12px", borderRadius: 6, fontSize: "0.9rem", display: "block", textTransform: "none", fontWeight: 500, color: "var(--wood-soft)" },
//   logoutBtn: { textAlign: "left", padding: "9px 12px", background: "none", border: "none", cursor: "pointer", color: "var(--clay)", fontWeight: 600 },
//   searchWrap: { position: "relative" },
//   searchForm: { position: "relative", display: "flex", alignItems: "center" },
//   searchInput: { width: 260, padding: "10px 38px 10px 16px", borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--white)", fontSize: "0.9rem", transition: "border-color 0.2s ease, box-shadow 0.2s ease, width 0.2s ease" },
//   searchIconBtn: { position: "absolute", right: 8, background: "none", border: "none", cursor: "pointer", color: "var(--wood)", fontSize: "1.1rem", transition: "transform 0.15s ease" },
//   searchDropdown: {
//     position: "absolute", top: "115%", left: 0, width: 300, background: "var(--white)",
//     border: "1px solid var(--line)", borderRadius: 10, boxShadow: "var(--shadow-lift)",
//     padding: 6, zIndex: 70, maxHeight: 360, overflowY: "auto",
//   },
//   searchDropdownMsg: { padding: "12px 10px", fontSize: "0.85rem", color: "var(--wood-soft)" },
//   searchResultItem: {
//     display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
//     padding: "8px 8px", background: "none", border: "none", cursor: "pointer", borderRadius: 8,
//   },
//   searchResultImg: { width: 36, height: 36, objectFit: "contain", borderRadius: 6, background: "var(--ivory-deep)", flexShrink: 0 },
//   searchResultText: { display: "flex", flexDirection: "column", gap: 2 },
//   searchResultName: { fontSize: "0.86rem", fontWeight: 600, color: "var(--wood)" },
//   searchResultCat: { fontSize: "0.72rem", color: "var(--wood-soft)" },
//   searchViewAll: {
//     display: "block", width: "100%", textAlign: "center", padding: "10px 8px", marginTop: 4,
//     borderTop: "1px solid var(--line)", background: "none", border: "none", borderTopWidth: 1,
//     cursor: "pointer", color: "var(--amber-deep)", fontWeight: 600, fontSize: "0.8rem",
//   },
//   actions: { display: "flex", alignItems: "center", gap: 18, marginLeft: "auto" },
//   iconBtn: { position: "relative", fontSize: "1.15rem", color: "var(--wood)" },
//   cartBadge: {
//     position: "absolute", top: -8, right: -10, background: "var(--clay)", color: "#fff",
//     fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "1px 6px",
//   },
//   hamburger: { display: "none", background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "var(--wood)" },
//   mobileMenu: { display: "flex", flexDirection: "column", gap: 12, padding: "12px 20px 20px", borderTop: "1px solid var(--line)", background: "var(--ivory)" },
// };

// export default Navbar;
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { categoryApi, productApi } from "../api/endpoints";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Purely cosmetic: gives the sticky header a soft lifted shadow once the
  // page has scrolled a little, so it reads as "above" the content instead
  // of blending flat into it. No effect on layout or behavior.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the order pages the search bar tends to feel cramped next to the
  // logo/Home nav, so we nudge the logo+nav cluster a little further left
  // there (purely cosmetic — no behavior change).
  const isOrdersPage = location.pathname.startsWith("/account/orders");

  // --- Search control: live matching-product suggestions as the user types ---
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    categoryApi.list().then((res) => setCategories(res.data.categories)).catch(() => {});
  }, []);

  // Debounced live search: fetches matching products while the user types
  // and shows them in a dropdown, without changing the existing submit flow.
  useEffect(() => {
    const term = search.trim();
    if (!term) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      productApi
        .search(term)
        .then((res) => setSearchResults(res.data.products || []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Close the results dropdown when clicking outside the search control
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToProduct = (product) => {
    setShowResults(false);
    setMenuOpen(false);
    navigate(`/product/${product.slug}`);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    setShowResults(false);
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    setMenuOpen(false);
  };

  return (
    <header style={styles.header} className={scrolled ? "navbar-scrolled" : ""}>
      {/* Utility bar */}
      <div style={styles.utilityBar}>
        <div className="container" style={styles.utilityInner}>
          <span style={styles.utilityTag}>Pure &amp; Natural — Traditionally Pressed</span>
          <div style={styles.utilityRight} className="utility-right-desktop">
            <span>100% Natural</span>
            <span style={styles.dot} />
            <span>No Preservatives</span>
            <span style={styles.dot} />
            <span>Traditionally Pressed</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container navbar-bar" style={styles.bar}>
        <Link to="/" style={{ ...styles.logoLink, marginLeft: isOrdersPage ? -14 : -6 }} className="navbar-logo-link">
          <img
            src="https://maharajaoils.com/assets/img/logo.png"
            alt="Maharaja Oils"
            style={styles.logoImg}
            className="navbar-logo-img"
          />
          <span style={styles.brandText} className="navbar-brand-text">
            <span style={styles.brandName} className="navbar-brand-name">Maharaja Oils</span>
            <span style={styles.brandTagline} className="navbar-brand-tagline">Taste of Tradition</span>
          </span>
        </Link>

        <div style={styles.navDivider} className="nav-divider-desktop" />

        <nav style={{ ...styles.navLinks, marginLeft: isOrdersPage ? -8 : 0 }} className="nav-links-desktop">
          <Link to="/" className="navbar-home-link">Home</Link>
          {/* <Link to="/about">About Us</Link> */}
          <Link to="/shop">Shop</Link>
          <div style={styles.dropdownWrap}>
            <span style={{ cursor: "pointer" }}>Categories ▾</span>
            <div style={styles.dropdown} className="dropdown-menu">
              {categories.map((c) => (
                <Link key={c._id} to={`/category/${c.slug}`} style={styles.dropdownItem}>
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/contact">Contact Us</Link>
        </nav>

        <div style={styles.actions} className="navbar-actions">
          <div ref={searchWrapRef} style={styles.searchWrap} className="search-form-desktop">
            <form onSubmit={submitSearch} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Search oils, podi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowResults(true)}
                style={styles.searchInput}
                aria-label="Search products"
              />
              <button type="submit" style={styles.searchIconBtn} aria-label="Search">⌕</button>
            </form>
            {showResults && search.trim() && (
              <div style={styles.searchDropdown}>
                {searching ? (
                  <div style={styles.searchDropdownMsg}>Searching…</div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => goToProduct(p)}
                        style={styles.searchResultItem}
                      >
                        {p.images?.[0]?.url && (
                          <img src={p.images[0].url} alt={p.name} style={styles.searchResultImg} />
                        )}
                        <span style={styles.searchResultText}>
                          <span style={styles.searchResultName}>{p.name}</span>
                          {p.category?.name && (
                            <span style={styles.searchResultCat}>{p.category.name}</span>
                          )}
                        </span>
                      </button>
                    ))}
                    <button type="button" onClick={submitSearch} style={styles.searchViewAll}>
                      View all results for “{search.trim()}”
                    </button>
                  </>
                ) : (
                  <div style={styles.searchDropdownMsg}>No matching products</div>
                )}
              </div>
            )}
          </div>
          <Link to="/wishlist" style={styles.iconBtn} className="navbar-icon navbar-wishlist" aria-label="Wishlist">♡</Link>
          <Link to="/cart" style={styles.iconBtn} className="navbar-icon navbar-cart" aria-label="Cart">
            🛒
            {itemCount > 0 && <span style={styles.cartBadge}>{itemCount}</span>}
          </Link>
          {user ? (
            <div style={styles.dropdownWrap} className="navbar-account-desktop">
              <span style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.88rem" }}>{user.name.split(" ")[0]} ▾</span>
              <div style={styles.dropdown} className="dropdown-menu">
                <Link to="/account" style={styles.dropdownItem}>My Account</Link>
                <Link to="/account/orders" style={styles.dropdownItem}>My Orders</Link>
                <Link to="/account/addresses" style={styles.dropdownItem}>Addresses</Link>
                {user.role === "admin" && (
                  <Link to="/admin" style={styles.dropdownItem}>Admin Panel</Link>
                )}
                <button onClick={logout} style={styles.logoutBtn}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm navbar-login-btn navbar-account-desktop">Login</Link>
          )}
          <button style={styles.hamburger} className="hamburger-mobile" onClick={() => { setMenuOpen((v) => !v); setCategoriesOpen(false); }} aria-label="Menu">
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <form onSubmit={submitSearch} style={{ marginBottom: 14 }}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...styles.searchInput, width: "100%" }}
            />
          </form>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>

          {categories.length > 0 && (
            <div className="mobile-menu-accordion">
              <button
                type="button"
                className="mobile-menu-accordion-toggle"
                onClick={() => setCategoriesOpen((v) => !v)}
                aria-expanded={categoriesOpen}
              >
                <span>Categories</span>
                <span className="mobile-menu-accordion-icon">{categoriesOpen ? "−" : "+"}</span>
              </button>
              {categoriesOpen && (
                <div className="mobile-menu-accordion-body">
                  {categories.map((c) => (
                    <Link key={c._id} to={`/category/${c.slug}`} onClick={() => setMenuOpen(false)}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          {user ? (
            <>
              <Link to="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
              <Link to="/account/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <Link to="/account/addresses" onClick={() => setMenuOpen(false)}>Addresses</Link>
              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
              )}
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                style={{ textAlign: "left", padding: 0, background: "none", border: "none", cursor: "pointer", color: "var(--clay)", fontWeight: 600, fontSize: "1rem" }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

const styles = {
  header: { position: "sticky", top: 0, zIndex: 50, transition: "box-shadow 0.25s ease" },
  utilityBar: { background: "var(--maroon-dark)", color: "var(--ivory-deep)" },
  utilityInner: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "8px 20px", fontSize: "0.72rem", letterSpacing: "0.03em", flexWrap: "wrap", gap: 6,
  },
  utilityTag: { opacity: 0.9 },
  utilityRight: { display: "flex", alignItems: "center", gap: 12 },
  dot: { width: 3, height: 3, borderRadius: "50%", background: "var(--saffron)", display: "inline-block" },
  bar: { display: "flex", alignItems: "center", gap: 28, padding: "16px 20px", flexWrap: "wrap", background: "var(--ivory)", borderBottom: "1px solid var(--line)" },
  logoLink: { display: "flex", alignItems: "center", gap: 13, marginLeft: -6, transition: "transform 0.2s ease" },
  logoImg: { height: 46, objectFit: "contain", transition: "transform 0.2s ease" },
  brandText: { display: "flex", flexDirection: "column", lineHeight: 1.25 },
  brandName: { fontFamily: "var(--font-display)", fontSize: "1.28rem", color: "var(--wood)", letterSpacing: "0.02em" },
  brandTagline: { fontSize: "0.66rem", letterSpacing: "0.17em", textTransform: "uppercase", color: "var(--amber-deep)", marginTop: 1 },
  navDivider: { width: 1, alignSelf: "stretch", minHeight: 30, background: "var(--line)", margin: "0 2px" },
  navLinks: { display: "flex", gap: 30, fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--wood)" },
  dropdownWrap: { position: "relative" },
  dropdown: {
    position: "absolute", top: "130%", left: 0, background: "var(--white)",
    border: "1px solid var(--line)", borderRadius: 10, minWidth: 180,
    boxShadow: "var(--shadow-lift)", display: "none", flexDirection: "column", padding: 6, zIndex: 60,
  },
  dropdownItem: { padding: "9px 12px", borderRadius: 6, fontSize: "0.9rem", display: "block", textTransform: "none", fontWeight: 500, color: "var(--wood-soft)" },
  logoutBtn: { textAlign: "left", padding: "9px 12px", background: "none", border: "none", cursor: "pointer", color: "var(--clay)", fontWeight: 600 },
  searchWrap: { position: "relative" },
  searchForm: { position: "relative", display: "flex", alignItems: "center" },
  searchInput: { width: 260, padding: "10px 38px 10px 16px", borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--white)", fontSize: "0.9rem", transition: "border-color 0.2s ease, box-shadow 0.2s ease, width 0.2s ease" },
  searchIconBtn: { position: "absolute", right: 8, background: "none", border: "none", cursor: "pointer", color: "var(--wood)", fontSize: "1.1rem", transition: "transform 0.15s ease" },
  searchDropdown: {
    position: "absolute", top: "115%", left: 0, width: 300, background: "var(--white)",
    border: "1px solid var(--line)", borderRadius: 10, boxShadow: "var(--shadow-lift)",
    padding: 6, zIndex: 70, maxHeight: 360, overflowY: "auto",
  },
  searchDropdownMsg: { padding: "12px 10px", fontSize: "0.85rem", color: "var(--wood-soft)" },
  searchResultItem: {
    display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
    padding: "8px 8px", background: "none", border: "none", cursor: "pointer", borderRadius: 8,
  },
  searchResultImg: { width: 36, height: 36, objectFit: "contain", borderRadius: 6, background: "var(--ivory-deep)", flexShrink: 0 },
  searchResultText: { display: "flex", flexDirection: "column", gap: 2 },
  searchResultName: { fontSize: "0.86rem", fontWeight: 600, color: "var(--wood)" },
  searchResultCat: { fontSize: "0.72rem", color: "var(--wood-soft)" },
  searchViewAll: {
    display: "block", width: "100%", textAlign: "center", padding: "10px 8px", marginTop: 4,
    borderTop: "1px solid var(--line)", background: "none", border: "none", borderTopWidth: 1,
    cursor: "pointer", color: "var(--amber-deep)", fontWeight: 600, fontSize: "0.8rem",
  },
  actions: { display: "flex", alignItems: "center", gap: 18, marginLeft: "auto" },
  iconBtn: { position: "relative", fontSize: "1.15rem", color: "var(--wood)" },
  cartBadge: {
    position: "absolute", top: -8, right: -10, background: "var(--clay)", color: "#fff",
    fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "1px 6px",
  },
  hamburger: { display: "none", background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "var(--wood)" },
  mobileMenu: { display: "flex", flexDirection: "column", gap: 12, padding: "12px 20px 20px", borderTop: "1px solid var(--line)", background: "var(--ivory)" },
};

export default Navbar;