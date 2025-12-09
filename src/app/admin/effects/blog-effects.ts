// src/app/admin/effects/blog-effects.ts
import { Effect, pipe, Either } from "effect";

export interface BlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  published: boolean;
}

export interface BlogValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class BlogError extends Error {
  readonly _tag = "BlogError";
  constructor(message: string) {
    super(message);
    this.name = "BlogError";
  }
}

export class BlogValidationError extends Error {
  readonly _tag = "BlogValidationError";
  constructor(message: string) {
    super(message);
    this.name = "BlogValidationError";
  }
}

export class SlugError extends Error {
  readonly _tag = "SlugError";
  constructor(message: string) {
    super(message);
    this.name = "SlugError";
  }
}

export class ImageUploadError extends Error {
  readonly _tag = "ImageUploadError";
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

export const generateSlug = (title: string): Effect.Effect<string, SlugError> =>
  Effect.gen(function* () {
    if (!title || title.trim().length === 0) {
      yield* Effect.fail(
        new SlugError("Title is required for slug generation")
      );
    }
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (slug.length === 0) {
      yield* Effect.fail(new SlugError("Generated slug is empty"));
    }

    return slug;
  });

export const validateBlogPost = (post: Partial<BlogPostData>) =>
  Effect.gen(function* () {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!post.title?.trim()) {
      errors.push("Title is required");
    } else if (post.title.length > 200) {
      warnings.push("Title is quite long (consider shortening)");
    }

    if (!post.slug?.trim()) {
      errors.push("Slug is required");
    } else if (!/^[a-z0-9-]+$/.test(post.slug)) {
      errors.push(
        "Slug can only contain lowercase letters, numbers, and hyphens"
      );
    }

    if (!post.excerpt?.trim()) {
      errors.push("Excerpt is required");
    } else if (post.excerpt.length < 50) {
      warnings.push("Excerpt is quite short");
    } else if (post.excerpt.length > 300) {
      warnings.push("Excerpt exceeds recommended length (300 chars)");
    }

    if (!post.content?.trim()) {
      errors.push("Content is required");
    } else if (post.content.length < 200) {
      warnings.push("Content seems too short for a blog post");
    }

    if (!post.tags || post.tags.length === 0) {
      warnings.push("Consider adding tags for better SEO");
    } else if (post.tags.length > 10) {
      warnings.push("Too many tags (5-7 is optimal)");
    }

    if (errors.length > 0) {
      yield* Effect.fail(
        new BlogValidationError(`Validation errors: ${errors.join(", ")}`)
      );
    }

    return {
      isValid: true,
      errors,
      warnings,
    } as BlogValidationResult;
  });

export const createBlogPostEffect = (post: Partial<BlogPostData>) =>
  pipe(
    validateBlogPost(post),
    Effect.flatMap(() => generateSlug(post.title || "")),
    Effect.flatMap((slug) =>
      Effect.gen(function* () {
        return {
          ...post,
          slug,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      }).pipe(
        Effect.catchAll(() =>
          Effect.fail(new BlogError("Failed to create blog post"))
        )
      )
    )
  );

export const uploadCoverImageEffect = (file: File, maxRetries = 3) =>
  Effect.gen(function* () {
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validMimeTypes.includes(file.type)) {
      yield* Effect.fail(
        new ImageUploadError(
          `Invalid image type. Allowed: ${validMimeTypes.join(", ")}`
        )
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      yield* Effect.fail(
        new ImageUploadError(
          `Image too large. Max size: ${maxSize / 1024 / 1024}MB`
        )
      );
    }

    yield* Effect.log(`Uploading image: ${file.name}`);

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    ).pipe(
      Effect.catchAll(() => Effect.fail(new ImageUploadError("Upload failed")))
    );

    return {
      name: file.name,
      size: file.size,
      url: `https://example.com/images/${file.name}`,
    };
  });

export const generateContentPreview = (content: string, maxLength = 200) =>
  Effect.gen(function* () {
    if (!content || content.length === 0) {
      yield* Effect.fail(new BlogError("Content is empty"));
    }

    const cleanContent = content
      .replace(/^<[^>]+>/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

    const preview = cleanContent.substring(0, maxLength).trim();
    return preview + (cleanContent.length > maxLength ? "..." : "");
  });

export const togglePublishBulk = (postIds: string[], published: boolean) =>
  Effect.gen(function* () {
    if (postIds.length === 0) {
      yield* Effect.fail(new BlogValidationError("No posts selected"));
    }

    yield* Effect.log(
      `${published ? "Publishing" : "Unpublishing"} ${postIds.length} posts...`
    );

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    ).pipe(
      Effect.catchAll(() => Effect.fail(new BlogError("Bulk operation failed")))
    );

    return {
      updated: postIds.length,
      status: published ? "published" : "unpublished",
      timestamp: Date.now(),
    };
  });

export const checkDuplicateSlugs = (slug: string, allSlugs: string[]) =>
  Effect.gen(function* () {
    const isDuplicate = allSlugs.includes(slug);

    if (isDuplicate) {
      yield* Effect.fail(new SlugError(`Slug "${slug}" is already in use`));
    }

    return true;
  });
