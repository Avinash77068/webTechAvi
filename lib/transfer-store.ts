/**
 * In-memory handoff for "send to another tool" actions. Deliberately not persisted to
 * localStorage/sessionStorage — files can be large, and this only needs to survive a
 * single client-side navigation within the same browser tab.
 */
export interface ToolTransferPayload {
  fromTool: string;
  toTool: string;
  files: File[];
}

let pending: ToolTransferPayload | null = null;

export function setToolTransfer(payload: ToolTransferPayload): void {
  pending = payload;
}

/** Consumes the pending transfer if it targets `toTool`. Clears it either way once read. */
export function consumeToolTransfer(toTool: string): ToolTransferPayload | null {
  if (!pending || pending.toTool !== toTool) return null;
  const result = pending;
  pending = null;
  return result;
}

export function peekToolTransfer(): ToolTransferPayload | null {
  return pending;
}
