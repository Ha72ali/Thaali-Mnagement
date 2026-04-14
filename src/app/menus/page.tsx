import { AppShell } from "@/components/AppShell";
import { MenusClient } from "./MenusClient";

export default function MenusPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Daily menu</h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Set dishes for a calendar day (e.g. Dal, Rice, Sabzi, Roti, Sweet).
          </p>
        </div>
        <MenusClient />
      </div>
    </AppShell>
  );
}
