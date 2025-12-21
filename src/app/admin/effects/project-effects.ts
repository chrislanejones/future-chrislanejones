import { Effect } from "effect";

export class ProjectFeatureError extends Error {
  readonly _tag = "ProjectFeatureError";
}

export const enforceFeaturedLimit = (currentFeaturedCount: number, max = 6) =>
  Effect.gen(function* () {
    if (currentFeaturedCount >= max) {
      yield* Effect.fail(
        new ProjectFeatureError(
          `Only ${max} projects can be featured on the homepage`
        )
      );
    }
    return true;
  });
