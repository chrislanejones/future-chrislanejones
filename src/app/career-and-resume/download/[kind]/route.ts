import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

// Streams the resume out of Convex storage under a readable filename. The
// files are not in /public on purpose — see convex/resume.ts.

const CONTENT_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kind: string }> }
) {
  const { kind } = await params;
  if (kind !== "pdf" && kind !== "docx") {
    return new Response("Not found", { status: 404 });
  }

  const file = await convex.query(api.resume.getDownload, { kind });
  if (!file) return new Response("Not found", { status: 404 });

  const upstream = await fetch(file.url);
  if (!upstream.ok || !upstream.body) {
    return new Response("Resume unavailable", { status: 502 });
  }

  // PDF opens in the browser tab; Word downloads.
  const disposition = kind === "pdf" ? "inline" : "attachment";
  return new Response(upstream.body, {
    headers: {
      "Content-Type": CONTENT_TYPES[kind],
      "Content-Disposition": `${disposition}; filename="${file.filename}"`,
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
