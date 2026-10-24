import type { LucideIcon } from "lucide-react";
import {
  ArrowUpDown,
  AudioLines,
  Combine,
  Crop,
  FileArchive,
  FileOutput,
  FileSearch,
  FileText,
  FileType,
  Film,
  Images,
  Maximize2,
  Minimize2,
  PenTool,
  RefreshCw,
  ScanText,
  Scissors,
  SplitSquareHorizontal,
  Table,
  Type,
  Video,
} from "lucide-react";

export type ToolCategory = "image" | "pdf" | "document" | "video-audio";
export type ToolStatus = "available" | "coming-soon";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  status: ToolStatus;
  acceptedFormats: string[];
  maxFileSizeMB: number;
  keywords: string[];
  privacyNote: string;
  faqs: ToolFaq[];
  relatedSlugs: string[];
  popular?: boolean;
}

export const categoryMeta: Record<
  ToolCategory,
  { label: string; description: string }
> = {
  image: {
    label: "Image Tools",
    description: "Compress, resize, convert, crop and extract text from images.",
  },
  pdf: {
    label: "PDF Tools",
    description: "Merge, split, organize, edit, compress and convert PDF files.",
  },
  document: {
    label: "Document Tools",
    description: "Edit DOCX, TXT and CSV files, and convert between formats.",
  },
  "video-audio": {
    label: "Video & Audio",
    description: "Trim, convert and extract audio from your local video files.",
  },
};

