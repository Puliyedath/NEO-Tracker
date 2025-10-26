"use client";

import { useState, useEffect, useTransition } from "react";
import type { NEO } from "@/types/neo";
import { fetchNEOData } from "@/actions/neo-actions";
import { NEOResults } from "./neo-results";
import { NeoResultsLoading } from "./neo-results-loading";
import { ErrorState } from "./error-state";

interface NEOResultsContainerProps {
  date: string;
}

interface Stats {
  totalNEOs: number;
  closestApproach: number;
  largestDiameter: number;
}

export function NEOResultsContainer({ date }: NEOResultsContainerProps) {
  const [data, setData] = useState<NEO[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!date) return;

    startTransition(async () => {
      setError(null);
      const result = await fetchNEOData(date);

      if (result.success && result.data && result.stats) {
        setData(result.data);
        setStats(result.stats);
      } else {
        setError(result.error || "Failed to fetch NEO data");
        setData([]);
        setStats(null);
      }
    });
  }, [date]);

  if (isPending) {
    return <NeoResultsLoading />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!stats) {
    return null;
  }

  return <NEOResults data={data} stats={stats} />;
}
