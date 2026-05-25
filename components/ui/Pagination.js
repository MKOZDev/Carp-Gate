"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams = "",
}) {
  const router = useRouter();

  function goToPage(pageNum) {
    const base = extraParams
      ? `${basePath}?${extraParams}&page=${pageNum}`
      : `${basePath}?page=${pageNum}`;
    const url =
      pageNum === 1
        ? extraParams
          ? `${basePath}?${extraParams}`
          : basePath
        : base;
    router.push(url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border border-text-secondary/30 text-text-secondary hover:border-text-accent hover:text-text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

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
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full text-sm font-medium transition-colors ${
              currentPage === pageNum
                ? "bg-text-accent text-bg-primary"
                : "border border-text-secondary/30 text-text-secondary hover:border-text-accent hover:text-text-accent"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-full border border-text-secondary/30 text-text-secondary hover:border-text-accent hover:text-text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
