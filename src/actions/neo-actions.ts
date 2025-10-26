"use server";

import { z } from "zod";
import { NEOApiResponse, flattenNEO, type NEO } from "@/types/neo";
import { withCache, ttlGenerators } from "@/lib/cache-decorator";

/**
 * Zod Date validation schema
 */
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    },
    { message: "Invalid date" }
  )
  .refine(
    (date) => {
      const parsedDate = new Date(date);
      const minDate = new Date("1995-01-01"); // start date that we want to support
      const maxDate = new Date();
      maxDate.setHours(23, 59, 59, 999); // End of today
      return parsedDate >= minDate && parsedDate <= maxDate;
    },
    {
      message: "Date must be between 1995-01-01 and today",
    }
  );

/**
 * Internal function that fetches NEO data from NASA API
 * This is the base function that will be wrapped with caching
 */
async function fetchNEODataInternal(date: string): Promise<{
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
    // Validate date format and range
    const dateValidation = dateSchema.safeParse(date);
    if (!dateValidation.success) {
      return {
        success: false,
        error: dateValidation.error.issues[0].message,
      };
    }

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

/**
 * Fetch NEO data with caching
 * Uses read-through cache pattern with dynamic TTL based on date
 */
export const fetchNEOData = withCache(fetchNEODataInternal, {
  prefix: "neo",
  keyGenerator: (date) => date as string,
  ttlGenerator: (date) => ttlGenerators.dateBasedTTL(date as string),
  shouldCache: (result) => result.success, // Only cache successful results
});
