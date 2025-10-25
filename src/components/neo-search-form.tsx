"use client";

import { fetchNEOData } from "@/actions/neo-actions";
import { useState, useTransition } from "react";
import type { NEO } from "@/types/neo";

interface NEOSearchFormProps {
  onDataFetched: (
    data: NEO[],
    stats: {
      totalNEOs: number;
      closestApproach: number;
      largestDiameter: number;
    }
  ) => void;
}

export function NEOSearchForm({ onDataFetched }: NEOSearchFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await fetchNEOData(date);

      if (result.success && result.data && result.stats) {
        onDataFetched(result.data, result.stats);
      } else {
        setError(result.error || "Failed to fetch data");
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex gap-4 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 px-6 py-3 bg-[#1a2332] border border-[#2a3544] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isPending ? "Loading..." : "Fetch Data"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
