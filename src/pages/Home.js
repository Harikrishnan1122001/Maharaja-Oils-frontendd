// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { productApi, categoryApi, bannerApi } from "../api/endpoints";
// import ProductCard from "../components/ProductCard";
// import DripDivider from "../components/DripDivider";
// import CategoryCarousel from "../components/CategoryCarousel";

// const FALLBACK_BANNERS = [
//   { image: { url: "https://maharajaoils.com/assets/img/banners/Home-carousel-new-1.jpg" } },
//   { image: { url: "https://maharajaoils.com/assets/img/banners/Home-carousel-new-2.jpg" } },
// ];

// const FEATURES = [
//   { icon: "leaf", title: "100% Natural", sub: "No Chemicals" },
//   { icon: "mill", title: "Traditionally", sub: "Cold Pressed" },
//   { icon: "seed", title: "Premium", sub: "Quality Seeds" },
//   { icon: "heart", title: "Rich in Nutrition", sub: "Good for Health" },
//   { icon: "badge", title: "Authentic", sub: "Traditional Taste" },
// ];

// const PROCESS = [
//   { n: "01", title: "Quality Seeds", sub: "Carefully selected best quality seeds" },
//   { n: "02", title: "Cleaning", sub: "Seeds are cleaned to remove impurities" },
//   { n: "03", title: "Traditional Pressing", sub: "Wooden chekku pressed to retain nutrients" },
//   { n: "04", title: "Filtering", sub: "Natural filtration for purity" },
//   { n: "05", title: "Quality Testing", sub: "Rigorous quality checks" },
//   { n: "06", title: "Hygienic Bottling", sub: "Packed with care to retain freshness" },
// ];

// const WHY_US = [
//   { icon: "leaf", title: "100% Pure", sub: "No additives or preservatives" },
//   { icon: "mill", title: "Traditionally Cold Pressed", sub: "Retains natural nutrients" },
//   { icon: "seed", title: "Premium Quality Seeds", sub: "Sourced from trusted farmers" },
//   { icon: "heart", title: "Good for Health", sub: "Rich in essential nutrients" },
//   { icon: "badge", title: "Authentic Taste", sub: "Brings true traditional flavour" },
// ];

// const RECIPES = [
//   { name: "Traditional Sambar", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=300&auto=format&fit=crop" },
//   { name: "Podi Idli", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=300&auto=format&fit=crop" },
//   { name: "Chettinad Kuzhambu", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=300&auto=format&fit=crop" },
//   { name: "Ghee Roast Adai", img: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=300&auto=format&fit=crop" },
// ];

// const TESTIMONIALS = [
//   { quote: "The aroma and purity of Maharaja Oils is unmatched. It brings the authentic taste of home cooking to our meals every single day.", name: "Meenakshi S., Karaikudi" },
//   { quote: "We switched our whole kitchen to wooden chekku oils after trying Maharaja's gingelly oil. The difference in flavour is unmistakable.", name: "Suresh R., Madurai" },
//   { quote: "Reliable, natural, and consistently fresh. Their groundnut oil has become a staple in our household.", name: "Divya K., Chennai" },
// ];

// const Icon = ({ name }) => {
//   const common = { width: 30, height: 30, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
//   switch (name) {
//     case "leaf":
//       return <svg {...common}><path d="M5 21c8-1 13-6 14-14-8 1-13 6-14 14Z" /><path d="M5 21c1-4 3-7 6-9" /></svg>;
//     case "mill":
//       return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l4 4M18 18l-4-4M6 18l4-4M18 6l-4 4" /></svg>;
//     case "seed":
//       return <svg {...common}><path d="M12 22c5-1 8-5 8-10a8 8 0 0 0-8-8 8 8 0 0 0-8 8c0 5 3 9 8 10Z" /><path d="M12 4v18" /></svg>;
//     case "heart":
//       return <svg {...common}><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" /></svg>;
//     case "badge":
//       return <svg {...common}><circle cx="12" cy="9" r="6" /><path d="M9 14.5 7.5 21 12 18.5 16.5 21 15 14.5" /></svg>;
//     default:
//       return null;
//   }
// };

