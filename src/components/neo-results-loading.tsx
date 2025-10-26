export function NeoResultsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <div className="bg-[#0a1120] border border-[#1a2332] rounded-xl p-8">
        {/* Loading Header */}
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-[#1a2332] rounded w-48 mb-4"></div>
          <div className="h-4 bg-[#1a2332] rounded w-64"></div>
        </div>

        {/* Loading Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#1a2332] border border-[#2a3544] rounded-lg p-6 animate-pulse"
            >
              <div className="h-4 bg-[#2a3544] rounded w-24 mb-3"></div>
              <div className="h-8 bg-[#2a3544] rounded w-32"></div>
            </div>
          ))}
        </div>

        {/* Loading Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-[#1a2332] border border-[#2a3544] rounded-lg p-6 animate-pulse"
            >
              <div className="h-6 bg-[#2a3544] rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-[#2a3544] rounded w-full"></div>
                <div className="h-4 bg-[#2a3544] rounded w-5/6"></div>
                <div className="h-4 bg-[#2a3544] rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center mt-8">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <span className="ml-4 text-blue-400 text-lg">
            Loading NEO data...
          </span>
        </div>
      </div>
    </div>
  );
}
