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
  const inFlightRef = useRef<boolean>(false);

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
    setError(null);
    setStatus((prevStatus) => (prevStatus === 'error' ? 'loading' : prevStatus));
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const requestId = ++latestRequestIdRef.current;
    inFlightRef.current = true;
    setStatus('loading');
    setError(null);

    searchProducts(debouncedQuery)
      .then((data) => {
        if (isCancelled || requestId !== latestRequestIdRef.current) {
          return;
        }
        inFlightRef.current = false;
        setResults(data);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (isCancelled || requestId !== latestRequestIdRef.current) {
          return;
        }
        inFlightRef.current = false;
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred while searching.';
        setError(message);
        setStatus('error');
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, retryTrigger]);

  // If the previous request errored and the user edits the input but returns to the same
  // debouncedQuery within the debounce window, re-trigger the search once debounce settles.
  useEffect(() => {
    if (query === debouncedQuery && status === 'loading' && !inFlightRef.current) {
      const timer = setTimeout(() => {
        setRetryTrigger((prev) => prev + 1);
      }, debounceMs);
      return () => clearTimeout(timer);
    }
  }, [query, debouncedQuery, status, debounceMs]);

  const retry = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  const isDebouncing = query !== debouncedQuery;

  return {
    query,
    setQuery,
    results,
    status: isDebouncing ? 'loading' : status,
    error: isDebouncing ? null : error,
    retry,
  };
}