// const Home = () => {
//   const [featured, setFeatured] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [banners, setBanners] = useState(FALLBACK_BANNERS);
//   const [bannerIdx, setBannerIdx] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       productApi.featured().catch(() => ({ data: { products: [] } })),
//       categoryApi.list().catch(() => ({ data: { categories: [] } })),
//       bannerApi.list().catch(() => ({ data: { banners: [] } })),
//     ]).then(([p, c, b]) => {
//       setFeatured(p.data.products);
//       setCategories(c.data.categories);
//       if (b.data.banners?.length) setBanners(b.data.banners);
//       setLoading(false);
//     });
//   }, []);

//   useEffect(() => {
//     const t = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 5000);
//     return () => clearInterval(t);
//   }, [banners.length]);

//   return (
//     <div>
//       {/* Hero */}
//       <section style={styles.hero} className="hero-banner">
//         <img src={banners[bannerIdx]?.image?.url} alt="" style={styles.heroImg} className="hero-banner-img" />
//         <div style={styles.heroOverlay} className="hero-banner-overlay">
//           <div className="container">
//             <h1 style={{ color: "var(--ivory)", maxWidth: 640 }}>
//               <br />
              
//             </h1>
           
//             <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Feature strip */}
//       <section style={styles.featureStrip}>
//         <div className="container" style={styles.featureGrid}>
//           {FEATURES.map((f) => (
//             <div key={f.title} style={styles.featureItem}>
//               <span style={{ color: "var(--saffron)" }}><Icon name={f.icon} /></span>
//               <div>
//                 <div style={styles.featureTitle}>{f.title}</div>
//                 <div style={styles.featureSub}>{f.sub}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Premium Oils / Categories */}
//       <section className="container" style={{ marginTop: 56 }}>
//         <div className="section-head">
//           <p className="eyebrow">Our Range</p>
//           <h2>Our Premium Oils</h2>
//           <div className="flourish" />
//         </div>
//         {/* Carousel slider showing ALL categories (not just the first few) —
//             each slide is clickable and routes to /category/:slug */}
//         <CategoryCarousel categories={categories} loading={loading} />
//         <div style={{ textAlign: "center", marginTop: 30 }}>
//           <Link to="/shop" className="btn btn-outline btn-sm">View All Products</Link>
//         </div>
//       </section>

//       {/* Traditional Process */}
//       <section style={styles.processSection}>
//         <div className="container">
//           <div className="section-head">
//             <p className="eyebrow" style={{ color: "var(--saffron)", justifyContent: "center" }}>How It's Made</p>
//             <h2 style={{ color: "var(--ivory)" }}>Our Traditional Process</h2>
//             <div className="flourish" />
//           </div>
//           <div className="process-grid" style={styles.processGrid}>
//             {PROCESS.map((step, i) => (
//               <div key={step.n} className="process-item-wrap" style={styles.processItemWrap}>
//                 <div style={styles.processItem}>
//                   <div style={styles.processCircle}>{step.n}</div>
//                   <h4 style={{ color: "var(--ivory)", fontSize: "1rem" }}>{step.title}</h4>
//                   <p style={styles.processSub}>{step.sub}</p>
//                 </div>
//                 {i < PROCESS.length - 1 && <span style={styles.processArrow}>›</span>}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Us */}
//       <section className="container" style={{ marginTop: 60 }}>
//         <div className="section-head">
//           <p className="eyebrow">Our Promise</p>
//           <h2>Why Choose Maharaja Oils?</h2>
//           <div className="flourish" />
//         </div>
//         <div style={styles.whyGrid}>
//           {WHY_US.map((w) => (
//             <div key={w.title} style={styles.whyCard}>
//               <span style={{ color: "var(--wood)" }}><Icon name={w.icon} /></span>
//               <h4 style={{ fontSize: "0.95rem", marginTop: 10 }}>{w.title}</h4>
//               <p style={{ fontSize: "0.82rem", marginBottom: 0 }}>{w.sub}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <div className="container"><DripDivider /></div>

