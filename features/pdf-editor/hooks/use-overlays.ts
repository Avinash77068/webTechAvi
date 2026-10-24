"use client";

import { useCallback, useState } from "react";
import type { Overlay } from "@/lib/pdf/overlay-types";
import { HISTORY_LIMIT } from "../constants";

interface OverlayState {
  items: Overlay[];
  past: Overlay[][];
  future: Overlay[][];
}

const EMPTY: OverlayState = { items: [], past: [], future: [] };

function pushPast(past: Overlay[][], items: Overlay[]): Overlay[][] {
  return [...past.slice(-(HISTORY_LIMIT - 1)), items];
}

/** Overlay list with undo/redo and a current selection. */
export function useOverlays() {
  const [state, setState] = useState<OverlayState>(EMPTY);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const add = useCallback((overlay: Overlay) => {
    setState((s) => ({ items: [...s.items, overlay], past: pushPast(s.past, s.items), future: [] }));
    setSelectedId(overlay.id);
  }, []);

  /** Adds several overlays as one undo step and selects the last one. */
  const addMany = useCallback((added: Overlay[]) => {
    if (added.length === 0) return;
    setState((s) => ({ items: [...s.items, ...added], past: pushPast(s.past, s.items), future: [] }));
    setSelectedId(added[added.length - 1].id);
  }, []);

  const remove = useCallback((id: string) => {
    setState((s) => ({ items: s.items.filter((o) => o.id !== id), past: pushPast(s.past, s.items), future: [] }));
    setSelectedId((current) => (current === id ? null : current));
  }, []);

  /** Saves a history entry without changing anything; call once before a drag or a burst of edits. */
  const beginChange = useCallback(() => {
    setState((s) => ({ ...s, past: pushPast(s.past, s.items), future: [] }));
  }, []);

  /** Updates an overlay without adding a history entry (see `beginChange`). */
  const update = useCallback((id: string, updater: (overlay: Overlay) => Overlay) => {
    setState((s) => ({ ...s, items: s.items.map((o) => (o.id === id ? updater(o) : o)) }));
  }, []);

  const undo = useCallback(() => {
    setState((s) => {
      const previous = s.past[s.past.length - 1];
      if (!previous) return s;
      return { items: previous, past: s.past.slice(0, -1), future: [s.items, ...s.future] };
    });
    setSelectedId(null);
  }, []);

  const redo = useCallback(() => {
    setState((s) => {
      const next = s.future[0];
      if (!next) return s;
      return { items: next, past: [...s.past, s.items], future: s.future.slice(1) };
    });
    setSelectedId(null);
  }, []);

  const clear = useCallback(() => {
    setState(EMPTY);
    setSelectedId(null);
  }, []);

  return {
    overlays: state.items,
    selectedId,
    selected: state.items.find((o) => o.id === selectedId) ?? null,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    select: setSelectedId,
    add,
    addMany,
    remove,
    beginChange,
    update,
    undo,
    redo,
    clear,
  };
}
