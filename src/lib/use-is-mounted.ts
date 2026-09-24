"use client";

import { useSyncExternalStore } from "react";

// Nothing ever changes after hydration, so the store never needs to notify.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * True only after hydration. Use it to gate rendering of anything that would
 * otherwise mismatch between the server and the client.
 *
 * This is the `useSyncExternalStore` form of the old
 * `useEffect(() => setMounted(true), [])` trick — same behaviour, but it does
 * not set state from an effect, so it costs one less render and satisfies
 * react-hooks/set-state-in-effect.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
