import React from 'react';

export interface SearchInputProps {
  query: string;
  onChange: (value: string) => void;
  statusElementId?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  query,
  onChange,
  statusElementId = 'search-status-announcement',
}) => {
  return (
    <div className="search-input-container">
      <label htmlFor="product-search-input" className="search-label">
        Search Products
      </label>
      <div className="search-input-wrapper">
        <input
          id="product-search-input"
          type="search"
          className="search-input"
          placeholder="Search by product name or category..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={statusElementId}
          autoComplete="off"
        />
        {query.length > 0 && (
          <button
            type="button"
            className="clear-search-button"
            onClick={() => onChange('')}
            aria-label="Clear search query"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
