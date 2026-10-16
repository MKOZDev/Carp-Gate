"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams = "",
  onPageChange,
}) {
  const router = useRouter();

  function hrefFor(pageNum) {
    if (pageNum === 1) {
      return extraParams ? `${basePath}?${extraParams}` : basePath;
    }
    return extraParams
      ? `${basePath}?${extraParams}&page=${pageNum}`
      : `${basePath}?page=${pageNum}`;
  }

  function handleClick(e, pageNum) {
    // Ctrl/Cmd/Shift/środkowy przycisk: pozwól otworzyć w nowej karcie
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();

    if (onPageChange) {
      onPageChange(pageNum);
      return;
    }
    router.push(hrefFor(pageNum));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const arrowBase =
    "w-10 h-10 flex items-center justify-center rounded-full border border-text-secondary/30 text-text-secondary transition-colors";
  const arrowActive =
    "cursor-pointer hover:border-text-accent hover:text-text-accent";
  const arrowDisabled = "opacity-30 cursor-not-allowed";

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 mt-12"
    >
      {prevDisabled ? (
        <span aria-hidden="true" className={`${arrowBase} ${arrowDisabled}`}>
          <ChevronLeft size={18} />
        </span>
      ) : (
        <Link
          href={hrefFor(currentPage - 1)}
          rel="prev"
          aria-label="Previous page"
          onClick={(e) => handleClick(e, currentPage - 1)}
          className={`${arrowBase} ${arrowActive}`}
        >
          <ChevronLeft size={18} />
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
        const isVisible =
          pageNum === 1 ||
          pageNum === totalPages ||
          Math.abs(pageNum - currentPage) <= 1;

        const isEllipsisBefore = pageNum === 2 && currentPage > 3;
        const isEllipsisAfter =
          pageNum === totalPages - 1 && currentPage < totalPages - 2;

        if (!isVisible && !isEllipsisBefore && !isEllipsisAfter) return null;

        if (isEllipsisBefore || isEllipsisAfter) {
          return (
            <span
              key={`dots-${pageNum}`}
              className="w-10 h-10 flex items-center justify-center text-text-secondary"
            >
              ...
            </span>
          );
        }

        return (
          <Link
            key={pageNum}
            href={hrefFor(pageNum)}
            aria-current={currentPage === pageNum ? "page" : undefined}
            onClick={(e) => handleClick(e, pageNum)}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full text-sm font-medium transition-colors ${
              currentPage === pageNum
                ? "bg-text-accent text-bg-primary"
                : "border border-text-secondary/30 text-text-secondary hover:border-text-accent hover:text-text-accent"
            }`}
          >
            {pageNum}
          </Link>
        );
      })}

      {nextDisabled ? (
        <span aria-hidden="true" className={`${arrowBase} ${arrowDisabled}`}>
          <ChevronRight size={18} />
        </span>
      ) : (
        <Link
          href={hrefFor(currentPage + 1)}
          rel="next"
          aria-label="Next page"
          onClick={(e) => handleClick(e, currentPage + 1)}
          className={`${arrowBase} ${arrowActive}`}
        >
          <ChevronRight size={18} />
        </Link>
      )}
    </nav>
  );
}
