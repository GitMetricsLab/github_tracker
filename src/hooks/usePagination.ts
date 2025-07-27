import { useState } from 'react';

export const usePagination = (rowsPerPage = 10) => {
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginateData = (data) => {
    return data.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);
  };

  return {
    page,
    itemsPerPage,
    handleChangePage,
    paginateData,
  };
};