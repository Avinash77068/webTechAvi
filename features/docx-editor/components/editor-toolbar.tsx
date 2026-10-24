"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Redo2,
  Underline,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EditorCommand } from "../hooks/use-docx-editor";

type ToolbarItem =
  | { label: string; icon: LucideIcon; command: EditorCommand }
  | { label: string; icon: LucideIcon; block: "H1" | "H2" | "P" };

const GROUPS: ToolbarItem[][] = [
  [
    { label: "Undo", icon: Undo2, command: "undo" },
    { label: "Redo", icon: Redo2, command: "redo" },
  ],
  [
    { label: "Heading 1", icon: Heading1, block: "H1" },
    { label: "Heading 2", icon: Heading2, block: "H2" },
    { label: "Paragraph", icon: Pilcrow, block: "P" },
  ],
  [
    { label: "Bold", icon: Bold, command: "bold" },
    { label: "Italic", icon: Italic, command: "italic" },
    { label: "Underline", icon: Underline, command: "underline" },
  ],
  [
    { label: "Bulleted list", icon: List, command: "insertUnorderedList" },
    { label: "Numbered list", icon: ListOrdered, command: "insertOrderedList" },
  ],
  [
    { label: "Align left", icon: AlignLeft, command: "justifyLeft" },
    { label: "Align center", icon: AlignCenter, command: "justifyCenter" },
    { label: "Align right", icon: AlignRight, command: "justifyRight" },
  ],
];

export function EditorToolbar({
  onCommand,
  onBlockType,
}: {
  onCommand: (command: EditorCommand) => void;
  onBlockType: (tag: "H1" | "H2" | "P") => void;
}) {
  return (
    <div role="toolbar" aria-label="Formatting" className="flex flex-wrap gap-x-3 gap-y-2 rounded-xl border border-border bg-muted/40 p-2">
      {GROUPS.map((group, index) => (
        <div key={index} className="flex items-center gap-1">
          {group.map((item) => (
            <Button
              key={item.label}
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label={item.label}
              title={item.label}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => ("command" in item ? onCommand(item.command) : onBlockType(item.block))}
            >
              <item.icon className="size-4" aria-hidden="true" />
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}
