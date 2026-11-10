import React, { useMemo, useState } from 'react';
import { FilterBar, SortOption } from './components/FilterBar';
import { ProductList } from './components/ProductList';
import { SearchInput } from './components/SearchInput';
import { useProductSearch } from './hooks/useProductSearch';

export const App: React.FC = () => {
  const { query, setQuery, results: rawResults, status, error, retry } = useProductSearch('', 300);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('none');

  const visibleProducts = useMemo(() => {
    return rawResults
      .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [rawResults, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSortBy('none');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Product Catalog Search</h1>
        <p className="app-subtitle">
          Fast, resilient search with client-side filtering and full keyboard accessibility.
        </p>
      </header>

      <main className="app-main">
        <div className="controls-panel">
          <SearchInput query={query} onChange={setQuery} />
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        <ProductList
          products={visibleProducts}
          status={status}
          error={error}
          query={query}
          selectedCategory={selectedCategory}
          onRetry={retry}
          onResetFilters={handleResetFilters}
        />
      </main>
    </div>
  );
};

export default App;
