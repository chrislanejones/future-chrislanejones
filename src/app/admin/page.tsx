import { Suspense } from "react";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import { Spinner } from "@/components/ui/spinner";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-base">
          <Spinner label="Loading admin dashboard…" />
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}
