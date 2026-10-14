import { auth } from "@clerk/nextjs/server";
import { ConvexAdminProvider } from "@/providers/ConvexAdminProvider";
import { isSiteOwner } from "@/lib/owner-policy";
import AccessDenied from "./AccessDenied";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage portfolio content and SEO",
};

// Middleware only requires a signed-in user, and Clerk sign-ups are open. Check
// the owner allowlist here, on the server, before any dashboard code renders.
// Convex functions still enforce the same allowlist on every call.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const owner = isSiteOwner(userId);

  return (
    <ConvexAdminProvider>
      <div className="fixed inset-0 overflow-hidden bg-base text-ink">
        {owner ? children : <AccessDenied />}
      </div>
    </ConvexAdminProvider>
  );
}
