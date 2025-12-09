import { Suspense } from "react";
import AdminDashboard from "./AdminDashboard/AdminDashboard";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