export const tools: ToolDefinition[] = [
  // ---------------- IMAGE ----------------
  {
    slug: "image-compressor",
    name: "Image Compressor",
    shortDescription: "Shrink JPG, PNG and WebP files without losing much quality.",
    description:
      "Reduce the file size of your JPG, PNG and WebP images right in your browser. Adjust the quality and output format, compare the before and after file size, and download the result.",
    category: "image",
    icon: Minimize2,
    status: "available",
    acceptedFormats: ["JPEG", "PNG", "WebP"],
    maxFileSizeMB: 25,
    keywords: ["compress image", "reduce image size", "shrink photo", "jpg compressor"],
    privacyNote:
      "Your images are compressed entirely on your device using the browser's Canvas API. Nothing is uploaded to a server.",
    faqs: [
      {
        question: "Will compressing reduce image quality?",
        answer:
          "Some quality loss is expected with JPEG and WebP because they use lossy compression — that's how the file size shrinks. Use the quality slider and the before/after preview to find a balance you're happy with. PNG compression here is also lossy when you reduce quality or switch format; for pixel-perfect lossless PNGs, keep quality at maximum.",
      },
      {
        question: "Can I compress multiple images at once?",
        answer: "Yes. Add multiple files and each one is processed and can be downloaded individually.",
      },
      {
        question: "What is the maximum file size supported?",
        answer:
          "Files up to 25 MB each are supported. Very large images may take longer to process depending on your device's performance, since everything runs in your browser.",
      },
    ],
    relatedSlugs: ["image-resizer", "image-converter", "image-to-pdf"],
    popular: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    shortDescription: "Resize images by exact dimensions or percentage.",
    description:
      "Change the width and height of your images, keep the aspect ratio locked, or resize by percentage using common presets. Preview the result before downloading.",
    category: "image",
    icon: Maximize2,
    status: "available",
    acceptedFormats: ["JPEG", "PNG", "WebP"],
    maxFileSizeMB: 25,
    keywords: ["resize image", "change image dimensions", "scale photo"],
    privacyNote:
      "Resizing happens locally in your browser using the Canvas API. Your images are never uploaded.",
    faqs: [
      {
        question: "Does resizing reduce quality?",
        answer:
          "Scaling down generally preserves clarity well. Scaling up (enlarging) an image beyond its original resolution cannot add real detail and may look softer or blurry.",
      },
      {
        question: "Can I resize without distorting the image?",
        answer:
          "Yes — turn on \"Maintain aspect ratio\" and the height will update automatically when you change the width, and vice versa.",
      },
    ],
    relatedSlugs: ["image-compressor", "image-cropper", "image-converter"],
    popular: true,
  },
  {
    slug: "image-converter",
    name: "Image Format Converter",
    shortDescription: "Convert between JPEG, PNG and WebP.",
    description:
      "Convert images between JPEG, PNG and WebP formats directly in your browser. Preview the converted file before downloading it.",
    category: "image",
    icon: RefreshCw,
    status: "available",
    acceptedFormats: ["JPEG", "PNG", "WebP"],
    maxFileSizeMB: 25,
    keywords: ["convert image", "jpg to png", "png to webp", "webp to jpg"],
    privacyNote: "Conversion runs locally using the Canvas API. No files leave your device.",
    faqs: [
      {
        question: "Can this tool convert HEIC photos from an iPhone?",
        answer:
          "Most browsers cannot decode HEIC files through the standard Canvas API, so HEIC input isn't reliably supported here. If your file doesn't load, convert it to JPEG on your device first (for example, by re-exporting or sharing it), then use this tool.",
      },
      {
        question: "Does converting to JPEG support transparency?",
        answer:
          "No. JPEG does not support transparent pixels — any transparent areas will be filled with white. Use PNG or WebP if you need to keep transparency.",
      },
    ],
    relatedSlugs: ["image-compressor", "image-resizer", "image-to-pdf"],
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    shortDescription: "Crop, rotate and straighten your images.",
    description:
      "Select the exact area you want to keep using interactive crop handles, choose a common aspect ratio, rotate the image, and export the cropped result.",
    category: "image",
    icon: Crop,
    status: "available",
    acceptedFormats: ["JPEG", "PNG", "WebP"],
    maxFileSizeMB: 25,
    keywords: ["crop image", "rotate photo", "aspect ratio crop"],
    privacyNote: "Cropping happens locally in your browser. Nothing is uploaded.",
    faqs: [
      {
        question: "Can I crop to a specific aspect ratio like 1:1 or 16:9?",
        answer:
          "Yes, pick one of the aspect ratio presets, or leave it free-form to drag a crop box of any shape.",
      },
      {
        question: "Can I rotate the image before cropping?",
        answer: "Yes, use the rotate buttons to rotate in 90° steps before or after selecting your crop area.",
      },
    ],
    relatedSlugs: ["image-compressor", "image-resizer", "image-to-pdf"],
  },
  {
    slug: "image-to-text",
    name: "Image to Text (OCR)",
    shortDescription: "Extract text from images using on-device OCR.",
    description:
      "Upload a photo or screenshot containing text and extract it using Tesseract.js, an open-source OCR engine that runs entirely in your browser. Supports English and Hindi.",
    category: "image",
    icon: ScanText,
    status: "available",
    acceptedFormats: ["JPEG", "PNG", "WebP", "BMP"],
    maxFileSizeMB: 20,
    keywords: ["image to text", "ocr online", "extract text from image", "hindi ocr"],
    privacyNote:
      "OCR runs fully on your device using Tesseract.js (WebAssembly). The language model is downloaded once and cached; your image is never uploaded.",
    faqs: [
      {
        question: "How accurate is the text extraction?",
        answer:
          "Accuracy depends heavily on image quality, lighting, resolution and font. Clean, high-contrast, horizontally aligned printed text works best. Handwriting, low-resolution photos, skewed angles and busy backgrounds will reduce accuracy — always review the extracted text before using it.",
      },
      {
        question: "Which languages are supported?",
        answer:
          "English and Hindi language models are available in this tool. Other languages are not supported, and we don't claim accuracy for languages or scripts not listed here.",
      },
      {
        question: "Why is the first recognition slow?",
        answer:
          "The first time you run OCR, your browser downloads the selected language's model data. It's cached afterwards, so later runs on the same device are faster.",
      },
    ],
    relatedSlugs: ["image-to-pdf", "image-cropper"],
    popular: true,
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    shortDescription: "Combine one or more images into a single PDF.",
    description:
      "Upload multiple images, arrange their order, choose a page size and orientation, and generate a real, downloadable PDF — all without leaving your browser.",
    category: "image",
    icon: FileOutput,
    status: "available",
    acceptedFormats: ["JPEG", "PNG", "WebP"],
    maxFileSizeMB: 25,
    keywords: ["image to pdf", "jpg to pdf", "photos to pdf", "convert images to pdf"],
    privacyNote: "Your PDF is generated locally using pdf-lib. Images are never uploaded to a server.",
    faqs: [
      {
        question: "Can I reorder the images before creating the PDF?",
        answer: "Yes, drag images to reorder them — the PDF pages follow the order shown on screen.",
      },
      {
        question: "Can I control the page size?",
        answer:
          "Yes, choose A4, Letter, or \"Fit to image\" (a page sized to match each image) and portrait or landscape orientation.",
      },
    ],
    relatedSlugs: ["image-compressor", "image-cropper", "merge-pdf"],
    popular: true,
  },

  // ---------------- PDF ----------------
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    shortDescription: "Combine multiple PDF files into one document.",
    description: "Upload multiple PDF files, reorder them, and merge them into a single downloadable PDF.",
    category: "pdf",
    icon: Combine,
    status: "available",
    acceptedFormats: ["PDF"],
    maxFileSizeMB: 50,
    keywords: ["merge pdf", "combine pdf files"],
    privacyNote: "Merging runs locally using pdf-lib. Your files are never uploaded to a server.",
    faqs: [
      {
        question: "Does merging preserve the original page quality?",
        answer:
          "Yes — pages are copied directly from your source PDFs rather than re-rendered, so text stays selectable and images keep their original resolution.",
      },
      {
        question: "Can I reorder the files before merging?",
        answer: "Yes, use the up/down arrows to set the order the PDFs will appear in the merged file.",
      },
      {
        question: "Will this work on password-protected PDFs?",
        answer: "No — encrypted or password-protected PDFs aren't supported. Remove the password first using the PDF's original source application.",
      },
    ],
    relatedSlugs: ["split-pdf", "organize-pdf"],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    shortDescription: "Extract specific pages or page ranges from a PDF.",
    description: "Select the pages you want from a PDF and export them as a new document, or as separate files.",
    category: "pdf",
    icon: SplitSquareHorizontal,
    status: "available",
    acceptedFormats: ["PDF"],
    maxFileSizeMB: 50,
    keywords: ["split pdf", "extract pdf pages"],
    privacyNote: "Splitting runs locally using pdf-lib and PDF.js for page previews. Nothing is uploaded to a server.",
    faqs: [
      {
        question: "Can I pick individual, non-consecutive pages?",
        answer: "Yes — click any page thumbnails to select them in any combination, not just a single continuous range.",
      },
      {
        question: "What's the difference between the two export modes?",
        answer:
          "\"One PDF\" combines every page you selected into a single new document in the order shown. \"Separate files\" exports each selected page as its own one-page PDF, downloaded together as a ZIP.",
      },
    ],
    relatedSlugs: ["merge-pdf", "organize-pdf"],
  },
  {
    slug: "organize-pdf",
    name: "Rotate & Organize PDF Pages",
    shortDescription: "Reorder, rotate or remove pages from a PDF.",
    description: "View page thumbnails, rotate, remove or reorder pages, then export the modified PDF.",
    category: "pdf",
    icon: ArrowUpDown,
    status: "available",
    acceptedFormats: ["PDF"],
    maxFileSizeMB: 50,
    keywords: ["organize pdf pages", "rotate pdf", "reorder pdf pages"],
    privacyNote: "Page organization runs locally using pdf-lib and PDF.js for previews.",
    faqs: [
      {
        question: "Does rotating a page affect its content quality?",
        answer: "No — rotation is a page-level property in the PDF, not a re-render, so there's no quality loss.",
      },
      {
        question: "Can I remove pages entirely?",
        answer: "Yes, click the remove button on any page thumbnail. The exported PDF only includes the pages you kept.",
      },
    ],
    relatedSlugs: ["merge-pdf", "split-pdf"],
  },
  {
    slug: "pdf-editor",
    name: "PDF Editor & Signature",
    shortDescription: "Add text, draw a signature and place overlays on a PDF.",
    description: "Add text boxes, draw a signature, and place overlays on top of your PDF pages, then export.",
    category: "pdf",
    icon: PenTool,
    status: "available",
    acceptedFormats: ["PDF"],
    maxFileSizeMB: 50,
    keywords: ["edit pdf", "sign pdf", "pdf signature"],
    privacyNote:
      "Editing runs locally using pdf-lib and PDF.js. Overlays are added on top of the page, not merged into existing text.",
    faqs: [
      {
        question: "Does this edit the PDF's existing text?",
        answer:
          "No. This tool adds new text and signature overlays on top of the page — it doesn't let you select, edit, or delete the PDF's existing embedded text or images.",
      },
      {
        question: "How does the signature work?",
        answer: "Draw your signature with your mouse or finger in the signature pad, then click on a page to place it. You can remove or undo it before exporting.",
      },
      {
        question: "Can I undo a mistake?",
        answer: "Yes — use \"Undo last\" to remove the most recently placed overlay, or remove individual overlays from the list below the page.",
      },
    ],
    relatedSlugs: ["organize-pdf", "merge-pdf"],
  },
  {
    slug: "compress-pdf",
    name: "PDF Compressor",
    shortDescription: "Reduce PDF file size by rebuilding pages as compressed images.",
    description:
      "Shrink a PDF by rendering each page to a compressed JPEG and rebuilding the document from those images.",
    category: "pdf",
    icon: FileArchive,
    status: "available",
    acceptedFormats: ["PDF"],
    maxFileSizeMB: 50,
    keywords: ["compress pdf", "reduce pdf size"],
    privacyNote: "Compression runs locally using PDF.js and pdf-lib. We never claim a smaller file if the output is actually larger.",
    faqs: [
      {
        question: "Will this keep my PDF's text selectable?",
        answer:
          "No — this is an honest trade-off, not a bug. This tool rasterizes each page into an image to shrink the file, which means the result loses selectable text, search, and accessibility tags. It's best for scanned documents or photo-heavy PDFs where that doesn't matter.",
      },
      {
        question: "What if the compressed file is bigger than the original?",
        answer:
          "This can happen for text-heavy PDFs, since rasterized images are sometimes larger than efficiently encoded text. We show you the exact before/after size so you can decide — we never hide a size increase.",
      },
      {
        question: "What does the quality setting control?",
        answer: "It sets the JPEG quality and resolution scale used to re-render each page — lower values produce a smaller file with more visible compression artifacts.",
      },
    ],
    relatedSlugs: ["merge-pdf", "pdf-to-images"],
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images",
    shortDescription: "Export PDF pages as JPG or PNG images.",
    description: "Render PDF pages using PDF.js and export the pages you select as JPG or PNG images.",
    category: "pdf",
    icon: Images,
    status: "available",
    acceptedFormats: ["PDF"],
    maxFileSizeMB: 50,
    keywords: ["pdf to jpg", "pdf to png", "pdf page to image"],
    privacyNote: "Rendering runs locally using PDF.js. Nothing is uploaded to a server.",
    faqs: [
      {
        question: "Can I export only some pages?",
        answer: "Yes, click page thumbnails to select exactly the ones you want, or use \"Select all.\"",
      },
      {
        question: "Can I download everything at once?",
        answer: "Yes — \"Download all as ZIP\" packages every selected page's image into one ZIP file, or download each one individually.",
      },
    ],
    relatedSlugs: ["image-to-pdf", "pdf-text-extractor"],
  },
  {
    slug: "pdf-text-extractor",
    name: "PDF Text Extractor / OCR",
    shortDescription: "Extract embedded or scanned text from a PDF.",
    description:
      "Extract selectable text from text-based PDFs directly, or run OCR on scanned pages that contain no embedded text.",
    category: "pdf",
    icon: FileSearch,
    status: "available",
    acceptedFormats: ["PDF"],
    maxFileSizeMB: 50,
    keywords: ["pdf to text", "pdf ocr", "extract text from pdf"],
    privacyNote: "Extraction and OCR run locally using PDF.js and Tesseract.js.",
    faqs: [
      {
        question: "How can you tell whether to use OCR or direct extraction?",
        answer:
          "For each page you select, this tool first tries pdf.js's embedded text extraction. If a page returns little or no text (a strong sign it's a scanned image), it automatically falls back to running OCR on that page instead, and labels which method was used.",
      },
      {
        question: "Is OCR as reliable as embedded text extraction?",
        answer:
          "No — embedded text extraction is exact, since it reads text the PDF already contains. OCR is an estimate and can make mistakes, especially on low-resolution scans — always review OCR'd pages before relying on them.",
      },
    ],
    relatedSlugs: ["pdf-to-images", "image-to-text"],
  },

  // ---------------- DOCUMENT ----------------
  {
    slug: "docx-editor",
    name: "DOCX Document Editor",
    shortDescription: "Write and edit documents, export as DOCX.",
    description: "A rich-text editor with headings, bold, italic, lists and alignment. Export a real DOCX file.",
    category: "document",
    icon: FileText,
    status: "coming-soon",
    acceptedFormats: ["DOCX"],
    maxFileSizeMB: 20,
    keywords: ["docx editor", "word editor online"],
    privacyNote: "Editing will run locally. Complex formatting, tables and headers may not round-trip perfectly.",
    faqs: [],
    relatedSlugs: ["word-to-pdf", "txt-editor"],
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    shortDescription: "Convert DOCX content into a PDF.",
    description: "Convert supported DOCX content into a PDF while preserving common formatting where feasible.",
    category: "document",
    icon: FileType,
    status: "coming-soon",
    acceptedFormats: ["DOCX"],
    maxFileSizeMB: 20,
    keywords: ["word to pdf", "docx to pdf"],
    privacyNote: "Conversion will run locally. Complex Word layouts may not be fully preserved.",
    faqs: [],
    relatedSlugs: ["docx-editor", "merge-pdf"],
  },
  {
    slug: "txt-editor",
    name: "TXT Editor",
    shortDescription: "Open, edit and download plain text files.",
    description: "Open or paste plain text, edit, search, clear, copy and download. Full Unicode and Hindi support.",
    category: "document",
    icon: Type,
    status: "coming-soon",
    acceptedFormats: ["TXT"],
    maxFileSizeMB: 10,
    keywords: ["text editor online", "txt editor"],
    privacyNote: "Everything happens locally in your browser.",
    faqs: [],
    relatedSlugs: ["image-to-text", "csv-editor"],
  },
  {
    slug: "csv-editor",
    name: "CSV Viewer and Editor",
    shortDescription: "View and edit CSV files in a spreadsheet-like table.",
    description: "Upload a CSV, edit it in a table, add or remove rows and columns, and export a correctly escaped CSV.",
    category: "document",
    icon: Table,
    status: "coming-soon",
    acceptedFormats: ["CSV"],
    maxFileSizeMB: 20,
    keywords: ["csv editor", "csv viewer online"],
    privacyNote: "Parsing and editing run locally in your browser.",
    faqs: [],
    relatedSlugs: ["txt-editor"],
  },

  // ---------------- VIDEO & AUDIO ----------------
  {
    slug: "video-trimmer",
    name: "Video Trimmer",
    shortDescription: "Trim a video to a specific start and end time.",
    description: "Preview a local video, select the start and end times, and export the trimmed result.",
    category: "video-audio",
    icon: Scissors,
    status: "available",
    acceptedFormats: ["MP4", "WebM"],
    maxFileSizeMB: 300,
    keywords: ["trim video online", "cut video"],
    privacyNote: "Processing runs locally using ffmpeg.wasm. Large files can be slow and memory-intensive.",
    faqs: [
      {
        question: "Why is trimming sometimes slightly off?",
        answer:
          "By default the clip is cut without re-encoding, which is very fast but can only start on a keyframe. Turn on \"Frame-accurate\" to re-encode the video for an exact cut, at the cost of speed.",
      },
      {
        question: "Is my video uploaded anywhere?",
        answer:
          "No. ffmpeg runs inside your browser, so the video never leaves your device. The ffmpeg engine itself (about 30 MB) is downloaded the first time you use a video tool.",
      },
      {
        question: "What file sizes work best?",
        answer:
          "Everything is held in your device's memory, so short clips and files under a few hundred MB work best. Very large files may fail on low-memory devices.",
      },
    ],
    relatedSlugs: ["video-converter", "audio-extractor"],
  },
  {
    slug: "video-converter",
    name: "Video Converter & Compressor",
    shortDescription: "Convert and compress video files in your browser.",
    description: "Convert between supported video formats and compress file size with quality controls.",
    category: "video-audio",
    icon: Video,
    status: "available",
    acceptedFormats: ["MP4", "WebM"],
    maxFileSizeMB: 300,
    keywords: ["video converter online", "compress video"],
    privacyNote: "Processing runs locally using ffmpeg.wasm and can be CPU and memory intensive.",
    faqs: [
      {
        question: "How do I make a video smaller?",
        answer:
          "Choose \"Smallest file\" quality and a lower resolution such as 480p. Lower resolution has the biggest effect on file size.",
      },
      {
        question: "Why is conversion slow?",
        answer:
          "The video is re-encoded on your own device with a single-threaded browser build of ffmpeg, so long or high-resolution videos can take several minutes.",
      },
      {
        question: "Which formats are supported?",
        answer: "You can convert MP4 and WebM videos to either MP4 (H.264) or WebM (VP8).",
      },
    ],
    relatedSlugs: ["video-trimmer", "audio-extractor"],
  },
  {
    slug: "audio-extractor",
    name: "Audio Extractor",
    shortDescription: "Extract the audio track from a video file.",
    description: "Extract the audio track from a local video file and download it in a supported format.",
    category: "video-audio",
    icon: AudioLines,
    status: "available",
    acceptedFormats: ["MP4", "WebM"],
    maxFileSizeMB: 300,
    keywords: ["extract audio from video", "video to mp3"],
    privacyNote: "Processing runs locally using ffmpeg.wasm.",
    faqs: [
      {
        question: "Which audio formats can I export?",
        answer: "MP3 and M4A (AAC) at 192 kbps, or lossless WAV, which is much larger.",
      },
      {
        question: "What if the video has no sound?",
        answer: "The tool will report an error because there is no audio track to extract.",
      },
      {
        question: "Is my video uploaded anywhere?",
        answer: "No. The audio is extracted in your browser using ffmpeg.wasm and never leaves your device.",
      },
    ],
    relatedSlugs: ["video-trimmer", "video-converter"],
  },
  {
    slug: "youtube-thumbnail",
    name: "YouTube Thumbnail Viewer",
    shortDescription: "View and download thumbnails from any YouTube video URL.",
    description:
      "Paste a YouTube video URL or ID to view its available thumbnail resolutions and open or download them.",
    category: "video-audio",
    icon: Film,
    status: "available",
    acceptedFormats: ["YouTube URL or video ID"],
    maxFileSizeMB: 0,
    keywords: ["youtube thumbnail downloader", "youtube thumbnail viewer"],
    privacyNote:
      "This tool only parses the URL you paste and links to thumbnail images already published by YouTube. No video is downloaded and nothing is uploaded.",
    faqs: [
      {
        question: "Which URL formats are supported?",
        answer:
          "Standard watch URLs (youtube.com/watch?v=...), short youtu.be links, Shorts URLs, embed URLs, and a bare 11-character video ID are all supported.",
      },
      {
        question: "Why is the highest resolution thumbnail missing?",
        answer:
          "Not every video has a maxresdefault (1280×720) thumbnail generated by YouTube. When it's unavailable, use one of the other available resolutions shown.",
      },
      {
        question: "Can I download thumbnails for any video?",
        answer:
          "This tool links to the thumbnail images YouTube already serves publicly for a video. It does not download or convert the video itself, and availability still depends on YouTube.",
      },
    ],
    relatedSlugs: ["video-trimmer"],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getAvailableTools(): ToolDefinition[] {
  return tools.filter((tool) => tool.status === "available");
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter((tool) => tool.category === category);
}

export function getPopularTools(): ToolDefinition[] {
  return tools.filter((tool) => tool.popular);
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  return tool.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => !!t && t.status === "available");
}
