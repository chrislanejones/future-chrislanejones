import type { Doc } from "../../convex/_generated/dataModel";

export type Conference = Doc<"conferences">;

export function conferenceHref(conference: Pick<Conference, "year" | "slug">) {
  return `/conferences/${conference.year}/${conference.slug}`;
}

export function conferenceDates(conference: Pick<Conference, "year" | "dateStart" | "dateEnd">) {
  const parse = (value?: string) => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isNaN(date.getTime()) ? null : date;
  };
  const start = parse(conference.dateStart);
  const end = parse(conference.dateEnd);
  if (!start) return String(conference.year);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  });
  // Node and browsers can use different CLDR spacing for date ranges.
  // Normalize Unicode whitespace so the server and client hydrate identically.
  return (end && end > start ? formatter.formatRange(start, end) : formatter.format(start))
    .replace(/\s/g, " ");
}

export function conferenceYears(conferences: Conference[]) {
  return [...new Set(conferences.map((conference) => conference.year))].sort((a, b) => b - a);
}

export function sortConferences(conferences: Conference[]) {
  return [...conferences].sort((a, b) =>
    b.year - a.year || (b.dateStart ?? "").localeCompare(a.dateStart ?? "") || a.name.localeCompare(b.name),
  );
}
