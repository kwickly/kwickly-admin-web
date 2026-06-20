import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function PaginationControls({ page, totalPages, onPageChange }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 sm:px-6 mt-4 rounded-xl shadow-sm">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-700 dark:text-zinc-400">
            Showing page <span className="font-medium text-slate-900 dark:text-white">{page}</span> of{" "}
            <span className="font-medium text-slate-900 dark:text-white">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="outline"
              className="rounded-l-md rounded-r-none border-r-0"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            
            <div className="flex items-center px-4 border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-sm font-semibold text-slate-900 dark:text-zinc-100">
              {page}
            </div>

            <Button
              variant="outline"
              className="rounded-l-none rounded-r-md border-l-0"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
