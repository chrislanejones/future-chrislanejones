import Image from "next/image";
import Link from "next/link";

export const MDXComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-3xl font-bold mt-6 mb-3 text-foreground">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-2xl font-semibold mt-4 mb-2 text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="text-base leading-7 mb-4 text-ink">{children}</p>
  ),
  a: ({ href, children }: any) => (
    <Link
      href={href}
      className="text-accent hover:text-accent-alt underline underline-offset-2"
    >
      {children}
    </Link>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-ink">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-ink">
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li className="ml-4">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-accent pl-4 italic my-4 text-muted">
      {children}
    </blockquote>
  ),
  code: ({ children }: any) => (
    <code className="bg-muted-accent px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  img: ({ src, alt }: any) => (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={400}
      className="rounded-lg my-6"
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-border">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-border bg-muted-accent px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-border px-4 py-2">{children}</td>
  ),
};
