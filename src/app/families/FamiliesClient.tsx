"use client";

import { useCallback, useEffect, useState } from "react";

type Family = {
  id: string;
  name: string;
  address: string;
  phone: string;
  memberCount: number;
};

export function FamiliesClient() {
  const [list, setList] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [memberCount, setMemberCount] = useState(4);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/families", { cache: "no-store" });
      if (!r.ok) throw new Error(await r.text());
      setList(await r.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const r = await fetch("/api/families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address, phone, memberCount }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? (await r.text()));
      }
      setName("");
      setAddress("");
      setPhone("");
      setMemberCount(4);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900"
      >
        <h3 className="text-lg font-medium">Add family</h3>
        {error && (
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        )}
        <label className="block text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">Family name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">Address</span>
          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">Phone</span>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">Number of members</span>
          <input
            required
            type="number"
            min={1}
            value={memberCount}
            onChange={(e) => setMemberCount(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-teal-700 py-2.5 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Add family"}
        </button>
      </form>

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="border-b border-stone-200 px-4 py-3 dark:border-stone-800">
          <h3 className="font-medium">Registered families</h3>
          <p className="text-xs text-stone-500">{loading ? "Loading…" : `${list.length} total`}</p>
        </div>
        <ul className="max-h-[480px] divide-y divide-stone-100 overflow-auto dark:divide-stone-800">
          {list.map((f) => (
            <li key={f.id} className="px-4 py-3">
              <p className="font-medium">{f.name}</p>
              <p className="text-sm text-stone-600 dark:text-stone-400">{f.address}</p>
              <p className="mt-1 text-xs text-stone-500">
                {f.phone} · {f.memberCount} members
              </p>
            </li>
          ))}
          {!loading && list.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-stone-500">No families yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
