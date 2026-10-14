// Abuse controls for the three anonymous public mutations: contact form,
// blog comments and blog likes. Backed by the @convex-dev/rate-limiter
// component (mounted in convex.config.ts), so limits are transactional: a
// rejected or failed mutation consumes nothing.
//
// Keys are low-trust. Convex mutations can't see the caller's IP, so per-key
// limits are keyed on what the request carries: the normalized email for
// contact/comments and the browser's random localStorage id for likes. A
// determined caller can rotate those, so every action also has a global budget
// that caps total writes per hour no matter how the keys are spread. The cost
// is that a flood can use up the global budget and briefly block real visitors.
// See docs/adr/004-public-write-rate-limits-and-shared-owner-policy.md.

import { ConvexError } from "convex/values";
import { HOUR, RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";
import type { MutationCtx } from "./_generated/server";

const hourly = (rate: number) =>
  ({ kind: "token bucket", rate, period: HOUR, capacity: rate }) as const;

const LIMITS = {
  contactPerSender: hourly(5),
  contactGlobal: hourly(30),
  commentPerAuthor: hourly(10),
  commentGlobal: hourly(60),
  likePerVisitor: hourly(60),
  likeGlobal: hourly(600),
};

type LimitName = keyof typeof LIMITS;

export const rateLimiter = new RateLimiter(components.rateLimiter, LIMITS);

// Consume one token from the per-key limit and the global limit. Throws a
// ConvexError the client can show; Convex rolls back the whole mutation, so
// nothing is written and no partial quota is spent.
export async function enforceRateLimits(
  ctx: MutationCtx,
  perKey: LimitName,
  key: string,
  global: LimitName,
): Promise<void> {
  const results = [
    await rateLimiter.limit(ctx, perKey, { key }),
    await rateLimiter.limit(ctx, global),
  ];
  const blocked = results.find((r) => !r.ok);
  if (blocked) {
    const minutes = Math.max(1, Math.ceil((blocked.retryAfter ?? 0) / 60_000));
    throw new ConvexError(
      `Too many requests. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    );
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Trim and require a non-empty value no longer than max characters.
export function requiredText(value: string, field: string, max: number): string {
  const trimmed = value.trim();
  if (!trimmed) throw new ConvexError(`${field} is required`);
  if (trimmed.length > max) throw new ConvexError(`${field} is too long`);
  return trimmed;
}

// Trimmed email with basic syntax checking. Lowercase it yourself for keys.
export function requiredEmail(value: string, max = 320): string {
  const email = requiredText(value, "Email", max);
  if (!EMAIL_RE.test(email)) throw new ConvexError("Email address is invalid");
  return email;
}
