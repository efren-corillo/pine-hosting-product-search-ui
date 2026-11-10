import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import * as mockApi from '../src/api/mockApi';
import { Product } from '../src/api/mockApi';

const mockCatalog: Product[] = [
  {
    id: '1',
    name: 'Wireless Keyboard',
    category: 'Electronics',
    price: 8999,
    inStock: true,
  },
  {
    id: '2',
    name: 'Dotted Notebook',
    category: 'Stationery',
    price: 1200,
    inStock: true,
  },
  {
    id: '3',
    name: 'Gel Pen Set',
    category: 'Stationery',
    price: 500,
    inStock: true,
  },
];

describe('App Component Integration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('filters by category and sorts by price client-side without extra API calls', async () => {
    const searchSpy = vi.spyOn(mockApi, 'searchProducts').mockResolvedValue(mockCatalog);

    render(<App />);

    // Wait for initial catalog to load
    await waitFor(() => {
      expect(screen.getByText('Wireless Keyboard')).toBeInTheDocument();
    });
    expect(searchSpy).toHaveBeenCalledTimes(1);

    // Filter by Stationery category
    const categorySelect = screen.getByLabelText(/Category/i);
    fireEvent.change(categorySelect, { target: { value: 'Stationery' } });

    expect(screen.queryByText('Wireless Keyboard')).not.toBeInTheDocument();
    expect(screen.getByText('Dotted Notebook')).toBeInTheDocument();
    expect(screen.getByText('Gel Pen Set')).toBeInTheDocument();

    // Sort by Price: Low to High
    const sortSelect = screen.getByLabelText(/Sort By Price/i);
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

    const listItems = screen.getAllByRole('listitem');
    expect(within(listItems[0]).getByText('Gel Pen Set')).toBeInTheDocument();
    expect(within(listItems[0]).getByTestId('product-price')).toHaveTextContent('$5.00');
    expect(within(listItems[1]).getByText('Dotted Notebook')).toBeInTheDocument();
    expect(within(listItems[1]).getByTestId('product-price')).toHaveTextContent('$12.00');

    // Sort by Price: High to Low
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
    const reorderedItems = screen.getAllByRole('listitem');
    expect(within(reorderedItems[0]).getByText('Dotted Notebook')).toBeInTheDocument();
    expect(within(reorderedItems[1]).getByText('Gel Pen Set')).toBeInTheDocument();

    // Client-side filtering & sorting MUST NOT trigger additional API requests
    expect(searchSpy).toHaveBeenCalledTimes(1);
  });

  it('displays the error UI when the API fails and recovers when Retry Search is clicked', async () => {
    const searchSpy = vi
      .spyOn(mockApi, 'searchProducts')
      .mockRejectedValueOnce(new Error('Network error: Failed to fetch products.'))
      .mockResolvedValueOnce(mockCatalog);

    render(<App />);

    const errorView = await screen.findByTestId('error-view');
    expect(errorView).toBeInTheDocument();
    expect(within(errorView).getByText(/Network error: Failed to fetch products/i)).toBeInTheDocument();

    const retryButton = within(errorView).getByRole('button', { name: /Retry Search/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Wireless Keyboard')).toBeInTheDocument();
    });
    expect(searchSpy).toHaveBeenCalledTimes(2);
  });

  it('supports keyboard focus navigation and ARIA live region announcements', async () => {
    vi.spyOn(mockApi, 'searchProducts').mockResolvedValue(mockCatalog);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Wireless Keyboard')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(/Search Products/i);
    const categorySelect = screen.getByLabelText(/Category/i);
    const sortSelect = screen.getByLabelText(/Sort By Price/i);

    searchInput.focus();
    expect(searchInput).toHaveFocus();

    categorySelect.focus();
    expect(categorySelect).toHaveFocus();

    sortSelect.focus();
    expect(sortSelect).toHaveFocus();

    const liveRegion = document.getElementById('search-status-announcement');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveTextContent('Showing 3 products.');
  });

  it('renders an empty state when no products match the selected category and supports resetting filters', async () => {
    vi.spyOn(mockApi, 'searchProducts').mockResolvedValue(mockCatalog);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Wireless Keyboard')).toBeInTheDocument();
    });

    const categorySelect = screen.getByLabelText(/Category/i);
    fireEvent.change(categorySelect, { target: { value: 'Accessories' } });

    expect(screen.getByTestId('empty-view')).toBeInTheDocument();

    const resetButton = screen.getByRole('button', { name: /Reset Search & Filters/i });
    fireEvent.click(resetButton);

    expect(screen.getByText('Wireless Keyboard')).toBeInTheDocument();
  });
});
