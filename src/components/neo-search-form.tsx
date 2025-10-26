"use client";

import { useState } from "react";

interface NEOSearchFormProps {
  onDateChange: (date: string) => void;
  initialDate?: string;
}

export function NEOSearchForm({
  onDateChange,
  initialDate,
}: NEOSearchFormProps) {
  const [date, setDate] = useState(
    initialDate || new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDateChange(date);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 px-6 py-3 bg-[#1a2332] border border-[#2a3544] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Fetch Data
        </button>
      </form>
    </div>
  );
}
