"use client";

import { useCallback, useEffect, useState } from "react";
import { todayKey } from "@/lib/dates";

type Stats = {
  date: string;
  totalFamilies: number;
  deliveriesCompletedToday: number;
  pendingDeliveries: number;
};

export function DashboardClient() {
  const [date, setDate] = useState(todayKey);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/stats?date=${encodeURIComponent(date)}`, { cache: "no-store" });
      if (!r.ok) throw new Error(await r.text());
      setStats(await r.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => void load(), 15000);
    return () => clearInterval(id);
  }, [load]);

  const cards = stats
    ? [
        { label: "Total families registered", value: stats.totalFamilies, tone: "teal" as const },
        {
          label: "Deliveries completed",
          value: stats.deliveriesCompletedToday,
          tone: "emerald" as const,
        },
        { label: "Pending deliveries", value: stats.pendingDeliveries, tone: "amber" as const },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">Day</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-900 shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </label>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white shadow hover:bg-teal-800"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      )}

      {loading && !stats ? (
        <p className="text-sm text-stone-500">Loading metrics…</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <li
              key={c.label}
              className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 ${
                c.tone === "teal"
                  ? "ring-1 ring-teal-100 dark:ring-teal-900/40"
                  : c.tone === "emerald"
                    ? "ring-1 ring-emerald-100 dark:ring-emerald-900/40"
                    : "ring-1 ring-amber-100 dark:ring-amber-900/40"
              }`}
            >
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">{c.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{c.value}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
