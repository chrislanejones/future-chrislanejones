// src/app/admin/effects/pages-effects.ts
import { Effect, pipe } from "effect";

export interface PageNavItem {
  id: string;
  label: string;
  href?: string;
  isExternal?: boolean;
  order: number;
  parentId?: string;
  children?: PageNavItem[];
}

export class PageError extends Error {
  readonly _tag = "PageError";
  constructor(message: string) {
    super(message);
    this.name = "PageError";
  }
}

export class PageValidationError extends Error {
  readonly _tag = "PageValidationError";
  constructor(message: string) {
    super(message);
    this.name = "PageValidationError";
  }
}

export class MenuStructureError extends Error {
  readonly _tag = "MenuStructureError";
  constructor(message: string) {
    super(message);
    this.name = "MenuStructureError";
  }
}

export const validatePageItem = (item: Partial<PageNavItem>) =>
  Effect.gen(function* () {
    const label = item.label ?? "";

    if (!label || label.trim().length === 0) {
      yield* Effect.fail(new PageValidationError("Label is required"));
    }

    if (label.length > 100) {
      yield* Effect.fail(
        new PageValidationError("Label must be less than 100 characters")
      );
    }

    if (item.href && item.href.trim().length === 0) {
      yield* Effect.fail(new PageValidationError("URL cannot be empty"));
    }

    if (
      item.href &&
      !item.href.startsWith("/") &&
      !item.href.startsWith("http")
    ) {
      yield* Effect.fail(
        new PageValidationError("URL must start with / or http")
      );
    }

    return item as PageNavItem;
  });

export const validateMenuStructure = (items: PageNavItem[]) =>
  Effect.gen(function* () {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const checkForCycles = (itemId?: string): boolean => {
      if (!itemId) return true;
      if (recursionStack.has(itemId)) return false;
      if (visited.has(itemId)) return true;

      recursionStack.add(itemId);

      const item = items.find((i) => i.id === itemId);
      if (item?.children) {
        for (const child of item.children) {
          if (!checkForCycles(child.id)) return false;
        }
      }

      recursionStack.delete(itemId);
      visited.add(itemId);
      return true;
    };

    for (const item of items) {
      if (!checkForCycles(item.id)) {
        yield* Effect.fail(
          new MenuStructureError(
            "Circular reference detected in menu structure"
          )
        );
      }
    }

    return true;
  });

export const addPageToMenuEffect = (
  item: Partial<PageNavItem>,
  existingItems: PageNavItem[]
) =>
  pipe(
    validatePageItem(item),
    Effect.flatMap(() =>
      validateMenuStructure([...existingItems, item as PageNavItem])
    ),
    Effect.flatMap(() =>
      Effect.gen(function* () {
        return {
          ...item,
          id: `page_${Date.now()}`,
          order: existingItems.length,
          createdAt: Date.now(),
        };
      }).pipe(
        Effect.catchAll(() =>
          Effect.fail(new PageError("Failed to add page to menu"))
        )
      )
    )
  );

export const reorderMenuEffect = (
  items: Array<{ id: string; order: number; parentId?: string }>
) =>
  Effect.gen(function* () {
    if (items.length === 0) {
      yield* Effect.fail(new PageValidationError("No items to reorder"));
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 400))
    ).pipe(
      Effect.catchAll(() =>
        Effect.fail(new PageError("Failed to reorder menu"))
      )
    );

    return { success: true, reordered: items.length };
  });

export const deletePageFromMenuEffect = (
  itemId: string,
  hasChildren: boolean
) =>
  Effect.gen(function* () {
    if (!itemId) {
      yield* Effect.fail(new PageValidationError("Item ID is required"));
    }

    if (hasChildren) {
      yield* Effect.fail(
        new MenuStructureError(
          "Cannot delete item with children. Please delete children first."
        )
      );
    }

    yield* Effect.promise(
      () => new Promise((resolve) => setTimeout(resolve, 300))
    ).pipe(
      Effect.catchAll(() => Effect.fail(new PageError("Failed to delete page")))
    );

    return { success: true, deleted: itemId };
  });

export const flattenMenuEffect = (items: PageNavItem[]) =>
  Effect.gen(function* () {
    const flattened: PageNavItem[] = [];

    const flatten = (item: PageNavItem, level = 0) => {
      flattened.push({ ...item });
      if (item.children) {
        for (const child of item.children) {
          flatten(child, level + 1);
        }
      }
    };

    for (const item of items) {
      flatten(item);
    }

    return flattened;
  });
