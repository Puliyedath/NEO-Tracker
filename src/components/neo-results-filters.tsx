import type { FilterType } from "@/hooks/useFilteredNeoData";
import { NeoResultsFilterButton } from "./neo-results-filter-button";

interface NEOResultFiltersProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  counts: {
    total: number;
    hazardous: number;
    safe: number;
  };
  filteredCount: number;
}

export function NEOResultFilters({
  filter,
  setFilter,
  counts,
  filteredCount,
}: NEOResultFiltersProps) {
  return (
    <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <span className="text-white/70 text-sm font-medium">Filter:</span>
        <div className="flex gap-2">
          <NeoResultsFilterButton
            type="all"
            currentFilter={filter}
            count={counts.total}
            label="All"
            onClick={() => setFilter("all")}
            variant="default"
          />
          <NeoResultsFilterButton
            type="hazardous"
            currentFilter={filter}
            count={counts.hazardous}
            label="⚠️ Hazardous"
            onClick={() => setFilter("hazardous")}
            variant="danger"
          />
          <NeoResultsFilterButton
            type="safe"
            currentFilter={filter}
            count={counts.safe}
            label="✓ Safe"
            onClick={() => setFilter("safe")}
            variant="success"
          />
        </div>
      </div>
      <div className="text-white/50 text-sm">
        Showing {filteredCount} NEO{filteredCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
