import React from 'react';
import { Product } from '../api/mockApi';
import { SearchStatus } from '../hooks/useProductSearch';
import { ProductCard } from './ProductCard';
import { EmptyView, ErrorView, LoadingView } from './StatusViews';

export interface ProductListProps {
  products: Product[];
  status: SearchStatus;
  error: string | null;
  query: string;
  selectedCategory: string;
  onRetry: () => void;
  onResetFilters?: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  status,
  error,
  query,
  selectedCategory,
  onRetry,
  onResetFilters,
}) => {
  const getAnnouncement = (): string => {
    if (status === 'loading') {
      return 'Loading products...';
    }
    if (status === 'error') {
      return `Error loading products: ${error ?? 'Unknown error'}`;
    }
    if (status === 'success') {
      return `Showing ${products.length} ${products.length === 1 ? 'product' : 'products'}.`;
    }
    return '';
  };

  return (
    <section className="product-list-section" aria-label="Search Results">
      <div
        id="search-status-announcement"
        className="status-bar"
        aria-live="polite"
        aria-atomic="true"
      >
        {getAnnouncement()}
      </div>

      {status === 'loading' && <LoadingView />}

      {status === 'error' && (
        <ErrorView
          message={error ?? 'Failed to fetch products. Please try again.'}
          onRetry={onRetry}
        />
      )}

      {status === 'success' && products.length === 0 && (
        <EmptyView
          query={query}
          selectedCategory={selectedCategory}
          onResetFilters={onResetFilters}
        />
      )}

      {status === 'success' && products.length > 0 && (
        <ul className="product-grid" role="list">
          {products.map((product) => (
            <li key={product.id} className="product-grid-item">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
