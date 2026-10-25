"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SELECTOR = "nav[data-nav-dropdowns] details[open]";

export function NavDropdownCloser() {
  const pathname = usePathname();

  useEffect(() => {
    document.querySelectorAll<HTMLDetailsElement>(SELECTOR).forEach((details) => {
      details.open = false;
    });
  }, [pathname]);

  useEffect(() => {
    const closeOthers = (event: MouseEvent) => {
      const target = event.target as Element | null;
      document.querySelectorAll<HTMLDetailsElement>(SELECTOR).forEach((details) => {
        const clickedOwnSummary = target?.closest("summary")?.parentElement === details;
        if (!clickedOwnSummary) details.open = false;
      });
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      document.querySelectorAll<HTMLDetailsElement>(SELECTOR).forEach((details) => {
        details.open = false;
      });
    };

    document.addEventListener("click", closeOthers, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeOthers, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return null;
}
