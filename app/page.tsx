"use client";

import { useEffect, useState } from "react";
import Herotemp from "@/components/Herotemp";

export default function Home() {
  const [clicks, setClicks] = useState(0);

  // Load saved value on first render (browser only)
  useEffect(() => {
    const saved = localStorage.getItem("clicks");
    if (saved) setClicks(Number(saved));
  }, []);

  // Save whenever clicks changes
  useEffect(() => {
    localStorage.setItem("clicks", String(clicks));
  }, [clicks]);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <Herotemp
        title="My First Next.js App 🚀"
        subtitle="Now my counter persists even after refresh."
      />

      <div className="rounded-2xl border p-6">
        <p className="text-lg">
          Button clicks: <span className="font-semibold">{clicks}</span>
        </p>

        <div className="mt-4 flex gap-3">
          <button
            className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90"
            onClick={() => setClicks((c) => c + 1)}
          >
            Click me
          </button>

          <button
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
            onClick={() => setClicks(0)}
          >
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}
