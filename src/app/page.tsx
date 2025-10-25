"use client";

import { NEOSearchForm } from "@/components/neo-search-form";
import { NEOResults } from "@/components/neo-results";
import { useState } from "react";
import type { NEO } from "@/types/neo";

export default function Home() {
  const [neoData, setNeoData] = useState<NEO[]>([]);
  const [stats, setStats] = useState<{
    totalNEOs: number;
    closestApproach: number;
    largestDiameter: number;
  } | null>(null);

  const handleDataFetched = (
    data: NEO[],
    fetchedStats: {
      totalNEOs: number;
      closestApproach: number;
      largestDiameter: number;
    }
  ) => {
    setNeoData(data);
    setStats(fetchedStats);
  };

  return (
    <>
      <NEOSearchForm onDataFetched={handleDataFetched} />
      {stats && <NEOResults data={neoData} stats={stats} />}
    </>
  );
}
