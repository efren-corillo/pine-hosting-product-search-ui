import React from 'react';

export const LoadingView: React.FC = () => {
  return (
    <div className="status-view loading-view" role="status" aria-busy="true" data-testid="loading-view">
      <div className="spinner" aria-hidden="true" />
      <p className="status-title">Searching products...</p>
      <div className="skeleton-grid" aria-hidden="true">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="skeleton-card" />
        ))}
      </div>
    </div>
  );
};

export interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry }) => {
  return (
    <div className="status-view error-view" role="alert" data-testid="error-view">
      <h2 className="status-title">Unable to Load Products</h2>
      <p className="status-message">{message}</p>
      <button type="button" className="retry-button" onClick={onRetry}>
        Retry Search
      </button>
    </div>
  );
};

export interface EmptyViewProps {
  query: string;
  selectedCategory: string;
  onResetFilters?: () => void;
}

export const EmptyView: React.FC<EmptyViewProps> = ({
  query,
  selectedCategory,
  onResetFilters,
}) => {
  const hasFilters = query.trim().length > 0 || selectedCategory !== 'All';

  return (
    <div className="status-view empty-view" data-testid="empty-view">
      <h2 className="status-title">No products found</h2>
      <p className="status-message">
        {query.trim()
          ? `No products matched "${query}"${
              selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''
            }.`
          : `No products available in ${selectedCategory}.`}
      </p>
      {hasFilters && onResetFilters && (
        <button type="button" className="reset-button" onClick={onResetFilters}>
          Reset Search & Filters
        </button>
      )}
    </div>
  );
};
