import React from 'react';
import { CATEGORIES } from '../api/mockApi';

export type SortOption = 'none' | 'price-asc' | 'price-desc';

export interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="filter-bar" role="region" aria-label="Catalog filters and sorting">
      <div className="filter-control">
        <label htmlFor="category-select" className="filter-label">
          Category
        </label>
        <select
          id="category-select"
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-control">
        <label htmlFor="sort-select" className="filter-label">
          Sort By Price
        </label>
        <select
          id="sort-select"
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="none">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};