//       {/* Featured products */}
//       <section className="container">
//         <div className="section-head">
//           <p className="eyebrow">New &amp; Loved</p>
//           <h2>Featured Products</h2>
//           <div className="flourish" />
//         </div>
//         <div style={styles.productGrid}>
//           {(loading ? Array.from({ length: 8 }) : featured).map((p, i) =>
//             p ? <ProductCard key={p._id} product={p} /> : <div key={i} className="skeleton" style={{ height: 320 }} />
//           )}
//         </div>
//         {!loading && featured.length === 0 && (
//           <div className="empty-state"><h3>No featured products yet</h3><p>Check back soon.</p></div>
//         )}
//       </section>

//       {/* About split section */}
//       {/* <section className="container split-grid" style={styles.aboutSection}>
//         <div style={styles.aboutImgWrap}>
//           <img
//             src="https://images.unsplash.com/photo-1580820267682-426da823b514?q=80&w=700&auto=format&fit=crop"
//             alt="Traditional Chettinad courtyard"
//             style={styles.aboutImg}
//           />
//         </div> */}
//         {/* <div>
//           <p className="eyebrow">About Us</p>
//           <h2>Rooted in Karaikudi.<br />Inspired by Generations.</h2>
//           <div className="flourish" style={{ margin: "6px 0 16px" }} />
//           <p>
//             Maharaja Oils is born from the rich culinary heritage of Chettinad. For generations,
//             our families have trusted the goodness of cold pressed oils for healthy and flavourful
//             cooking. We continue this tradition with the same purity, quality and care.
//           </p>
//           <Link to="/about" className="btn btn-primary" style={{ marginTop: 8 }}>Know More About Us</Link>
//         </div> */}
//       {/* </section> */}

//       {/* Testimonials + Recipes */}
//       <section className="container split-grid-wide" style={styles.bottomGrid}>
//         <div style={styles.testimonialPanel}>
//           <h3 style={{ color: "var(--ivory)" }}>What Our Customers Say</h3>
//           <div className="flourish" style={{ margin: "4px 0 20px" }} />
//           <blockquote style={styles.quote}>
//             <span style={{ fontSize: "2rem", color: "var(--saffron)", lineHeight: 0.5 }}>&ldquo;</span>
//             <p style={{ color: "var(--ivory-deep)", fontStyle: "italic" }}>{TESTIMONIALS[0].quote}</p>
//             <cite style={{ color: "var(--saffron)", fontStyle: "normal", fontWeight: 600, fontSize: "0.85rem" }}>
//               — {TESTIMONIALS[0].name}
//             </cite>
//           </blockquote>
//         </div>
//         <div>
//           <h3>Traditional Recipes</h3>
//           <div className="flourish" style={{ margin: "4px 0 20px" }} />
//           <div style={styles.recipeGrid}>
//             {RECIPES.map((r) => (
//               <div key={r.name} style={styles.recipeItem}>
//                 <div style={styles.recipeImgWrap}>
//                   <img src={r.img} alt={r.name} style={styles.recipeImg} />
//                 </div>
//                 <span style={styles.recipeName}>{r.name}</span>
//               </div>
//             ))}
//           </div>
//           <div style={{ textAlign: "center", marginTop: 20 }}>
//             <Link to="/about" className="btn btn-outline btn-sm">View All Recipes</Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// const styles = {
//   hero: { position: "relative", height: "64vh", minHeight: 440, overflow: "hidden" },
//   heroImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
//   heroOverlay: {
//     position: "absolute", inset: 0,
//     background: "linear-gradient(90deg, rgba(59,9,15,0.86) 0%, rgba(59,9,15,0.45) 55%, rgba(59,9,15,0.15) 100%)",
//     display: "flex", alignItems: "center",
//   },
//   featureStrip: { background: "var(--wood)", padding: "22px 0" },
//   featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 18 },
//   featureItem: { display: "flex", alignItems: "center", gap: 12, justifyContent: "center" },
//   featureTitle: { color: "var(--ivory)", fontWeight: 600, fontSize: "0.85rem" },
//   featureSub: { color: "var(--ivory-deep)", fontSize: "0.78rem" },

