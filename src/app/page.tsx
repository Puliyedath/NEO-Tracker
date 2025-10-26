"use client";

import { NEOSearchForm } from "@/components/neo-search-form";
import { NEOResultsContainer } from "@/components/neo-results-container";
import { useState } from "react";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <>
      <NEOSearchForm onDateChange={setSelectedDate} />
      {selectedDate && <NEOResultsContainer date={selectedDate} />}
    </>
  );
}
