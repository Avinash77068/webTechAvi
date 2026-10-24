export type EditorTool = "select" | "text" | "signature" | "image" | "highlight" | "cover";

export interface PageSize {
  /** Page size in PDF points, as displayed (rotation applied). */
  width: number;
  height: number;
}
