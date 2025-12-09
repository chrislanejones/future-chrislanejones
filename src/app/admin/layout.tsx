export const metadata = {
  title: "Admin Dashboard | Chris Lane Jones",
  description: "Manage portfolio content and SEO",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-base text-ink">
      {children}
    </div>
  );
}
