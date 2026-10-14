"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
// Shown by the admin layout when a signed-in Clerk user is not on the owner
// allowlist. The Convex functions reject them anyway; this keeps the dashboard
// shell from rendering at all.
export default function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base p-6">
      <div className="max-w-md w-full flex flex-col items-center gap-4 text-center">
        <ShieldAlert className="w-10 h-10 text-accent" aria-hidden="true" />
        <h1 className="text-2xl font-semibold text-ink">Access denied</h1>
        <p className="text-muted">
          This account isn&apos;t allowed to use the admin dashboard. If you
          signed in with the wrong account, sign out and try again.
        </p>
        <div className="flex gap-3">
          <SignOutButton redirectUrl="/">
            <Button variant="primary" className="font-medium">
              Sign out
            </Button>
          </SignOutButton>
          <Link
            href="/"
            className="px-4 py-2 rounded-md border border-current text-ink"
          >
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
