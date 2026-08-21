import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { productApi, categoryApi } from "../api/endpoints";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const { slug } = useParams(); // present on /category/:slug, undefined on /shop
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const search = searchParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    setPage(1);
    if (slug) {
      categoryApi.bySlug(slug).then((res) => setCategory(res.data.category)).catch(() => setCategory(null));
    } else {
      setCategory(null);
    }
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    productApi
      .list({ category: slug, search, page })
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [slug, search, page]);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <p className="eyebrow">{search ? "Search Results" : "Shop"}</p>
      <h1>{search ? `“${search}”` : category ? category.name : "All Products"}</h1>
      {category?.description && <p style={{ maxWidth: 620 }}>{category.description}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 22, marginTop: 24 }}>
        {(loading ? Array.from({ length: 8 }) : products).map((p, i) =>
          p ? <ProductCard key={p._id} product={p} /> : <div key={i} className="skeleton" style={{ height: 320 }} />
        )}
      </div>

      {!loading && products.length === 0 && (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try a different search or browse all categories.</p>
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 40 }}>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
