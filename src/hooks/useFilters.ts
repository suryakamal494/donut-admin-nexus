import { useState, useMemo, useCallback } from 'react';

interface UseFiltersOptions<T> {
  data: T[];
  searchFields?: (keyof T)[];
  initialFilters?: Record<string, string>;
}

interface UseFiltersReturn<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  filteredData: T[];
  activeFilterCount: number;
}

/**
 * Generic hook for handling search and filter state
 * Reduces boilerplate across list/table pages
 */
export function useFilters<T extends Record<string, any>>({
  data,
  searchFields = [],
  initialFilters = {},
}: UseFiltersOptions<T>): UseFiltersReturn<T> {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilters(initialFilters);
  }, [initialFilters]);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery.trim() && searchFields.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => String(item[key]) === value);
      }
    });

    return result;
  }, [data, searchQuery, searchFields, filters]);

  const activeFilterCount = useMemo(() => {
    let count = searchQuery.trim() ? 1 : 0;
    count += Object.values(filters).filter(v => v && v !== 'all').length;
    return count;
  }, [searchQuery, filters]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearFilters,
    filteredData,
    activeFilterCount,
  };
}

export default useFilters;
