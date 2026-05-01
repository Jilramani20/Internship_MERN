import React from 'react';

function ProductCard({ name, price, description, category }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="category-badge">{category}</span>
        <h3 className="product-name">{name}</h3>
      </div>
      <div className="card-body">
        <p className="description">{description}</p>
        <p className="price">₹{price.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ProductCard;
