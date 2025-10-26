interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
        {message}
      </div>
    </div>
  );
}
