// src/app/admin/effects/media-effects.ts
import { Effect, pipe, Either } from "effect";

export interface MediaFile {
  id?: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  altText?: string;
  assignedToType?: string;
  assignedToId?: string;
  assignedToTitle?: string;
}

export interface UploadProgress {
  filename: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "failed";
  error?: string;
}

export class MediaError extends Error {
  readonly _tag = "MediaError";
  constructor(message: string) {
    super(message);
    this.name = "MediaError";
  }
}

export class UploadError extends Error {
  readonly _tag = "UploadError";
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

export class ValidationError extends Error {
  readonly _tag = "ValidationError";
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DragDropError extends Error {
  readonly _tag = "DragDropError";
  constructor(message: string) {
    super(message);
    this.name = "DragDropError";
  }
}

export const validateMediaFile = (file: File) =>
  Effect.gen(function* () {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!validTypes.includes(file.type)) {
      yield* Effect.fail(
        new ValidationError(
          `Invalid file type: ${file.type}. Allowed: ${validTypes.join(", ")}`
        )
      );
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      yield* Effect.fail(
        new ValidationError(
          `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 50MB`
        )
      );
    }

    return {
      name: file.name,
      size: file.size,
      type: file.type,
    };
  });

export const uploadMediaFile = (file: File) =>
  Effect.gen(function* () {
    yield* validateMediaFile(file);
    yield* Effect.log(`Uploading ${file.name}...`);

    let attempts = 0;
    const maxRetries = 3;

    let lastError: Error | null = null;

    while (attempts < maxRetries) {
      try {
        const fileInfo = yield* Effect.promise(
          () =>
            new Promise<{ url: string; name: string; size: number }>(
              (resolve, reject) => {
                setTimeout(() => {
                  // Simulate random upload success
                  if (Math.random() > 0.3 || attempts === maxRetries - 1) {
                    resolve({
                      url: `https://example.com/media/${Date.now()}-${file.name}`,
                      name: file.name,
                      size: file.size,
                    });
                  } else {
                    reject(new Error("Upload failed, retrying..."));
                  }
                }, 500);
              }
            )
        ).pipe(Effect.catchAll((error) => Effect.succeed(error)));

        if (fileInfo instanceof Error) {
          lastError = fileInfo;
          attempts++;
          if (attempts < maxRetries) {
            yield* Effect.sleep("500 millis");
            continue;
          } else {
            yield* Effect.fail(
              new UploadError(
                `Failed to upload ${file.name} after ${maxRetries} attempts`
              )
            );
          }
        }

        return {
          id: `media_${Date.now()}`,
          url: fileInfo.url,
          filename: fileInfo.name,
          size: fileInfo.size,
          mimeType: file.type,
          uploadedAt: Date.now(),
        } as MediaFile;
      } catch (err) {
        attempts++;
        if (attempts < maxRetries) {
          yield* Effect.sleep("500 millis");
        } else {
          const message = err instanceof Error ? err.message : "Unknown error";
          yield* Effect.fail(new UploadError(`Upload failed: ${message}`));
        }
      }
    }

    yield* Effect.fail(new UploadError(`Failed to upload ${file.name}`));
  });

export const batchUploadMedia = (files: File[]) =>
  Effect.gen(function* () {
    if (files.length === 0) {
      yield* Effect.fail(new ValidationError("No files selected"));
    }

    if (files.length > 50) {
      yield* Effect.fail(
        new ValidationError("Cannot upload more than 50 files at once")
      );
    }

    const results: (MediaFile | Error)[] = [];

    for (const file of files) {
      const either = yield* Effect.either(uploadMediaFile(file));

      if (Either.isLeft(either)) {
        results.push(either.left as Error);
      } else {
        results.push(either.right as MediaFile);
      }
    }

    const successful = results.filter(
      (r) => !(r instanceof Error)
    ) as MediaFile[];
    const failed = results.filter((r) => r instanceof Error) as Error[];

    return {
      successful,
      failed,
      summary: {
        total: results.length,
        uploaded: successful.length,
        errors: failed.length,
      },
    };
  });

export const validateDragDropAssignment = (
  mediaId: string,
  targetType: string,
  targetId: string
) =>
  Effect.gen(function* () {
    if (!mediaId) {
      yield* Effect.fail(new DragDropError("Media ID is missing"));
    }

    if (!targetType) {
      yield* Effect.fail(new DragDropError("Target type is missing"));
    }

    if (!targetId) {
      yield* Effect.fail(new DragDropError("Target ID is missing"));
    }

    const validTargetTypes = ["page", "blogPost", "galleryDrawer"];
    if (!validTargetTypes.includes(targetType)) {
      yield* Effect.fail(
        new DragDropError(
          `Invalid target type: ${targetType}. Valid: ${validTargetTypes.join(", ")}`
        )
      );
    }

    return { mediaId, targetType, targetId };
  });

export const assignMediaEffect = (
  mediaId: string,
  targetType: string,
  targetId: string,
  targetTitle: string
) =>
  pipe(
    validateDragDropAssignment(mediaId, targetType, targetId),
    Effect.flatMap(() =>
      Effect.gen(function* () {
        yield* Effect.promise(
          () => new Promise((resolve) => setTimeout(resolve, 300))
        );
        return { success: true, mediaId, targetType, targetId };
      }).pipe(
        Effect.catchAll(() =>
          Effect.fail(new MediaError("Failed to assign media to content"))
        )
      )
    )
  );

export const unassignMediaEffect = (mediaId: string) =>
  Effect.gen(function* () {
    if (!mediaId) {
      yield* Effect.fail(new ValidationError("Media ID is required"));
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 300))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new MediaError("Failed to unassign media"))
      )
    );

    return { success: true, mediaId };
  });

export const deleteMediaEffect = (mediaId: string) =>
  Effect.gen(function* () {
    if (!mediaId) {
      yield* Effect.fail(new ValidationError("Media ID is required"));
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new MediaError("Failed to delete media"))
      )
    );

    return { success: true, deleted: mediaId };
  });

export const batchDeleteMediaEffect = (mediaIds: string[]) =>
  Effect.gen(function* () {
    if (mediaIds.length === 0) {
      yield* Effect.fail(new ValidationError("No media selected"));
    }

    yield* Effect.log(`Deleting ${mediaIds.length} media files...`);

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new MediaError("Batch deletion failed"))
      )
    );

    return {
      deleted: mediaIds.length,
      timestamp: Date.now(),
    };
  });

export const generateAltText = (filename: string) =>
  Effect.gen(function* () {
    if (!filename) {
      yield* Effect.fail(new ValidationError("Filename is required"));
    }

    const altText = filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return altText;
  });
