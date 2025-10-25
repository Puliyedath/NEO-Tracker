import type { NEO } from "@/types/neo";

interface NEOPreviewProps {
  neo: NEO;
  onClick?: () => void;
}

export function NEOPreview({ neo, onClick }: NEOPreviewProps) {
  const diameterAvg =
    (neo.estimated_diameter_feet_min + neo.estimated_diameter_feet_max) / 2;
  const velocity = parseFloat(neo.relative_velocity_miles_per_hour);
  const missDistance = parseFloat(neo.miss_distance_miles);

  return (
    <div
      onClick={onClick}
      className={`bg-[#1a2332] border border-[#2a3544] rounded-lg p-6 hover:border-blue-500 transition-all ${
        onClick ? "cursor-pointer hover:shadow-lg hover:shadow-blue-500/20" : ""
      } ${
        neo.is_potentially_hazardous_asteroid
          ? "border-l-4 border-l-red-500"
          : ""
      }`}
    >
      {/* Header with name and hazard badge */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-white/90 flex-1">
          {neo.name}
        </h3>
        {neo.is_potentially_hazardous_asteroid && (
          <span className="px-3 py-1 bg-red-900/30 border border-red-500 rounded-full text-red-400 text-xs font-medium ml-2">
            ⚠️ HAZARDOUS
          </span>
        )}
      </div>

      {/* Data grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-white/50 text-sm mb-1">Diameter</p>
          <p className="text-white/90 font-medium">
            {diameterAvg.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            ft
          </p>
        </div>

        <div>
          <p className="text-white/50 text-sm mb-1">Velocity</p>
          <p className="text-white/90 font-medium">
            {velocity.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            mph
          </p>
        </div>

        <div>
          <p className="text-white/50 text-sm mb-1">Miss Distance</p>
          <p className="text-white/90 font-medium">
            {missDistance.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            mi
          </p>
        </div>

        <div>
          <p className="text-white/50 text-sm mb-1">Status</p>
          <p
            className={`font-medium ${
              neo.is_potentially_hazardous_asteroid
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {neo.is_potentially_hazardous_asteroid ? "Hazardous" : "Safe"}
          </p>
        </div>
      </div>

      {/* Approach date */}
      <div className="mt-4 pt-4 border-t border-[#2a3544]">
        <p className="text-white/50 text-xs">
          Close Approach: {neo.close_approach_date}
        </p>
      </div>
    </div>
  );
}
