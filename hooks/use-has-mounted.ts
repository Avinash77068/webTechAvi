"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** True only after the client has hydrated — avoids the classic effect+setState mount flag. */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
