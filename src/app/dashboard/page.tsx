import { AppShell } from "@/components/AppShell";
import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Live counts for the selected day. Defaults to today.
          </p>
        </div>
        <DashboardClient />
      </div>
    </AppShell>
  );
}
