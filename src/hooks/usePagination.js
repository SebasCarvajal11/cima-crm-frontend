import { useState, useMemo } from 'react';
import { PAGINATION } from '../constants';

export function usePagination(items = [], pageSize = PAGINATION.DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(items.length / pageSize),
    [items.length, pageSize]
  );

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const resetPage = () => setPage(1);

  return {
    page,
    setPage: handlePageChange,
    totalPages,
    paginatedItems,
    totalCount: items.length,
    currentCount: paginatedItems.length,
    resetPage,
  };
}
