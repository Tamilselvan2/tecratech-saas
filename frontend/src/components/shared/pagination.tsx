import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalRecords: number;
  limit: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onLimitChange?: (limit: number) => void;
  limits?: number[];
}

export function Pagination({
  currentPage,
  totalRecords,
  limit,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onLimitChange,
  limits = [10, 20, 50, 100],
}: PaginationProps) {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalRecords);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-muted/30 border-t border-border rounded-b-2xl gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <p className="text-sm text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{totalRecords > 0 ? startItem : 0}</span>–<span className="font-bold text-foreground">{endItem}</span> of <span className="font-bold text-foreground">{totalRecords}</span>
        </p>

        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="text-xs font-bold bg-card text-foreground px-2.5 py-1.5 rounded-lg border border-border cursor-pointer focus:ring-2 focus:ring-primary/50 transition-colors outline-none"
            >
              {limits.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <p className="text-sm text-muted-foreground hidden sm:block mr-2">
          Page <span className="font-bold text-foreground">{currentPage}</span>
        </p>
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Next page"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
