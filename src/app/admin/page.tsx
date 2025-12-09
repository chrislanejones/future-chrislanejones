import { Suspense } from "react";
import AdminDashboard from "./AdminDashboard/AdminDashboard";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-base">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-muted">Loading admin dashboard…</p>
          </div>
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}
