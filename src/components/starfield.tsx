"use client";

import { useState } from "react";

export function Starfield() {
  // Generate star positions once using lazy initialization
  const [stars] = useState(() =>
    [...Array(50)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
