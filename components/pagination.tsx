import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  baseHref: string;
};

export function Pagination({ page, totalPages, baseHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link
          href={page === 2 ? baseHref : `${baseHref}?page=${page - 1}`}
          className="pagination-link pagination-prev"
        >
          Previous
        </Link>
      ) : (
        <span className="pagination-link pagination-prev disabled">Previous</span>
      )}
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={`${baseHref}?page=${page + 1}`}
          className="pagination-link pagination-next"
        >
          Next
        </Link>
      ) : (
        <span className="pagination-link pagination-next disabled">Next</span>
      )}
    </nav>
  );
}
