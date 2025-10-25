"use client";

import { useState, useMemo } from "react";
import type { NEO } from "@/types/neo";
import { NEOPreview } from "./neo-preview";
import { NEODetails } from "./neo-details";
import { NEOFilters } from "./neo-filters";
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
        <div className="bg-[#0f1722] border border-[#1a2332] rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {stats.totalNEOs}
          </div>
          <div className="text-gray-400 text-sm">Total NEOs</div>
        </div>

        <div className="bg-[#0f1722] border border-[#1a2332] rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {Math.round(stats.closestApproach).toLocaleString()} km
          </div>
          <div className="text-gray-400 text-sm">Closest Approach</div>
        </div>

        <div className="bg-[#0f1722] border border-[#1a2332] rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {stats.largestDiameter.toFixed(3)} km/s
          </div>
          <div className="text-gray-400 text-sm">Largest Diameter</div>
        </div>
      </div>

      {/* Filter Controls */}
      <NEOFilters
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        filteredCount={filteredData.length}
      />

      {/* Main Content: Preview Cards + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NEO Preview Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
          {filteredData.map((neo) => (
            <NEOPreview
              key={neo.id}
              neo={neo}
              onClick={() => setSelectedNEO(neo)}
            />
          ))}
        </div>

        {/* Selected NEO Details - Right on large screens, below on small */}
        <div className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start">
          {selectedNEO && <NEODetails neo={selectedNEO} />}
        </div>
      </div>
    </div>
  );
}
