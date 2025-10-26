interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

export function EmptyState({
  title = "No Results Found",
  message = "Try adjusting your filters or search criteria.",
  icon = "🔍",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center space-y-4 max-w-md">
        {/* Icon */}
        <div className="text-6xl mb-4">{icon}</div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-white/90">{title}</h3>

        {/* Message */}
        <p className="text-white/60 text-base">{message}</p>

        {/* Decorative stars */}
        <div className="flex justify-center gap-2 pt-4">
          <span className="text-white/20 text-xs">✦</span>
          <span className="text-white/30 text-sm">✦</span>
          <span className="text-white/20 text-xs">✦</span>
        </div>
      </div>
    </div>
  );
}
