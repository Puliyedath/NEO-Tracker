// Flattened NASA Near-Earth Object Type
export interface NEO {
  // Basic Info
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;

  // Estimated Diameter - Kilometers
  estimated_diameter_kilometers_min: number;
  estimated_diameter_kilometers_max: number;

  // Estimated Diameter - Meters
  estimated_diameter_meters_min: number;
  estimated_diameter_meters_max: number;

  // Estimated Diameter - Miles
  estimated_diameter_miles_min: number;
  estimated_diameter_miles_max: number;

  // Estimated Diameter - Feet
  estimated_diameter_feet_min: number;
  estimated_diameter_feet_max: number;

  // Hazard Status
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;

  // Close Approach Data (flattened from first element)
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;

  // Relative Velocity
  relative_velocity_kilometers_per_second: string;
  relative_velocity_kilometers_per_hour: string;
  relative_velocity_miles_per_hour: string;

  // Miss Distance
  miss_distance_astronomical: string;
  miss_distance_lunar: string;
  miss_distance_kilometers: string;
  miss_distance_miles: string;

  // Orbiting Body
  orbiting_body: string;
}

// Raw API Response Types
export interface NEOApiResponse {
  links: {
    next: string;
    previous: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: RawNEO[];
  };
}

export interface RawNEO {
  links: { self: string };
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
    miles: { estimated_diameter_min: number; estimated_diameter_max: number };
    feet: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }>;
  is_sentry_object: boolean;
}

// Utility function to flatten NEO data
export function flattenNEO(raw: RawNEO): NEO {
  const closeApproach = raw.close_approach_data[0];

  return {
    id: raw.id,
    neo_reference_id: raw.neo_reference_id,
    name: raw.name,
    nasa_jpl_url: raw.nasa_jpl_url,
    absolute_magnitude_h: raw.absolute_magnitude_h,

    estimated_diameter_kilometers_min:
      raw.estimated_diameter.kilometers.estimated_diameter_min,
    estimated_diameter_kilometers_max:
      raw.estimated_diameter.kilometers.estimated_diameter_max,

    estimated_diameter_meters_min:
      raw.estimated_diameter.meters.estimated_diameter_min,
    estimated_diameter_meters_max:
      raw.estimated_diameter.meters.estimated_diameter_max,

    estimated_diameter_miles_min:
      raw.estimated_diameter.miles.estimated_diameter_min,
    estimated_diameter_miles_max:
      raw.estimated_diameter.miles.estimated_diameter_max,

    estimated_diameter_feet_min:
      raw.estimated_diameter.feet.estimated_diameter_min,
    estimated_diameter_feet_max:
      raw.estimated_diameter.feet.estimated_diameter_max,

    is_potentially_hazardous_asteroid: raw.is_potentially_hazardous_asteroid,
    is_sentry_object: raw.is_sentry_object,

    close_approach_date: closeApproach.close_approach_date,
    close_approach_date_full: closeApproach.close_approach_date_full,
    epoch_date_close_approach: closeApproach.epoch_date_close_approach,

    relative_velocity_kilometers_per_second:
      closeApproach.relative_velocity.kilometers_per_second,
    relative_velocity_kilometers_per_hour:
      closeApproach.relative_velocity.kilometers_per_hour,
    relative_velocity_miles_per_hour:
      closeApproach.relative_velocity.miles_per_hour,

    miss_distance_astronomical: closeApproach.miss_distance.astronomical,
    miss_distance_lunar: closeApproach.miss_distance.lunar,
    miss_distance_kilometers: closeApproach.miss_distance.kilometers,
    miss_distance_miles: closeApproach.miss_distance.miles,

    orbiting_body: closeApproach.orbiting_body,
  };
}