//   catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 22, marginTop: 24 },
//   catCard: { textAlign: "center", padding: "26px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
//   catImgWrap: { width: "100%", maxWidth: 150, aspectRatio: "1/1.6", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--ivory-deep)", marginBottom: 6 },
//   catImg: { width: "100%", height: "100%", objectFit: "contain" },
//   catName: { fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", color: "var(--wood)", letterSpacing: "0.03em" },
//   catDesc: { fontSize: "0.82rem", marginBottom: 6 },

//   productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 22, marginTop: 24 },

//   processSection: { background: "var(--maroon-dark)", marginTop: 60, padding: "50px 0" },
//   processGrid: { display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start", gap: 6, marginTop: 20 },
//   processItemWrap: { display: "flex", alignItems: "flex-start", gap: 6 },
//   processItem: { width: 150, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
//   processCircle: {
//     width: 64, height: 64, borderRadius: "50%", border: "1.5px solid var(--saffron)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--saffron)",
//   },
//   processSub: { fontSize: "0.76rem", color: "var(--ivory-deep)", marginBottom: 0 },
//   processArrow: { color: "var(--saffron)", fontSize: "1.6rem", marginTop: 20, opacity: 0.6 },

//   whyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 18, marginTop: 24 },
//   whyCard: { border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: "26px 18px", textAlign: "center", background: "var(--white)" },

//   aboutSection: { marginTop: 64, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "center" },
//   aboutImgWrap: { borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-lift)" },
//   aboutImg: { width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 320 },

//   bottomGrid: { marginTop: 64, marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 30 },
//   testimonialPanel: { background: "var(--wood)", borderRadius: "var(--radius-lg)", padding: "36px 32px" },
//   quote: { margin: 0, borderLeft: "2px solid var(--saffron)", paddingLeft: 16 },
//   recipeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16 },
//   recipeItem: { textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
//   recipeImgWrap: { width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: "3px solid var(--ivory-deep)", boxShadow: "var(--shadow-soft)" },
//   recipeImg: { width: "100%", height: "100%", objectFit: "cover" },
//   recipeName: { fontSize: "0.82rem", fontWeight: 600, color: "var(--wood)" },
// };

// export default Home;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productApi, categoryApi, bannerApi } from "../api/endpoints";
import ProductCard from "../components/ProductCard";
import DripDivider from "../components/DripDivider";
import CategoryCarousel from "../components/CategoryCarousel";

const FALLBACK_BANNERS = [
  { image: { url: "https://maharajaoils.com/assets/img/banners/Home-carousel-new-1.jpg" } },
  { image: { url: "https://maharajaoils.com/assets/img/banners/Home-carousel-new-2.jpg" } },
];

const FEATURES = [
  { icon: "leaf", title: "100% Natural", sub: "No Chemicals" },
  { icon: "mill", title: "Traditionally", sub: "Cold Pressed" },
  { icon: "seed", title: "Premium", sub: "Quality Seeds" },
  { icon: "heart", title: "Rich in Nutrition", sub: "Good for Health" },
  { icon: "badge", title: "Authentic", sub: "Traditional Taste" },
];

