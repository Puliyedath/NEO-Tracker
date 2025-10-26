import type { FilterType } from "@/hooks/useFilteredNeoData";

interface FilterButtonProps {
  type: FilterType;
  currentFilter: FilterType;
  count: number;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger" | "success";
}

export function NeoResultsFilterButton({
  type,
  currentFilter,
  count,
  label,
  onClick,
  variant = "default",
}: FilterButtonProps) {
  const isActive = currentFilter === type;

  const getVariantStyles = () => {
    if (isActive) {
      switch (variant) {
        case "danger":
          return "bg-red-600 text-white";
        case "success":
          return "bg-green-600 text-white";
        default:
          return "bg-blue-600 text-white";
      }
    }
    return "bg-[#1a2332] text-white/70 hover:text-white hover:bg-[#1a2332]/80 border border-[#2a3544]";
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getVariantStyles()}`}
    >
      {label} ({count})
    </button>
  );
}
