import React from 'react';
import { Product } from '../api/mockApi';
import { formatCurrency } from '../utils/formatCurrency';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article className="product-card" tabIndex={0} aria-label={`${product.name}, ${formatCurrency(product.price)}`}>
      <div className="product-card-header">
        <span className="product-category-badge">{product.category}</span>
        <span
          className={`product-stock-badge ${
            product.inStock ? 'in-stock' : 'out-of-stock'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      <h2 className="product-name">{product.name}</h2>
      <p className="product-price" data-testid="product-price">
        {formatCurrency(product.price)}
      </p>
    </article>
  );
};
