import type { NEO } from "@/types/neo";

interface NEOResultDetailsProps {
  neo: NEO;
  onClose?: () => void;
}

export function NEOResultDetails({ neo, onClose }: NEOResultDetailsProps) {
  const formatNumber = (num: number | string, decimals: number = 2) => {
    const value = typeof num === "string" ? parseFloat(num) : num;
    return value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <div className="bg-[#1a2332] border border-[#2a3544] rounded-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white/90 mb-2">{neo.name}</h2>
          <p className="text-white/50 text-sm">
            NEO Reference ID: {neo.neo_reference_id}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>

      {/* Hazard Status Banner */}
      {neo.is_potentially_hazardous_asteroid && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-red-400 font-semibold">
                Potentially Hazardous Asteroid
              </p>
              <p className="text-red-400/70 text-sm">
                This object has been identified as potentially hazardous to
                Earth
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="space-y-6">
        {/* Basic Properties */}
        <section>
          <h3 className="text-xl font-semibold text-white/90 mb-4">
            Basic Properties
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="Absolute Magnitude"
              value={neo.absolute_magnitude_h.toString()}
            />
            <DetailItem label="Orbiting Body" value={neo.orbiting_body} />
            <DetailItem
              label="Sentry Object"
              value={neo.is_sentry_object ? "Yes" : "No"}
            />
            <DetailItem
              label="NASA JPL URL"
              value={
                <a
                  href={neo.nasa_jpl_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  View on NASA JPL
                </a>
              }
            />
          </div>
        </section>

        {/* Estimated Diameter */}
        <section>
          <h3 className="text-xl font-semibold text-white/90 mb-4">
            Estimated Diameter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="Feet"
              value={`${formatNumber(
                neo.estimated_diameter_feet_min,
                0
              )} - ${formatNumber(neo.estimated_diameter_feet_max, 0)} ft`}
            />
            <DetailItem
              label="Meters"
              value={`${formatNumber(
                neo.estimated_diameter_meters_min,
                2
              )} - ${formatNumber(neo.estimated_diameter_meters_max, 2)} m`}
            />
            <DetailItem
              label="Miles"
              value={`${formatNumber(
                neo.estimated_diameter_miles_min,
                4
              )} - ${formatNumber(neo.estimated_diameter_miles_max, 4)} mi`}
            />
            <DetailItem
              label="Kilometers"
              value={`${formatNumber(
                neo.estimated_diameter_kilometers_min,
                4
              )} - ${formatNumber(
                neo.estimated_diameter_kilometers_max,
                4
              )} km`}
            />
          </div>
        </section>

        {/* Close Approach Data */}
        <section>
          <h3 className="text-xl font-semibold text-white/90 mb-4">
            Close Approach Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Approach Date" value={neo.close_approach_date} />
            <DetailItem
              label="Full Date & Time"
              value={neo.close_approach_date_full}
            />
          </div>
        </section>

        {/* Relative Velocity */}
        <section>
          <h3 className="text-xl font-semibold text-white/90 mb-4">
            Relative Velocity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem
              label="Miles per Hour"
              value={`${formatNumber(
                neo.relative_velocity_miles_per_hour,
                0
              )} mph`}
            />
            <DetailItem
              label="Kilometers per Hour"
              value={`${formatNumber(
                neo.relative_velocity_kilometers_per_hour,
                0
              )} km/h`}
            />
            <DetailItem
              label="Kilometers per Second"
              value={`${formatNumber(
                neo.relative_velocity_kilometers_per_second,
                2
              )} km/s`}
            />
          </div>
        </section>

        {/* Miss Distance */}
        <section>
          <h3 className="text-xl font-semibold text-white/90 mb-4">
            Miss Distance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label="Miles"
              value={`${formatNumber(neo.miss_distance_miles, 0)} mi`}
            />
            <DetailItem
              label="Kilometers"
              value={`${formatNumber(neo.miss_distance_kilometers, 0)} km`}
            />
            <DetailItem
              label="Lunar Distance"
              value={`${formatNumber(neo.miss_distance_lunar, 4)} LD`}
            />
            <DetailItem
              label="Astronomical Units"
              value={`${formatNumber(neo.miss_distance_astronomical, 6)} AU`}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bg-[#0f1419] rounded-lg p-4">
      <p className="text-white/50 text-sm mb-1">{label}</p>
      <p className="text-white/90 font-medium">{value}</p>
    </div>
  );
}
