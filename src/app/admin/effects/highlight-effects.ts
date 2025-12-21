import { Effect } from "effect";

export interface HighlightInput {
  title: string;
  description: string;
  href?: string;
  image?: string;
  featured: boolean;
}

export class HighlightValidationError extends Error {
  readonly _tag = "HighlightValidationError";
}

export const validateHighlight = (input: HighlightInput) =>
  Effect.gen(function* () {
    if (!input.title.trim()) {
      yield* Effect.fail(
        new HighlightValidationError("Title is required")
      );
    }

    if (input.description.length < 20) {
      yield* Effect.fail(
        new HighlightValidationError(
          "Description must be at least 20 characters"
        )
      );
    }

    if (input.href) {
      try {
        new URL(input.href);
      } catch {
        yield* Effect.fail(
          new HighlightValidationError("Invalid URL")
        );
      }
    }

    return input;
  });

export const enforceFeaturedLimit = (
  featuredCount: number,
  max = 6
) =>
  Effect.gen(function* () {
    if (featuredCount >= max) {
      yield* Effect.fail(
        new HighlightValidationError(
          `Only ${max} featured items allowed`
        )
      );
    }
    return true;
  });
