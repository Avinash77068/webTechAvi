"use client";

import { useEffect, useState } from "react";

/** Creates an object URL for a file and revokes it when the file changes or the component unmounts. */
export function useObjectUrl(file: Blob | null): string | null {
  const [entry, setEntry] = useState<{ file: Blob; url: string } | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- object URLs must be created after mount and revoked on cleanup
    setEntry({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return entry && entry.file === file ? entry.url : null;
}
