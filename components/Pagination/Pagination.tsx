import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({ page, pageCount, onChangePage }: PaginationProps) {
  if (pageCount <= 1) return null;

  const handlePageClick = (selectedItem: { selected: number }) => {
    onChangePage(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="→"
      previousLabel="←"
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={page - 1}
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      renderOnZeroPageCount={null}
    />
  );
}
