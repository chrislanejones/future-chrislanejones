import { Effect, pipe } from "effect";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  read: boolean;
  createdAt: number;
}

export interface MessageFilter {
  searchQuery?: string;
  read?: boolean;
  source?: string;
  dateRange?: { start: number; end: number };
}

// Error types
export class MessageError extends Error {
  readonly _tag = "MessageError";
  constructor(message: string) {
    super(message);
    this.name = "MessageError";
  }
}

export class MessageValidationError extends Error {
  readonly _tag = "MessageValidationError";
  constructor(message: string) {
    super(message);
    this.name = "MessageValidationError";
  }
}

// Validate email
export const validateEmail = (email: string) =>
  Effect.gen(function* () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim().length === 0) {
      yield* Effect.fail(new MessageValidationError("Email is required"));
    }

    if (!emailRegex.test(email)) {
      yield* Effect.fail(new MessageValidationError(`Invalid email: ${email}`));
    }

    return email;
  });

// Validate phone (optional, but if provided must be valid)
export const validatePhone = (phone?: string) =>
  Effect.gen(function* () {
    if (!phone) return undefined;

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;

    if (!phoneRegex.test(phone)) {
      yield* Effect.fail(
        new MessageValidationError(`Invalid phone number: ${phone}`)
      );
    }

    return phone;
  });

// Filter messages
export const filterMessagesEffect = (
  messages: ContactMessage[],
  filter: MessageFilter
) =>
  Effect.gen(function* () {
    let filtered = [...messages];

    // Search filter
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.message.toLowerCase().includes(query)
      );
    }

    // Read status filter
    if (filter.read !== undefined) {
      filtered = filtered.filter((m) => m.read === filter.read);
    }

    // Source filter
    if (filter.source) {
      filtered = filtered.filter((m) => m.source === filter.source);
    }

    // Date range filter
    if (filter.dateRange) {
      filtered = filtered.filter(
        (m) =>
          m.createdAt >= filter.dateRange!.start &&
          m.createdAt <= filter.dateRange!.end
      );
    }

    return filtered;
  });

// Mark as read
export const markMessageReadEffect = (messageId: string) =>
  Effect.gen(function* () {
    if (!messageId) {
      yield* Effect.fail(new MessageValidationError("Message ID is required"));
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 200))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new MessageError("Failed to mark message as read"))
      )
    );

    return { success: true, messageId };
  });

// Bulk mark as read
export const bulkMarkReadEffect = (messageIds: string[]) =>
  Effect.gen(function* () {
    if (messageIds.length === 0) {
      yield* Effect.fail(new MessageValidationError("No messages selected"));
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new MessageError("Bulk operation failed"))
      )
    );

    return { success: true, updated: messageIds.length };
  });

// Delete message
export const deleteMessageEffect = (messageId: string) =>
  Effect.gen(function* () {
    if (!messageId) {
      yield* Effect.fail(new MessageValidationError("Message ID is required"));
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 300))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new MessageError("Failed to delete message"))
      )
    );

    return { success: true, deleted: messageId };
  });

// Send reply email
export const sendReplyEffect = (
  toEmail: string,
  subject: string,
  body: string
) =>
  pipe(
    validateEmail(toEmail),
    Effect.flatMap(() =>
      Effect.gen(function* () {
        if (!subject || subject.trim().length === 0) {
          yield* Effect.fail(new MessageValidationError("Subject is required"));
        }

        if (!body || body.trim().length === 0) {
          yield* Effect.fail(
            new MessageValidationError("Message body is required")
          );
        }

        yield* Effect.promise(
          () => new Promise((resolve) => setTimeout(resolve, 1000))
        ).pipe(
          Effect.catchAll(() =>
            Effect.fail(new MessageError("Failed to send reply"))
          )
        );

        return { success: true, sentTo: toEmail };
      })
    )
  );

// Export messages
export const exportMessagesEffect = (messages: ContactMessage[]) =>
  Effect.gen(function* () {
    if (messages.length === 0) {
      yield* Effect.fail(new MessageValidationError("No messages to export"));
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 800))
    ).pipe(
      Effect.catchAll(() => Effect.fail(new MessageError("Export failed")))
    );

    const filename = `messages_${new Date().toISOString()}.json`;

    return {
      filename,
      count: messages.length,
      size: (JSON.stringify(messages).length / 1024).toFixed(2) + " KB",
    };
  });
