import { AppShell } from "@/components/AppShell";
import { FamiliesClient } from "./FamiliesClient";

export default function FamiliesPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Families</h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Register families for daily Thaali delivery.
          </p>
        </div>
        <FamiliesClient />
      </div>
    </AppShell>
  );
}
