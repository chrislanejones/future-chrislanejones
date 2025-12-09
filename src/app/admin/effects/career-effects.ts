// src/app/admin/effects/career-effects.ts
import { Effect, pipe } from "effect";

export interface CareerEvent {
  year: string;
  title: string;
  description: string;
  location?: string;
  iconName: string;
  order: number;
}

export interface CareerTimeline {
  events: CareerEvent[];
  startYear: number;
  endYear: number;
}

export class CareerError extends Error {
  readonly _tag = "CareerError";
  constructor(message: string) {
    super(message);
    this.name = "CareerError";
  }
}

export class CareerValidationError extends Error {
  readonly _tag = "CareerValidationError";
  constructor(message: string) {
    super(message);
    this.name = "CareerValidationError";
  }
}

export class IconError extends Error {
  readonly _tag = "IconError";
  constructor(message: string) {
    super(message);
    this.name = "IconError";
  }
}

const VALID_ICONS = [
  "GraduationCap",
  "Video",
  "Star",
  "Lightbulb",
  "Mountain",
  "Home",
  "Users",
  "Code2",
  "Briefcase",
  "Award",
  "BookOpen",
  "Coffee",
  "Rocket",
  "Target",
];

export const validateIcon = (iconName: string) =>
  Effect.gen(function* () {
    if (!iconName || iconName.trim().length === 0) {
      yield* Effect.fail(new IconError("Icon name is required"));
    }

    if (!VALID_ICONS.includes(iconName)) {
      yield* Effect.fail(
        new IconError(
          `Invalid icon: ${iconName}. Valid icons: ${VALID_ICONS.join(", ")}`
        )
      );
    }

    return iconName;
  });

export const validateCareerEvent = (event: Partial<CareerEvent>) =>
  Effect.gen(function* () {
    // Year validation
    if (!event.year || event.year.trim().length === 0) {
      yield* Effect.fail(new CareerValidationError("Year is required"));
    }

    // Title validation - check existence first, then length in else-if
    if (!event.title || event.title.trim().length === 0) {
      yield* Effect.fail(new CareerValidationError("Title is required"));
    } else if (event.title.length > 200) {
      yield* Effect.fail(
        new CareerValidationError("Title must be less than 200 characters")
      );
    }

    // Description validation - check existence first, then length in else-if
    if (!event.description || event.description.trim().length === 0) {
      yield* Effect.fail(new CareerValidationError("Description is required"));
    } else if (event.description.length < 20) {
      yield* Effect.fail(
        new CareerValidationError("Description must be at least 20 characters")
      );
    }

    yield* validateIcon(event.iconName || "");

    return event as CareerEvent;
  });
export const createCareerEventEffect = (event: Partial<CareerEvent>) =>
  pipe(
    validateCareerEvent(event),
    Effect.flatMap((validEvent) =>
      Effect.gen(function* () {
        return {
          ...validEvent,
          createdAt: Date.now(),
        };
      }).pipe(
        Effect.catchAll(() =>
          Effect.fail(new CareerError("Failed to create career event"))
        )
      )
    )
  );

export const reorderTimelineEffect = (
  events: Array<{ id: string; order: number }>
) =>
  Effect.gen(function* () {
    if (events.length === 0) {
      yield* Effect.fail(new CareerValidationError("No events to reorder"));
    }

    const orders = events.map((e) => e.order);
    const maxOrder = Math.max(...orders);
    const minOrder = Math.min(...orders);

    if (maxOrder - minOrder !== events.length - 1) {
      yield* Effect.fail(new CareerValidationError("Invalid order sequence"));
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 400))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new CareerError("Failed to reorder timeline"))
      )
    );

    return { success: true, reordered: events.length };
  });

export const deleteCareerEventEffect = (eventId: string) =>
  Effect.gen(function* () {
    if (!eventId) {
      yield* Effect.fail(new CareerValidationError("Event ID is required"));
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 300))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new CareerError("Failed to delete event"))
      )
    );

    return { success: true, deleted: eventId };
  });

export const analyzeTimelineEffect = (events: CareerEvent[]) =>
  Effect.gen(function* () {
    if (events.length === 0) {
      yield* Effect.fail(new CareerValidationError("No events in timeline"));
    }

    const years = events
      .map((e) => parseInt(e.year.split("-")[0]))
      .filter((y) => !isNaN(y));

    const startYear = Math.min(...years);
    const endYear = Math.max(...years);
    const yearsSpan = endYear - startYear;

    return {
      eventCount: events.length,
      startYear,
      endYear,
      yearsSpan,
      averageEventsPerYear: (events.length / (yearsSpan + 1)).toFixed(2),
    };
  });
