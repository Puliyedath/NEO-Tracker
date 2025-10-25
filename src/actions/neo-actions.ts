"use server";

import { NEOApiResponse, flattenNEO, type NEO } from "@/types/neo";

export async function fetchNEOData(date: string): Promise<{
  success: boolean;
  data?: NEO[];
  error?: string;
  stats?: {
    totalNEOs: number;
    closestApproach: number;
    largestDiameter: number;
  };
}> {
  try {
    const apiKey = process.env.NASA_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "NASA API key not configured",
      };
    }

    // Create URL with encoded parameters
    const params = new URLSearchParams({
      start_date: date,
      end_date: date,
      api_key: apiKey,
    });

    const url = `https://api.nasa.gov/neo/rest/v1/feed?${params.toString()}`;

    const response = await fetch(url, {
      cache: "no-store", // Don't cache for real-time data
    });

    if (!response.ok) {
      return {
        success: false,
        error: `API request failed: ${response.status} ${response.statusText}`,
      };
    }

    const apiResponse: NEOApiResponse = await response.json();

    // Get NEOs for the specified date
    const rawNEOs = apiResponse.near_earth_objects[date] || [];

    if (rawNEOs.length === 0) {
      return {
        success: true,
        data: [],
        stats: {
          totalNEOs: 0,
          closestApproach: 0,
          largestDiameter: 0,
        },
      };
    }

    // Flatten all NEOs
    const flattenedNEOs = rawNEOs.map(flattenNEO);

    // Calculate stats
    const closestApproach = Math.min(
      ...flattenedNEOs.map((neo) => parseFloat(neo.miss_distance_kilometers))
    );

    const largestDiameter = Math.max(
      ...flattenedNEOs.map((neo) => neo.estimated_diameter_kilometers_max)
    );

    // Sort by closest approach
    const sortedNEOs = flattenedNEOs.sort(
      (a, b) =>
        parseFloat(a.miss_distance_kilometers) -
        parseFloat(b.miss_distance_kilometers)
    );

    return {
      success: true,
      data: sortedNEOs,
      stats: {
        totalNEOs: flattenedNEOs.length,
        closestApproach,
        largestDiameter,
      },
    };
  } catch (error) {
    console.error("Error fetching NEO data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
