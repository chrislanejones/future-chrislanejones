// src/app/admin/effects/seo-effects.ts
import { Effect, pipe } from "effect";

export interface SEOData {
  path: string;
  title: string;
  description: string;
  canonicalUrl?: string;
}

export interface SEOValidation {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

export class SEOError extends Error {
  readonly _tag = "SEOError";
  constructor(message: string) {
    super(message);
    this.name = "SEOError";
  }
}

export class SEOValidationError extends Error {
  readonly _tag = "SEOValidationError";
  constructor(message: string) {
    super(message);
    this.name = "SEOValidationError";
  }
}

export const validateTitle = (title: string) =>
  Effect.gen(function* () {
    const MIN = 30;
    const MAX = 60;
    const OPTIMAL_MIN = 50;
    const OPTIMAL_MAX = 60;

    if (!title || title.trim().length === 0) {
      yield* Effect.fail(new SEOValidationError("Title is required"));
    }

    if (title.length < MIN) {
      yield* Effect.fail(
        new SEOValidationError(
          `Title is too short (${title.length}/${MIN} characters minimum)`
        )
      );
    }

    if (title.length > MAX) {
      yield* Effect.fail(
        new SEOValidationError(
          `Title is too long (${title.length}/${MAX} characters maximum)`
        )
      );
    }

    return {
      valid: true,
      length: title.length,
      inOptimalRange:
        title.length >= OPTIMAL_MIN && title.length <= OPTIMAL_MAX,
    };
  });

export const validateDescription = (description: string) =>
  Effect.gen(function* () {
    const MIN = 120;
    const MAX = 160;
    const OPTIMAL_MIN = 150;
    const OPTIMAL_MAX = 160;

    if (!description || description.trim().length === 0) {
      yield* Effect.fail(new SEOValidationError("Description is required"));
    }

    if (description.length < MIN) {
      yield* Effect.fail(
        new SEOValidationError(
          `Description is too short (${description.length}/${MIN} characters minimum)`
        )
      );
    }

    if (description.length > MAX) {
      yield* Effect.fail(
        new SEOValidationError(
          `Description is too long (${description.length}/${MAX} characters maximum - will be truncated)`
        )
      );
    }

    return {
      valid: true,
      length: description.length,
      inOptimalRange:
        description.length >= OPTIMAL_MIN && description.length <= OPTIMAL_MAX,
    };
  });

export const validateSEO = (seo: Partial<SEOData>) =>
  pipe(
    Effect.all([
      validateTitle(seo.title || ""),
      validateDescription(seo.description || ""),
    ]),
    Effect.flatMap(() =>
      Effect.gen(function* () {
        if (!seo.path) {
          yield* Effect.fail(new SEOValidationError("Page path is required"));
        }

        if (seo.canonicalUrl) {
          try {
            new URL(seo.canonicalUrl);
          } catch {
            yield* Effect.fail(
              new SEOValidationError(
                `Invalid canonical URL: ${seo.canonicalUrl}`
              )
            );
          }
        }

        return seo as SEOData;
      })
    )
  );

export const calculateSEOScore = (seo: SEOData) =>
  Effect.gen(function* () {
    let score = 0;

    if (seo.title.length >= 30 && seo.title.length <= 60) {
      score += 25;
    } else if (seo.title.length >= 50 && seo.title.length <= 60) {
      score += 25;
    }

    if (seo.description.length >= 120 && seo.description.length <= 160) {
      score += 25;
    } else if (seo.description.length >= 150 && seo.description.length <= 160) {
      score += 25;
    }

    if (
      seo.title.toLowerCase().includes(seo.path) ||
      seo.description.toLowerCase().includes(seo.path)
    ) {
      score += 20;
    }

    if (seo.canonicalUrl) {
      score += 15;
    }

    if (seo.title.split(" ").length > 3) {
      score += 15;
    }

    return Math.min(score, 100);
  });

export const generateSEOSuggestions = (seo: SEOData) =>
  Effect.gen(function* () {
    const suggestions: string[] = [];

    if (seo.title.length < 50) {
      suggestions.push("Consider expanding your title to 50-60 characters");
    }

    if (seo.description.length < 150) {
      suggestions.push(
        "Make your description longer (aim for 150-160 characters)"
      );
    }

    if (!seo.title.toLowerCase().includes("keyword")) {
      suggestions.push("Include primary keywords in your title");
    }

    if (seo.title.split(" ").length < 4) {
      suggestions.push("Use more descriptive words in your title");
    }

    if (!seo.canonicalUrl) {
      suggestions.push(
        "Add a canonical URL to prevent duplicate content issues"
      );
    }

    return suggestions;
  });

export const updateSEOEffect = (seo: Partial<SEOData>) =>
  pipe(
    validateSEO(seo),
    Effect.flatMap((validSEO) =>
      Effect.gen(function* () {
        yield* Effect.promise(
          () => new Promise((resolve) => setTimeout(resolve, 300))
        );
        return validSEO;
      }).pipe(
        Effect.catchAll(() =>
          Effect.fail(new SEOError("Failed to update SEO data"))
        )
      )
    ),
    Effect.tap(() => Effect.log("SEO data updated successfully"))
  );

export const bulkUpdateSEOEffect = (pages: Partial<SEOData>[]) =>
  Effect.gen(function* () {
    if (pages.length === 0) {
      yield* Effect.fail(new SEOValidationError("No pages to update"));
    }

    const validationResults = yield* Effect.all(
      pages.map((page) => validateSEO(page))
    );

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    ).pipe(
      Effect.catchAll(() => Effect.fail(new SEOError("Bulk update failed")))
    );

    return {
      updated: validationResults.length,
      timestamp: Date.now(),
    };
  });
