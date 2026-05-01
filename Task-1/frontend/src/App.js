import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for adding new product
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Is your backend running?');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit - Add new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', {
        ...form,
        price: Number(form.price)
      });
      setForm({ name: '', price: '', description: '', category: '' });
      fetchProducts(); // Refresh list
    } catch (err) {
      alert('Error adding product!');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts(); // Refresh list
    } catch (err) {
      alert('Error deleting product!');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛒 Product Manager</h1>
        <p>MERN Stack Internship — Task 1</p>
      </header>

      {/* Add Product Form */}
      <div className="form-container">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
          <button type="submit" className="btn-add">Add Product</button>
        </form>
      </div>

      {/* Products List */}
      <div className="products-section">
        <h2>All Products ({products.length})</h2>

        {loading && <p className="status-msg">Loading products...</p>}
        {error && <p className="status-msg error">{error}</p>}

        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="card-wrapper">
              <ProductCard
                name={product.name}
                price={product.price}
                description={product.description}
                category={product.category}
              />
              <button
                className="btn-delete"
                onClick={() => handleDelete(product._id)}
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>

        {!loading && products.length === 0 && (
          <p className="status-msg">No products yet. Add some above!</p>
        )}
      </div>
    </div>
  );
}

export default App;