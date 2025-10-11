export const metadata = {
  title: "Admin Dashboard | Chris Lane Jones",
  description: "Manage portfolio content and SEO",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Let middleware handle the auth protection
  return <>{children}</>;
}
