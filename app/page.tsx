"use client";

import { useState } from "react";
import Herotemp from "../src/components/Herotemp"; // keep your working import for now

export default function Home() {
  const [clicks, setClicks] = useState(0);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <Herotemp
        title="My First Next.js App 🚀"
        subtitle="Now I’m learning state and click events."
      />

      <div className="rounded-2xl border p-6">
        <p className="text-lg">
          Button clicks: <span className="font-semibold">{clicks}</span>
        </p>

        <button
          className="mt-4 rounded-xl bg-black px-4 py-2 text-white hover:opacity-90"
          onClick={() => setClicks((c) => c + 1)}
        >
          Click me
        </button>
      </div>
    </main>
  );
}
