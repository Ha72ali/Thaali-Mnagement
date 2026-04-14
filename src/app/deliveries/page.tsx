import { AppShell } from "@/components/AppShell";
import { DeliveriesClient } from "./DeliveriesClient";

export default function DeliveriesPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Delivery tracking</h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            All families for the selected day. Mark each Thaali as delivered or not delivered.
          </p>
        </div>
        <DeliveriesClient />
      </div>
    </AppShell>
  );
}