const PROCESS = [
  { n: "01", title: "Quality Seeds", sub: "Carefully selected best quality seeds" },
  { n: "02", title: "Cleaning", sub: "Seeds are cleaned to remove impurities" },
  { n: "03", title: "Traditional Pressing", sub: "Wooden chekku pressed to retain nutrients" },
  { n: "04", title: "Filtering", sub: "Natural filtration for purity" },
  { n: "05", title: "Quality Testing", sub: "Rigorous quality checks" },
  { n: "06", title: "Hygienic Bottling", sub: "Packed with care to retain freshness" },
];

const WHY_US = [
  { icon: "leaf", title: "100% Pure", sub: "No additives or preservatives" },
  { icon: "mill", title: "Traditionally Cold Pressed", sub: "Retains natural nutrients" },
  { icon: "seed", title: "Premium Quality Seeds", sub: "Sourced from trusted farmers" },
  { icon: "heart", title: "Good for Health", sub: "Rich in essential nutrients" },
  { icon: "badge", title: "Authentic Taste", sub: "Brings true traditional flavour" },
];

const RECIPES = [
  { name: "Traditional Sambar", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=300&auto=format&fit=crop" },
  { name: "Podi Idli", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=300&auto=format&fit=crop" },
  { name: "Chettinad Kuzhambu", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=300&auto=format&fit=crop" },
  { name: "Ghee Roast Adai", img: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=300&auto=format&fit=crop" },
];

const TESTIMONIALS = [
  { quote: "The aroma and purity of Maharaja Oils is unmatched. It brings the authentic taste of home cooking to our meals every single day.", name: "Meenakshi S., Karaikudi" },
  { quote: "We switched our whole kitchen to wooden chekku oils after trying Maharaja's gingelly oil. The difference in flavour is unmistakable.", name: "Suresh R., Madurai" },
  { quote: "Reliable, natural, and consistently fresh. Their groundnut oil has become a staple in our household.", name: "Divya K., Chennai" },
];

const Icon = ({ name }) => {
  const common = { width: 30, height: 30, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "leaf":
      return <svg {...common}><path d="M5 21c8-1 13-6 14-14-8 1-13 6-14 14Z" /><path d="M5 21c1-4 3-7 6-9" /></svg>;
    case "mill":
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l4 4M18 18l-4-4M6 18l4-4M18 6l-4 4" /></svg>;
    case "seed":
      return <svg {...common}><path d="M12 22c5-1 8-5 8-10a8 8 0 0 0-8-8 8 8 0 0 0-8 8c0 5 3 9 8 10Z" /><path d="M12 4v18" /></svg>;
    case "heart":
      return <svg {...common}><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" /></svg>;
    case "badge":
      return <svg {...common}><circle cx="12" cy="9" r="6" /><path d="M9 14.5 7.5 21 12 18.5 16.5 21 15 14.5" /></svg>;
    default:
      return null;
  }
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState(FALLBACK_BANNERS);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productApi.featured().catch(() => ({ data: { products: [] } })),
      categoryApi.list().catch(() => ({ data: { categories: [] } })),
      bannerApi.list().catch(() => ({ data: { banners: [] } })),
    ]).then(([p, c, b]) => {
      setFeatured(p.data.products);
      setCategories(c.data.categories);
      if (b.data.banners?.length) setBanners(b.data.banners);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero} className="hero-banner">
        <img src={banners[bannerIdx]?.image?.url} alt="" style={styles.heroImg} className="hero-banner-img" />
        <div style={styles.heroOverlay} className="hero-banner-overlay">
          <div className="container">
            <h1 style={{ color: "var(--ivory)", maxWidth: 640 }}>
              <br />
              
            </h1>
           
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section style={styles.featureStrip}>
        <div className="container" style={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} style={styles.featureItem}>
              <span style={{ color: "var(--saffron)" }}><Icon name={f.icon} /></span>
              <div>
                <div style={styles.featureTitle}>{f.title}</div>
                <div style={styles.featureSub}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Oils / Categories */}
      <section className="container" style={{ marginTop: 56 }}>
        <div className="section-head">
          <p className="eyebrow">Our Range</p>
          <h2>Our Premium Oils</h2>
          <div className="flourish" />
        </div>
        {/* Carousel slider showing ALL categories (not just the first few) —
            each slide is clickable and routes to /category/:slug */}
        <CategoryCarousel categories={categories} loading={loading} />
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link to="/shop" className="btn btn-outline btn-sm">View All Products</Link>
        </div>
      </section>

      {/* Traditional Process */}
      <section style={styles.processSection}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow" style={{ color: "var(--saffron)", justifyContent: "center" }}>How It's Made</p>
            <h2 style={{ color: "var(--ivory)" }}>Our Traditional Process</h2>
            <div className="flourish" />
          </div>
          <div className="process-grid" style={styles.processGrid}>
            {PROCESS.map((step, i) => (
              <div key={step.n} className="process-item-wrap" style={styles.processItemWrap}>
                <div style={styles.processItem} className="process-item">
                  <div style={styles.processCircle}>{step.n}</div>
                  <h4 style={{ color: "var(--ivory)", fontSize: "1rem" }}>{step.title}</h4>
                  <p style={styles.processSub}>{step.sub}</p>
                </div>
                {i < PROCESS.length - 1 && <span style={styles.processArrow}>›</span>}
              </div>
            ))}
          </div>
          <div className="process-carousel-hint" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container" style={{ marginTop: 60 }}>
        <div className="section-head">
          <p className="eyebrow">Our Promise</p>
          <h2>Why Choose Maharaja Oils?</h2>
          <div className="flourish" />
        </div>
        <div style={styles.whyGrid}>
          {WHY_US.map((w) => (
            <div key={w.title} style={styles.whyCard}>
              <span style={{ color: "var(--wood)" }}><Icon name={w.icon} /></span>
              <h4 style={{ fontSize: "0.95rem", marginTop: 10 }}>{w.title}</h4>
              <p style={{ fontSize: "0.82rem", marginBottom: 0 }}>{w.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container"><DripDivider /></div>

      {/* Featured products */}
      <section className="container">
        <div className="section-head">
          <p className="eyebrow">New &amp; Loved</p>
          <h2>Featured Products</h2>
          <div className="flourish" />
        </div>
        <div style={styles.productGrid}>
          {(loading ? Array.from({ length: 8 }) : featured).map((p, i) =>
            p ? <ProductCard key={p._id} product={p} /> : <div key={i} className="skeleton" style={{ height: 320 }} />
          )}
        </div>
        {!loading && featured.length === 0 && (
          <div className="empty-state"><h3>No featured products yet</h3><p>Check back soon.</p></div>
        )}
      </section>

      {/* About split section */}
      {/* <section className="container split-grid" style={styles.aboutSection}>
        <div style={styles.aboutImgWrap}>
          <img
            src="https://images.unsplash.com/photo-1580820267682-426da823b514?q=80&w=700&auto=format&fit=crop"
            alt="Traditional Chettinad courtyard"
            style={styles.aboutImg}
          />
        </div> */}
        {/* <div>
          <p className="eyebrow">About Us</p>
          <h2>Rooted in Karaikudi.<br />Inspired by Generations.</h2>
          <div className="flourish" style={{ margin: "6px 0 16px" }} />
          <p>
            Maharaja Oils is born from the rich culinary heritage of Chettinad. For generations,
            our families have trusted the goodness of cold pressed oils for healthy and flavourful
            cooking. We continue this tradition with the same purity, quality and care.
          </p>
          <Link to="/about" className="btn btn-primary" style={{ marginTop: 8 }}>Know More About Us</Link>
        </div> */}
      {/* </section> */}

      {/* Testimonials + Recipes */}
      <section className="container split-grid-wide" style={styles.bottomGrid}>
        <div style={styles.testimonialPanel}>
          <h3 style={{ color: "var(--ivory)" }}>What Our Customers Say</h3>
          <div className="flourish" style={{ margin: "4px 0 20px" }} />
          <blockquote style={styles.quote}>
            <span style={{ fontSize: "2rem", color: "var(--saffron)", lineHeight: 0.5 }}>&ldquo;</span>
            <p style={{ color: "var(--ivory-deep)", fontStyle: "italic" }}>{TESTIMONIALS[0].quote}</p>
            <cite style={{ color: "var(--saffron)", fontStyle: "normal", fontWeight: 600, fontSize: "0.85rem" }}>
              — {TESTIMONIALS[0].name}
            </cite>
          </blockquote>
        </div>
        <div>
          <h3>Traditional Recipes</h3>
          <div className="flourish" style={{ margin: "4px 0 20px" }} />
          <div style={styles.recipeGrid}>
            {RECIPES.map((r) => (
              <div key={r.name} style={styles.recipeItem}>
                <div style={styles.recipeImgWrap}>
                  <img src={r.img} alt={r.name} style={styles.recipeImg} />
                </div>
                <span style={styles.recipeName}>{r.name}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link to="/about" className="btn btn-outline btn-sm">View All Recipes</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: { position: "relative", height: "64vh", minHeight: 440, overflow: "hidden" },
  heroImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(90deg, rgba(59,9,15,0.86) 0%, rgba(59,9,15,0.45) 55%, rgba(59,9,15,0.15) 100%)",
    display: "flex", alignItems: "center",
  },
  featureStrip: { background: "var(--wood)", padding: "22px 0" },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 18 },
  featureItem: { display: "flex", alignItems: "center", gap: 12, justifyContent: "center" },
  featureTitle: { color: "var(--ivory)", fontWeight: 600, fontSize: "0.85rem" },
  featureSub: { color: "var(--ivory-deep)", fontSize: "0.78rem" },

  catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 22, marginTop: 24 },
  catCard: { textAlign: "center", padding: "26px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  catImgWrap: { width: "100%", maxWidth: 150, aspectRatio: "1/1.6", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--ivory-deep)", marginBottom: 6 },
  catImg: { width: "100%", height: "100%", objectFit: "contain" },
  catName: { fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", color: "var(--wood)", letterSpacing: "0.03em" },
  catDesc: { fontSize: "0.82rem", marginBottom: 6 },

  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 22, marginTop: 24 },

  processSection: { background: "var(--maroon-dark)", marginTop: 60, padding: "50px 0" },
  processGrid: { display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start", gap: 6, marginTop: 20 },
  processItemWrap: { display: "flex", alignItems: "flex-start", gap: 6 },
  processItem: { width: 150, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  processCircle: {
    width: 64, height: 64, borderRadius: "50%", border: "1.5px solid var(--saffron)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--saffron)",
  },
  processSub: { fontSize: "0.76rem", color: "var(--ivory-deep)", marginBottom: 0 },
  processArrow: { color: "var(--saffron)", fontSize: "1.6rem", marginTop: 20, opacity: 0.6 },

  whyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 18, marginTop: 24 },
  whyCard: { border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: "26px 18px", textAlign: "center", background: "var(--white)" },

  aboutSection: { marginTop: 64, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "center" },
  aboutImgWrap: { borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-lift)" },
  aboutImg: { width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 320 },

  bottomGrid: { marginTop: 64, marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 30 },
  testimonialPanel: { background: "var(--wood)", borderRadius: "var(--radius-lg)", padding: "36px 32px" },
  quote: { margin: 0, borderLeft: "2px solid var(--saffron)", paddingLeft: 16 },
  recipeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16 },
  recipeItem: { textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  recipeImgWrap: { width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: "3px solid var(--ivory-deep)", boxShadow: "var(--shadow-soft)" },
  recipeImg: { width: "100%", height: "100%", objectFit: "cover" },
  recipeName: { fontSize: "0.82rem", fontWeight: 600, color: "var(--wood)" },
};

export default Home;