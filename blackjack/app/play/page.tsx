"use client";

import BlackjackTable from "@/components/game/BlackjackTable";

export default function Play() {
  return (
    <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl">
        <BlackjackTable />
      </div>
    </div>
  );
}
