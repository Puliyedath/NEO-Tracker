import { useState, useMemo } from "react";
import type { NEO } from "@/types/neo";

export type FilterType = "all" | "hazardous" | "safe";

export function useFilteredNeoData(data: NEO[]) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredData = useMemo(() => {
    switch (filter) {
      case "hazardous":
        return data.filter((neo) => neo.is_potentially_hazardous_asteroid);
      case "safe":
        return data.filter((neo) => !neo.is_potentially_hazardous_asteroid);
      default:
        return data;
    }
  }, [data, filter]);

  const counts = useMemo(
    () => ({
      total: data.length,
      hazardous: data.filter((neo) => neo.is_potentially_hazardous_asteroid)
        .length,
      safe: data.filter((neo) => !neo.is_potentially_hazardous_asteroid).length,
    }),
    [data]
  );

  return {
    filter,
    setFilter,
    filteredData,
    counts,
  };
}
