// src/app/admin/effects/engagement-effects.ts
import { Effect, pipe } from "effect";

export interface BlogComment {
  id: string;
  postId: string;
  postTitle: string;
  authorName: string;
  authorEmail: string;
  content: string;
  approved: boolean;
  createdAt: number;
}

export interface CommentFilter {
  searchQuery?: string;
  approved?: boolean;
  postId?: string;
}

export interface PostLikeStats {
  postId: string;
  postTitle: string;
  likesCount: number;
  percentageOfTotal: number;
}

export class EngagementError extends Error {
  readonly _tag = "EngagementError";
  constructor(message: string) {
    super(message);
    this.name = "EngagementError";
  }
}

export class EngagementValidationError extends Error {
  readonly _tag = "EngagementValidationError";
  constructor(message: string) {
    super(message);
    this.name = "EngagementValidationError";
  }
}

export const validateComment = (comment: Partial<BlogComment>) =>
  Effect.gen(function* () {
    const authorName = comment.authorName ?? "";
    const authorEmail = comment.authorEmail ?? "";
    const content = comment.content ?? "";

    if (!authorName || authorName.trim().length === 0) {
      yield* Effect.fail(
        new EngagementValidationError("Author name is required")
      );
    }

    if (!authorEmail || authorEmail.trim().length === 0) {
      yield* Effect.fail(
        new EngagementValidationError("Author email is required")
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      yield* Effect.fail(
        new EngagementValidationError(`Invalid email: ${authorEmail}`)
      );
    }

    if (!content || content.trim().length === 0) {
      yield* Effect.fail(
        new EngagementValidationError("Comment content is required")
      );
    }

    if (content.length < 5) {
      yield* Effect.fail(
        new EngagementValidationError("Comment must be at least 5 characters")
      );
    }

    if (content.length > 2000) {
      yield* Effect.fail(
        new EngagementValidationError(
          "Comment exceeds maximum length (2000 characters)"
        )
      );
    }

    return comment as BlogComment;
  });

export const filterCommentsEffect = (
  comments: BlogComment[],
  filter: CommentFilter
) =>
  Effect.gen(function* () {
    let filtered = [...comments];

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.authorName.toLowerCase().includes(query) ||
          (c.content?.toLowerCase().includes(query) ?? false) ||
          c.postTitle.toLowerCase().includes(query)
      );
    }

    if (filter.approved !== undefined) {
      filtered = filtered.filter((c) => c.approved === filter.approved);
    }

    if (filter.postId) {
      filtered = filtered.filter((c) => c.postId === filter.postId);
    }

    return filtered;
  });

export const approveCommentEffect = (commentId: string) =>
  Effect.gen(function* () {
    if (!commentId) {
      yield* Effect.fail(
        new EngagementValidationError("Comment ID is required")
      );
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 200))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new EngagementError("Failed to approve comment"))
      )
    );

    return { success: true, commentId };
  });

export const bulkApproveCommentsEffect = (commentIds: string[]) =>
  Effect.gen(function* () {
    if (commentIds.length === 0) {
      yield* Effect.fail(new EngagementValidationError("No comments selected"));
    }

    if (commentIds.length > 100) {
      yield* Effect.fail(
        new EngagementValidationError(
          "Cannot approve more than 100 comments at once"
        )
      );
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new EngagementError("Bulk approve failed"))
      )
    );

    return { success: true, approved: commentIds.length };
  });

export const rejectCommentEffect = (commentId: string) =>
  Effect.gen(function* () {
    if (!commentId) {
      yield* Effect.fail(
        new EngagementValidationError("Comment ID is required")
      );
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 200))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new EngagementError("Failed to reject comment"))
      )
    );

    return { success: true, rejected: commentId };
  });

export const deleteCommentEffect = (commentId: string) =>
  Effect.gen(function* () {
    if (!commentId) {
      yield* Effect.fail(
        new EngagementValidationError("Comment ID is required")
      );
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 300))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new EngagementError("Failed to delete comment"))
      )
    );

    return { success: true, deleted: commentId };
  });

export const calculateLikeStatsEffect = (
  posts: Array<{ id: string; title: string; likesCount: number }>
) =>
  Effect.gen(function* () {
    if (posts.length === 0) {
      yield* Effect.fail(new EngagementValidationError("No posts available"));
    }

    const totalLikes = posts.reduce((sum, p) => sum + p.likesCount, 0);

    const stats: PostLikeStats[] = posts.map((post) => ({
      postId: post.id,
      postTitle: post.title,
      likesCount: post.likesCount,
      percentageOfTotal:
        totalLikes > 0 ? (post.likesCount / totalLikes) * 100 : 0,
    }));

    return {
      stats,
      total: totalLikes,
      average: totalLikes / posts.length,
      topPost: stats.reduce((prev, current) =>
        prev.likesCount > current.likesCount ? prev : current
      ),
    };
  });
