import React, { useState, useEffect } from "react";
import axios from "axios";
import "./productList.css";

const ProductList = () => {
  const initialCount = 10;
  const loadMoreCount = 10;
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ start: 0, end: initialCount });
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const url = "https://localhost:8443";
  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        const allProducts = response.data.products;
        setProducts(allProducts);
        const initialVisibleProducts = allProducts.slice(0, initialCount);
        setVisibleProducts(initialVisibleProducts);
        setRange({ start: 1, end: initialVisibleProducts.length });
        if (allProducts.length > initialCount) {
          setShowLoadMore(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching the products:", error);
        setLoading(false);
      });
  }, []);

  const handleLoadMore = () => {
    const newVisibleCount = visibleCount + loadMoreCount;
    const newVisibleProducts = products.slice(0, newVisibleCount);
    setVisibleProducts(newVisibleProducts);
    setVisibleCount(newVisibleCount);
    setRange({ start: 1, end: newVisibleProducts.length });
    if (newVisibleCount >= products.length) {
      setShowLoadMore(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="product-list">
        {visibleProducts?.map((product, index) => (
          <div key={product.id} className="product-item">
            <img
              height={300}
              width={300}
              src={product.images[0]}
              alt={product.thumbnail}
            />
            {product?.title}
            <div>
              <p>{product?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="show-items">
        Showing {range.start} - {range.end} items of {products.length}
      </div>
      {showLoadMore && (
        <button onClick={handleLoadMore} className="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
};

export default ProductList;
