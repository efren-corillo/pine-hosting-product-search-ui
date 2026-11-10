import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as mockApi from '../src/api/mockApi';
import { Product } from '../src/api/mockApi';
import { useProductSearch } from '../src/hooks/useProductSearch';

const productA: Product = {
  id: 'a-1',
  name: 'Alpha Keyboard',
  category: 'Electronics',
  price: 8000,
  inStock: true,
};

const productB: Product = {
  id: 'b-1',
  name: 'Beta Mouse',
  category: 'Electronics',
  price: 4500,
  inStock: true,
};

describe('useProductSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('debounces rapid query updates and only calls searchProducts once after 300ms', async () => {
    const searchSpy = vi.spyOn(mockApi, 'searchProducts').mockResolvedValue([productA]);

    const { result } = renderHook(() => useProductSearch('', 300));

    // Initial mount call for ""
    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(searchSpy).toHaveBeenLastCalledWith('');

    // Rapid keystrokes within the 300ms window
    act(() => {
      result.current.setQuery('k');
    });
    act(() => {
      vi.advanceTimersByTime(100);
      result.current.setQuery('ke');
    });
    act(() => {
      vi.advanceTimersByTime(100);
      result.current.setQuery('key');
    });

    // Still hasn't dispatched a new call before 300ms after the last keystroke
    expect(searchSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(searchSpy).toHaveBeenCalledTimes(2);
    expect(searchSpy).toHaveBeenLastCalledWith('key');
    expect(result.current.status).toBe('success');
    expect(result.current.results).toEqual([productA]);
  });

  it('prevents race conditions by discarding slower out-of-order responses (Query A 800ms vs Query B 100ms)', async () => {
    const searchSpy = vi.spyOn(mockApi, 'searchProducts').mockImplementation((query: string) => {
      if (query === 'Query A') {
        return new Promise<Product[]>((resolve) => {
          setTimeout(() => resolve([productA]), 800);
        });
      }
      if (query === 'Query B') {
        return new Promise<Product[]>((resolve) => {
          setTimeout(() => resolve([productB]), 100);
        });
      }
      return Promise.resolve([]);
    });

    const { result } = renderHook(() => useProductSearch('', 300));

    // Flush initial mount request
    await act(async () => {
      await Promise.resolve();
    });

    // Dispatch Query A (slow: 800ms)
    act(() => {
      result.current.setQuery('Query A');
    });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(searchSpy).toHaveBeenLastCalledWith('Query A');

    // Dispatch Query B (fast: 100ms) while Query A is still in flight
    act(() => {
      result.current.setQuery('Query B');
    });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(searchSpy).toHaveBeenLastCalledWith('Query B');

    // Resolve Query B after 100ms
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.status).toBe('success');
    expect(result.current.results).toEqual([productB]);

    // Advance remaining time so Query A resolves (800ms total)
    await act(async () => {
      vi.advanceTimersByTime(700);
    });

    // Query B's fresher result MUST remain intact; Query A's stale payload is ignored
    expect(result.current.status).toBe('success');
    expect(result.current.results).toEqual([productB]);
  });

  it('captures API errors and recovers when retry() is called', async () => {
    const searchSpy = vi
      .spyOn(mockApi, 'searchProducts')
      .mockRejectedValueOnce(new Error('Simulated 10% network failure'))
      .mockResolvedValueOnce([productA]);

    const { result } = renderHook(() => useProductSearch('', 300));

    // Flush initial failing request
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Simulated 10% network failure');

    // Trigger retry()
    await act(async () => {
      result.current.retry();
    });

    expect(searchSpy).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('success');
    expect(result.current.error).toBeNull();
    expect(result.current.results).toEqual([productA]);
  });

  it('does not drop in-flight results when the user types and backspaces back to the same query within 300ms', async () => {
    const searchSpy = vi.spyOn(mockApi, 'searchProducts').mockImplementation((query: string) => {
      if (query === 'wire') {
        return new Promise<Product[]>((resolve) => {
          setTimeout(() => resolve([productA]), 500);
        });
      }
      return Promise.resolve([]);
    });

    const { result } = renderHook(() => useProductSearch('', 300));

    // Flush initial mount request
    await act(async () => {
      await Promise.resolve();
    });

    // Type 'wire' and wait 300ms so the request for 'wire' (500ms latency) is dispatched
    act(() => {
      result.current.setQuery('wire');
    });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(searchSpy).toHaveBeenLastCalledWith('wire');

    // While 'wire' is in-flight, user types 'wires' and backspaces to 'wire' within 300ms
    act(() => {
      vi.advanceTimersByTime(100);
      result.current.setQuery('wires');
    });
    act(() => {
      vi.advanceTimersByTime(100);
      result.current.setQuery('wire');
    });

    // Advance remaining 300ms so the in-flight 'wire' request finishes
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.status).toBe('success');
    expect(result.current.results).toEqual([productA]);
  });

  it('reports loading status during the debounce window so stale empty results are not shown mid-typing', async () => {
    vi.spyOn(mockApi, 'searchProducts').mockImplementation((query: string) => {
      if (query === 'wire') {
        return Promise.resolve([productA]);
      }
      return Promise.resolve([]);
    });

    const { result } = renderHook(() => useProductSearch('nomatch', 300));

    // Flush initial 'nomatch' request which resolves to []
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.status).toBe('success');
    expect(result.current.results).toEqual([]);

    // User starts typing 'wire' — during the 300ms debounce window status must be 'loading'
    act(() => {
      result.current.setQuery('wire');
    });
    expect(result.current.status).toBe('loading');

    // Once 300ms debounce elapses, 'wire' resolves with [productA]
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.status).toBe('success');
    expect(result.current.results).toEqual([productA]);
  });
});
