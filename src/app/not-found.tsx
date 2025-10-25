import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="space-y-6">
        <h1 className="text-8xl font-bold text-white/90">404</h1>
        <h2 className="text-3xl font-semibold text-white/80">Lost in Space</h2>
        <p className="text-lg text-white/60 max-w-md">
          The page you&apos;re looking for has drifted into the cosmic void.
          This NEO couldn&apos;t be tracked.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Return to Earth
          </Link>
        </div>
      </div>
    </div>
  );
}
