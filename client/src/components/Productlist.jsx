import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from './ProductCard'; // Assuming you have a ProductCard component

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Send GET request to the backend API (running on localhost:5000)
        const response = await axios.get('http://localhost:5000/api/products', {
          params: { query: 'bags' } // Example query for products
        });

        // Set the fetched products to state
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means it will run only once (on component mount)

  return (
    <div className="product-list">
      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductList;
