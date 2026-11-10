import { useCallback, useEffect, useRef, useState } from 'react';
import { Product, searchProducts } from '../api/mockApi';
import { useDebounce } from './useDebounce';

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseProductSearchReturn {
  query: string;
  setQuery: (newQuery: string) => void;
  results: Product[];
  status: SearchStatus;
  error: string | null;
  retry: () => void;
}

/**
 * Custom hook managing debounced product searches with out-of-order race condition protection
 * and explicit error retry recovery.
 */
export function useProductSearch(
  initialQuery: string = '',
  debounceMs: number = 300
): UseProductSearchReturn {
  const [query, setQueryState] = useState<string>(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [status, setStatus] = useState<SearchStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);

  const debouncedQuery = useDebounce(query, debounceMs);
  const latestRequestIdRef = useRef<number>(0);

  const setQuery = useCallback((newQuery: string) => {
    // Invalidate any in-flight request immediately when the user modifies the search input
    latestRequestIdRef.current += 1;
    setQueryState(newQuery);
  }, []);

  useEffect(() => {
    const requestId = ++latestRequestIdRef.current;
    setStatus('loading');
    setError(null);

    searchProducts(debouncedQuery)
      .then((data) => {
        if (requestId !== latestRequestIdRef.current) {
          return;
        }
        setResults(data);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (requestId !== latestRequestIdRef.current) {
          return;
        }
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred while searching.';
        setError(message);
        setStatus('error');
      });
  }, [debouncedQuery, retryTrigger]);

  const retry = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  return {
    query,
    setQuery,
    results,
    status,
    error,
    retry,
  };
}
