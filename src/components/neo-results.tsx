"use client";

import { useState, useMemo } from "react";
import type { NEO } from "@/types/neo";
import { NEOResultPreview } from "./neo-results-preview";
import { NEOResultDetails } from "./neo-results-details";
import { NEOResultFilters } from "./neo-results-filters";
import { EmptyState } from "./empty-state";
import { NEOResultStatsCard } from "./neo-results-stats-card";
import { useFilteredNeoData } from "@/hooks/useFilteredNeoData";

interface NEOResultsProps {
  data: NEO[];
  stats: {
    totalNEOs: number;
    closestApproach: number;
    largestDiameter: number;
  };
}

export function NEOResults({ data, stats }: NEOResultsProps) {
  const [selectedNEO, setSelectedNEO] = useState<NEO | null>(data[0] || null);
  const { filter, setFilter, filteredData, counts } = useFilteredNeoData(data);

  // Update selected NEO if it's not in filtered results
  useMemo(() => {
    if (selectedNEO && !filteredData.find((neo) => neo.id === selectedNEO.id)) {
      setSelectedNEO(filteredData[0] || null);
    }
  }, [filteredData, selectedNEO]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <NEOResultStatsCard value={stats.totalNEOs} label="Total NEOs" />
        <NEOResultStatsCard
          value={`${Math.round(stats.closestApproach).toLocaleString()} km`}
          label="Closest Approach"
        />
        <NEOResultStatsCard
          value={`${stats.largestDiameter.toFixed(3)} km/s`}
          label="Largest Diameter"
        />
      </div>

      {/* Filter Controls */}
      <NEOResultFilters
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        filteredCount={filteredData.length}
      />

      {/* Main Content: Preview Cards + Details */}
      {filteredData.length === 0 ? (
        <EmptyState
          title="No NEOs Found"
          message={
            filter === "hazardous"
              ? "No potentially hazardous asteroids found for this date. That's good news!"
              : filter === "safe"
              ? "No safe asteroids found for this date."
              : "No near-Earth objects detected for this date."
          }
          icon={filter === "hazardous" ? "🛡️" : "🌌"}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* NEO Preview Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
            {filteredData.map((neo) => (
              <NEOResultPreview
                key={neo.id}
                neo={neo}
                onClick={() => setSelectedNEO(neo)}
              />
            ))}
          </div>

          {/* Selected NEO Details - Right on large screens, below on small */}
          <div className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start">
            {selectedNEO && <NEOResultDetails neo={selectedNEO} />}
          </div>
        </div>
      )}
    </div>
  );
}
