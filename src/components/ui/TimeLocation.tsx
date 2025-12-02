"use client";

import { useState, useEffect } from "react";

export function TimeLocation() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-8 left-8 z-50 flex flex-col gap-1 font-sans text-xs font-medium tracking-wide text-white">
      <div className="flex items-center gap-2">
        <span>NEW YORK CITY</span>
      </div>
      <div className="text-mantis-gray">41° Overcast</div>
      <div className="mt-2 text-sm font-bold tracking-wider">{time}</div>
      <div className="text-[10px] text-mantis-gray">40.7128° N, 74.0060° W</div>
    </div>
  );
}
