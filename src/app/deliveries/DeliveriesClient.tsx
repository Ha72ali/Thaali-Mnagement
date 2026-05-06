"use client";

import { useCallback, useEffect, useState } from "react";
import { todayKey } from "@/lib/dates";

type Family = {
  id: string;
  name: string;
  address: string;
  phone: string;
  memberCount: number;
};

type Row = { family: Family; status: "PENDING" | "DELIVERED" | "NOT_DELIVERED" };

export function DeliveriesClient() {
  const [date, setDate] = useState(todayKey);
  const [list, setList] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/deliveries?date=${encodeURIComponent(date)}`, { cache: "no-store" });
      if (!r.ok) throw new Error(await r.text());
      const data = (await r.json()) as { list: Row[] };
      setList(data.list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(familyId: string, status: Row["status"]) {
    setUpdating(familyId);
    setError(null);
    try {
      const r = await fetch("/api/deliveries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyId, date, status }),
      });
      if (!r.ok) {
        const bodyText = await r.text();
        const json = (() => {
          try {
            return JSON.parse(bodyText);
          } catch {
            return {};
          }
        })();
        throw new Error((json as { error?: string }).error ?? (bodyText || "Update failed"));
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">Delivery day</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
          />
        </label>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm dark:border-stone-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        {loading ? (
          <p className="p-6 text-sm text-stone-500">Loading families…</p>
        ) : list.length === 0 ? (
          <p className="p-6 text-sm text-stone-500">
            No families registered yet. Add families first.
          </p>
        ) : (
          <ul className="divide-y divide-stone-100 dark:divide-stone-800">
            {list.map(({ family, status }) => (
              <li key={family.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{family.name}</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">{family.address}</p>
                  <p className="text-xs text-stone-500">
                    {family.phone} · {family.memberCount} members
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      status === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
                        : status === "NOT_DELIVERED"
                          ? "bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-200"
                          : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200"
                    }`}
                  >
                    {status === "DELIVERED"
                      ? "Delivered ✓"
                      : status === "NOT_DELIVERED"
                        ? "Not delivered"
                        : "Pending"}
                  </span>
                  <button
                    type="button"
                    disabled={updating === family.id}
                    onClick={() => void setStatus(family.id, "DELIVERED")}
                    className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                  >
                    Delivered
                  </button>
                  <button
                    type="button"
                    disabled={updating === family.id}
                    onClick={() => void setStatus(family.id, "NOT_DELIVERED")}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-900 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100 disabled:opacity-50"
                  >
                    Not delivered
                  </button>
                  <button
                    type="button"
                    disabled={updating === family.id}
                    onClick={() => void setStatus(family.id, "PENDING")}
                    className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs dark:border-stone-700 disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
