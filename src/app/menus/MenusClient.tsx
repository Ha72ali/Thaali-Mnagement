"use client";

import { useCallback, useEffect, useState } from "react";
import { todayKey } from "@/lib/dates";

type MenuRow = { id: string; date: string; items: string };

export function MenusClient() {
  const [date, setDate] = useState(todayKey);
  const [itemsText, setItemsText] = useState("Dal, Rice, Sabzi, Roti, Sweet");
  const [current, setCurrent] = useState<MenuRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/menus?date=${encodeURIComponent(date)}`, { cache: "no-store" });
      if (!r.ok) throw new Error(await r.text());
      const menu = (await r.json()) as MenuRow | null;
      setCurrent(menu);
      if (menu?.items) {
        try {
          const arr = JSON.parse(menu.items) as string[];
          if (Array.isArray(arr)) setItemsText(arr.join(", "));
        } catch {
          setItemsText(menu.items);
        }
      } else {
        setItemsText("");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const items = itemsText
      .split(/[,•\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) {
      setError("Add at least one dish.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const r = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, items }),
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
        throw new Error((json as { error?: string }).error ?? (bodyText || "Save failed"));
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const parsedPreview = itemsText
    .split(/[,•\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="max-w-2xl space-y-6">
      <form
        onSubmit={onSave}
        className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900"
      >
        <label className="block text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">Menu date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 rounded-lg border border-stone-200 px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">Items</span>
          <span className="mt-0.5 block text-xs text-stone-500">
            Separate with commas, bullets, or new lines.
          </span>
          <textarea
            rows={4}
            value={itemsText}
            onChange={(e) => setItemsText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 font-mono text-sm dark:border-stone-700 dark:bg-stone-950"
          />
        </label>
        {error && <p className="text-sm text-red-700 dark:text-red-300">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : current ? "Update menu" : "Create menu"}
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm dark:border-stone-700"
          >
            Reload
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">Preview</h3>
        {loading ? (
          <p className="mt-2 text-sm text-stone-500">Loading…</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {parsedPreview.map((item) => (
              <li
                key={item}
                className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-900 dark:bg-teal-950/50 dark:text-teal-100"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
