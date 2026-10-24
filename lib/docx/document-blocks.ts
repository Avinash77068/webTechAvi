export type BlockAlign = "left" | "center" | "right" | "justify";

export interface TextRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface DocumentBlock {
  kind: "heading" | "paragraph" | "list-item";
  /** 1-3 for headings. */
  level?: number;
  /** For list items: numbered instead of bulleted. */
  ordered?: boolean;
  align: BlockAlign;
  runs: TextRun[];
}

const ALIGNMENTS: BlockAlign[] = ["left", "center", "right", "justify"];

type Format = Pick<TextRun, "bold" | "italic" | "underline">;

function readAlign(element: Element): BlockAlign {
  const raw = (element as HTMLElement).style?.textAlign || element.getAttribute("align") || "";
  return ALIGNMENTS.includes(raw as BlockAlign) ? (raw as BlockAlign) : "left";
}

function collectNodeRuns(node: Node, format: Format, runs: TextRun[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    if (text) runs.push({ text, ...format });
    return;
  }
  if (!(node instanceof HTMLElement)) return;
  const tag = node.tagName.toLowerCase();
  if (tag === "br") {
    runs.push({ text: "\n", ...format });
    return;
  }
  if (tag === "script" || tag === "style") return;
  const next: Format = {
    bold: format.bold || tag === "b" || tag === "strong" || node.style.fontWeight === "bold",
    italic: format.italic || tag === "i" || tag === "em" || node.style.fontStyle === "italic",
    underline: format.underline || tag === "u" || node.style.textDecoration.includes("underline"),
  };
  collectRuns(node, next, runs);
}

function collectRuns(node: Node, format: Format, runs: TextRun[]) {
  node.childNodes.forEach((child) => collectNodeRuns(child, format, runs));
}

function hasContent(runs: TextRun[]) {
  return runs.some((run) => run.text.trim().length > 0);
}

function blocksFromContainer(container: Element, blocks: DocumentBlock[]) {
  let inlineRuns: TextRun[] = [];

  const flushInline = () => {
    if (hasContent(inlineRuns)) blocks.push({ kind: "paragraph", align: "left", runs: inlineRuns });
    inlineRuns = [];
  };

  container.childNodes.forEach((child) => {
    if (!(child instanceof HTMLElement)) {
      collectNodeRuns(child, {}, inlineRuns);
      return;
    }
    const tag = child.tagName.toLowerCase();

    if (/^h[1-6]$/.test(tag)) {
      flushInline();
      const runs: TextRun[] = [];
      collectRuns(child, {}, runs);
      blocks.push({ kind: "heading", level: Math.min(Number(tag[1]), 3), align: readAlign(child), runs });
    } else if (tag === "ul" || tag === "ol") {
      flushInline();
      child.querySelectorAll(":scope > li").forEach((item) => {
        const runs: TextRun[] = [];
        collectRuns(item, {}, runs);
        blocks.push({ kind: "list-item", ordered: tag === "ol", align: readAlign(item), runs });
      });
    } else if (tag === "div" && child.querySelector("p, div, ul, ol, h1, h2, h3, h4, h5, h6")) {
      flushInline();
      blocksFromContainer(child, blocks);
    } else if (tag === "p" || tag === "div") {
      flushInline();
      const runs: TextRun[] = [];
      collectRuns(child, {}, runs);
      blocks.push({ kind: "paragraph", align: readAlign(child), runs });
    } else {
      collectNodeRuns(child, {}, inlineRuns);
    }
  });
  flushInline();
}

/** Reads editor or mammoth HTML into plain data, dropping anything that isn't simple text formatting. */
export function parseHtmlToBlocks(html: string): DocumentBlock[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: DocumentBlock[] = [];
  blocksFromContainer(doc.body, blocks);
  return blocks;
}

function createRunNode(run: TextRun): Node {
  let node: Node = document.createTextNode(run.text);
  const wrap = (tag: string) => {
    const element = document.createElement(tag);
    element.appendChild(node);
    node = element;
  };
  if (run.bold) wrap("strong");
  if (run.italic) wrap("em");
  if (run.underline) wrap("u");
  return node;
}

function appendRuns(parent: HTMLElement, runs: TextRun[]) {
  for (const run of runs) {
    if (run.text === "\n") parent.appendChild(document.createElement("br"));
    else parent.appendChild(createRunNode(run));
  }
}

/** Builds safe editor HTML from blocks using DOM text nodes only, so file contents are never parsed as markup. */
export function blocksToHtml(blocks: DocumentBlock[]): string {
  const container = document.createElement("div");
  let list: HTMLElement | null = null;

  for (const block of blocks) {
    let element: HTMLElement;
    if (block.kind === "list-item") {
      const tag = block.ordered ? "ol" : "ul";
      if (!list || list.tagName.toLowerCase() !== tag) {
        list = document.createElement(tag);
        container.appendChild(list);
      }
      element = document.createElement("li");
      list.appendChild(element);
    } else {
      list = null;
      element = document.createElement(block.kind === "heading" ? `h${block.level ?? 1}` : "p");
      container.appendChild(element);
    }
    if (block.align !== "left") element.style.textAlign = block.align;
    appendRuns(element, block.runs);
  }
  return container.innerHTML;
}
