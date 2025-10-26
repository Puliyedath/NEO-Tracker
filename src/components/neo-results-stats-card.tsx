import { memo } from "react";

interface NEOResultStatsCardProps {
  value: string | number;
  label: string;
}

export const NEOResultStatsCard = memo(function NEOResultStatsCard({
  value,
  label,
}: NEOResultStatsCardProps) {
  return (
    <div className="bg-[#0f1722] border border-[#1a2332] rounded-lg p-6 text-center">
      <div className="text-4xl font-bold text-white mb-2">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
});
