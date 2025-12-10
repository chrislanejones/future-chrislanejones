import { Effect, pipe } from "effect";

export interface BrowserLink {
  _id: string;
  href: string;
  label: string;
  domain: string;
  favicon?: string;
  category: string;
  color: string;
  order: number;
  featured?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface LinkCategory {
  category: string;
  color: string;
  count: number;
}

export interface LinkValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class LinkError extends Error {
  readonly _tag = "LinkError";
  constructor(message: string) {
    super(message);
    this.name = "LinkError";
  }
}

export class LinkValidationError extends Error {
  readonly _tag = "LinkValidationError";
  constructor(message: string) {
    super(message);
    this.name = "LinkValidationError";
  }
}

export class CategoryError extends Error {
  readonly _tag = "CategoryError";
  constructor(message: string) {
    super(message);
    this.name = "CategoryError";
  }
}

// Validate URL format
export const validateUrl = (url: string) =>
  Effect.gen(function* () {
    if (!url || url.trim().length === 0) {
      yield* Effect.fail(new LinkValidationError("URL is required"));
    }

    try {
      new URL(url);
    } catch {
      yield* Effect.fail(new LinkValidationError(`Invalid URL format: ${url}`));
    }

    return url;
  });

// Validate link data
export const validateLink = (link: Partial<BrowserLink>) =>
  Effect.gen(function* () {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!link.href?.trim()) {
      errors.push("URL is required");
    } else {
      try {
        new URL(link.href);
      } catch {
        errors.push("Invalid URL format");
      }
    }

    if (!link.label?.trim()) {
      errors.push("Label is required");
    } else if (link.label.length > 100) {
      warnings.push("Label is quite long (consider shortening)");
    }

    if (!link.category?.trim()) {
      errors.push("Category is required");
    }

    if (!link.color) {
      warnings.push("No color specified, will use default");
    }

    if (errors.length > 0) {
      yield* Effect.fail(
        new LinkValidationError(`Validation errors: ${errors.join(", ")}`)
      );
    }

    return {
      isValid: true,
      errors,
      warnings,
    } as LinkValidationResult;
  });

// Extract domain from URL
export const extractDomain = (url: string) =>
  Effect.gen(function* () {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch {
      yield* Effect.fail(
        new LinkError(`Failed to extract domain from: ${url}`)
      );
    }
    return "";
  });

// Create link effect
export const createLinkEffect = (link: Partial<BrowserLink>) =>
  pipe(
    validateLink(link),
    Effect.flatMap(() => extractDomain(link.href || "")),
    Effect.flatMap((domain) =>
      Effect.gen(function* () {
        return {
          ...link,
          domain,
          featured: link.featured ?? false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      }).pipe(
        Effect.catchAll(() =>
          Effect.fail(new LinkError("Failed to create link"))
        )
      )
    )
  );

// Toggle featured status effect
export const toggleFeaturedEffect = (link: BrowserLink) =>
  Effect.gen(function* () {
    if (!link._id) {
      yield* Effect.fail(new LinkValidationError("Link ID is required"));
    }

    yield* Effect.log(
      `Toggling featured status for "${link.label}" to ${!link.featured}`
    );

    return {
      ...link,
      featured: !link.featured,
      updatedAt: Date.now(),
    };
  });

// Delete category effect
export const deleteCategoryEffect = (category: string, linkCount: number) =>
  Effect.gen(function* () {
    if (!category || category.trim().length === 0) {
      yield* Effect.fail(new CategoryError("Category name is required"));
    }

    if (linkCount > 0) {
      yield* Effect.log(
        `Deleting category "${category}" with ${linkCount} links`
      );
    }

    // Simulate async operation
    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 300))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new CategoryError("Failed to delete category"))
      )
    );

    return {
      deleted: true,
      category,
      linksDeleted: linkCount,
    };
  });

// Filter links by category effect
export const filterLinksByCategoryEffect = (
  links: BrowserLink[],
  category: string
) =>
  Effect.gen(function* () {
    if (!category) {
      return links;
    }

    return links.filter((link) => link.category === category);
  });

// Get featured links effect
export const getFeaturedLinksEffect = (links: BrowserLink[]) =>
  Effect.gen(function* () {
    return links.filter((link) => link.featured === true);
  });

// Sort links by order effect
export const sortLinksEffect = (links: BrowserLink[]) =>
  Effect.gen(function* () {
    return [...links].sort((a, b) => a.order - b.order);
  });

// Group links by category effect
export const groupLinksByCategoryEffect = (links: BrowserLink[]) =>
  Effect.gen(function* () {
    const grouped = new Map<string, BrowserLink[]>();

    for (const link of links) {
      const category = link.category;
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(link);
    }

    return grouped;
  });
