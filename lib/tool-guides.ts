export interface ToolGuide {
  about: string[];
  useCases: string[];
  tips: string[];
}

export const toolGuides: Record<string, ToolGuide> = {
  "image-compressor": {
    about: [
      "Large photos slow down websites, fill up email attachments and eat into storage. The Image Compressor shrinks JPG, PNG and WebP files by re-encoding them at a quality level you choose, so you can see exactly how much space you save before you download anything.",
      "Compression happens in your browser using the Canvas API, which means your pictures stay on your device. You can process several images in one go and compare the before and after size for each one.",
    ],
    useCases: [
      "Preparing product photos and blog images for faster page loads",
      "Getting a photo under an upload size limit on a government or job portal",
      "Shrinking screenshots before sending them by email or chat",
      "Freeing up space by compressing old photo archives",
    ],
    tips: [
      "A quality setting between 70% and 85% usually gives a big size reduction with little visible change.",
      "Photos compress best as JPG or WebP; flat graphics and logos often stay sharper as PNG.",
      "Compress the final version only. Re-compressing an already compressed JPG degrades it further.",
    ],
  },
  "image-resizer": {
    about: [
      "Different places expect different image sizes: a social media avatar, an email signature, a form that demands exactly 600 by 800 pixels. The Image Resizer lets you set exact pixel dimensions or scale by percentage while keeping the aspect ratio locked, so nothing looks stretched.",
      "Everything runs locally in your browser, so you can resize private photos and documents without uploading them anywhere.",
    ],
    useCases: [
      "Meeting exact pixel requirements for application and ID photo uploads",
      "Scaling large camera photos down for the web",
      "Creating consistent thumbnails for a catalogue or gallery",
      "Making images smaller so they open quickly on mobile",
    ],
    tips: [
      "Keep the aspect ratio lock on unless you really need a different shape; use the Image Cropper to change the shape cleanly.",
      "Scaling down keeps images sharp. Enlarging cannot add detail and will look soft.",
      "Resize first, then compress, to get the smallest file.",
    ],
  },
  "image-converter": {
    about: [
      "Not every app or website accepts every image format. The Image Converter changes images between JPG, PNG and WebP so you can use them wherever you need. WebP is often much smaller than JPG at similar quality, while PNG keeps transparency and sharp edges.",
      "Conversion is done on your device with no upload, and you can convert multiple files at once.",
    ],
    useCases: [
      "Converting PNG screenshots to smaller JPG or WebP files",
      "Turning WebP downloads into JPG for software that does not support WebP",
      "Switching logos to PNG to keep a transparent background",
      "Standardising a folder of mixed images into one format",
    ],
    tips: [
      "JPG does not support transparency; transparent areas become a solid background when converting from PNG.",
      "Choose WebP for websites where file size matters and your audience uses modern browsers.",
      "Converting between lossy formats repeatedly lowers quality, so keep your original file.",
    ],
  },
  "image-cropper": {
    about: [
      "Cropping removes the parts of a picture you do not need and helps you frame the subject. The Image Cropper lets you drag a selection over your image, choose common aspect ratios such as square or 16:9, and download exactly the area you selected.",
      "The crop is made in your browser, so the original file is never sent to a server.",
    ],
    useCases: [
      "Making square profile pictures for social accounts",
      "Cutting out the relevant part of a screenshot",
      "Framing product photos to a consistent ratio",
      "Trimming borders and empty space from scanned pages",
    ],
    tips: [
      "Pick the target aspect ratio first, then position the crop box around your subject.",
      "Leave a little breathing room around faces and products rather than cropping too tight.",
      "Crop before resizing so you do not lose resolution on the part you keep.",
    ],
  },
  "image-rotator": {
    about: [
      "Photos taken on phones and scanners sometimes come out sideways or upside down. The Image Rotator turns an image by 90 degrees in either direction or flips it horizontally or vertically, and lets you download the corrected version.",
      "Processing happens locally in your browser, so you can fix personal photos and scans privately.",
    ],
    useCases: [
      "Fixing sideways photos from a phone or camera",
      "Straightening scanned documents before turning them into a PDF",
      "Mirroring an image for a design or print layout",
      "Correcting images that display the wrong way on a website",
    ],
    tips: [
      "Use flip, not rotate, when you want a mirror image.",
      "Rotate by 90 degrees steps; for small tilt corrections use the Photo Editor instead.",
      "Rotate before cropping so the crop box matches the final orientation.",
    ],
  },
  "image-to-text": {
    about: [
      "Optical character recognition (OCR) reads the text inside a picture so you can copy and edit it instead of retyping. The Image to Text tool detects the words in a photo or screenshot and gives you plain text you can copy or download.",
      "Recognition runs in your browser, so documents such as receipts, notes and ID copies are not uploaded to a server.",
    ],
    useCases: [
      "Copying text out of screenshots and photographed pages",
      "Digitising printed notes, receipts and handouts",
      "Extracting quotes from book or magazine photos",
      "Making text from an image searchable and editable",
    ],
    tips: [
      "Use a sharp, well-lit, straight-on photo; blur and shadows are the main cause of mistakes.",
      "Printed text is recognised far more accurately than handwriting.",
      "Always proofread the result, especially numbers, names and punctuation.",
    ],
  },
  "photo-editor": {
    about: [
      "The Photo Editor covers the quick fixes most pictures need: brightness, contrast, saturation and similar adjustments, so you can improve a photo without installing software or creating an account.",
      "Edits are applied in your browser and the finished image is downloaded straight to your device. Your original file is never modified or uploaded.",
    ],
    useCases: [
      "Brightening photos that came out too dark",
      "Adding contrast and colour to flat-looking images",
      "Preparing pictures for a profile, listing or post",
      "Making quick touch-ups before sharing",
    ],
    tips: [
      "Make small adjustments; a few points of change usually looks more natural than large ones.",
      "Adjust brightness before contrast and saturation.",
      "Keep your original photo so you can start over if you overdo it.",
    ],
  },
  "signature-maker": {
    about: [
      "A digital signature image is handy for signing forms, contracts and letters without printing them. The Signature Maker lets you draw or create your signature and download it as an image with a transparent background that you can place on documents.",
      "Your signature is created locally in your browser and is not stored or uploaded.",
    ],
    useCases: [
      "Signing PDFs and Word documents electronically",
      "Adding a signature to emails, letters and invoices",
      "Creating a reusable signature file for forms",
      "Avoiding the print, sign and scan routine",
    ],
    tips: [
      "Draw slowly and a little larger than you think you need; you can scale it down later.",
      "Download as PNG to keep the transparent background.",
      "Keep your signature file private, since anyone with it can paste it into a document.",
    ],
  },
  "image-to-pdf": {
    about: [
      "Sending ten separate photos is awkward; one PDF is not. The Image to PDF tool combines JPG, PNG and WebP images into a single PDF, with each image on its own page, in the order you choose.",
      "The PDF is built in your browser, so your scans and photos never leave your device.",
    ],
    useCases: [
      "Combining photographed pages into one document",
      "Submitting scanned certificates and ID proofs as a single file",
      "Building a PDF portfolio or photo album",
      "Turning receipts into one file for expense claims",
    ],
    tips: [
      "Arrange the images in the right order before you create the PDF.",
      "Straighten and crop scans first so pages look clean.",
      "If the PDF is too big for an upload limit, run it through the PDF compressor.",
    ],
  },
  "merge-pdf": {
    about: [
      "Merging PDFs joins several files into one document in the order you set. It is useful whenever a report, application or invoice set arrives in separate pieces but has to be sent as one.",
      "Merging happens in your browser, so sensitive contracts and records are not uploaded to any server.",
    ],
    useCases: [
      "Combining application forms with supporting documents",
      "Joining monthly invoices or statements",
      "Assembling chapters or sections into one report",
      "Packaging documents for a single email attachment",
    ],
    tips: [
      "Reorder the files before merging; fixing order afterwards takes extra steps.",
      "Name your files in the order you want them to appear.",
      "Password-protected PDFs need to be unlocked before they can be merged.",
    ],
  },
  "split-pdf": {
    about: [
      "Split PDF pulls pages out of a larger document. You can extract a page range or separate a document into smaller files, which is handy when you only need to share part of a long PDF.",
      "The file is processed locally in your browser, so private documents stay on your device.",
    ],
    useCases: [
      "Sending only the relevant pages of a long report",
      "Separating a scanned bundle into individual documents",
      "Extracting a single form from a combined file",
      "Reducing file size by removing pages you do not need",
    ],
    tips: [
      "Check the page numbers in your PDF viewer first, since printed page numbers can differ from PDF page numbers.",
      "Use ranges such as 1-3, 7 to pick several parts at once.",
      "Keep the original file in case you need the pages you removed.",
    ],
  },
  "organize-pdf": {
    about: [
      "Organize PDF lets you rearrange, rotate and delete pages in a document without recreating it. Drag pages into the right order, turn sideways scans upright and remove blank or unwanted pages.",
      "Edits are made in your browser and the updated PDF is saved to your device, with nothing uploaded.",
    ],
    useCases: [
      "Fixing the page order of a scanned document",
      "Rotating pages that were scanned sideways",
      "Deleting blank pages and duplicates",
      "Tidying a PDF before sharing it",
    ],
    tips: [
      "Look at page thumbnails carefully before deleting; removed pages cannot be recovered from the saved file.",
      "Rotate only the pages that need it rather than the entire document.",
      "Download the result under a new name so your original stays untouched.",
    ],
  },
  "pdf-editor": {
    about: [
      "The PDF Editor lets you add text, drawings and signatures on top of an existing PDF. It suits quick jobs such as filling in a form, annotating a document or marking up a draft without opening a heavy desktop application.",
      "Everything happens in your browser and the edited file is saved to your device, so your documents are not uploaded.",
    ],
    useCases: [
      "Filling in printed-style forms that are not interactive",
      "Adding a signature to a contract",
      "Annotating or marking up a document for review",
      "Adding a date, name or note to an existing PDF",
    ],
    tips: [
      "Zoom in to place text accurately inside form fields.",
      "Add your signature last, once the rest of the document is final.",
      "This tool overlays content; it is not meant for rewriting the original text of a PDF.",
    ],
  },
  "compress-pdf": {
    about: [
      "PDFs full of scanned pages or images can become too large to email or upload. Compress PDF reduces file size so documents fit within attachment and portal limits, while keeping them readable.",
      "Compression runs in your browser, so confidential documents stay on your machine.",
    ],
    useCases: [
      "Getting a PDF under an email attachment limit",
      "Meeting a maximum upload size on application portals",
      "Saving space when archiving scanned documents",
      "Making documents quicker to download for other people",
    ],
    tips: [
      "Scanned PDFs, which are really pictures of pages, shrink the most.",
      "A text-only PDF is usually small already and may not shrink much.",
      "Open the compressed file and check that the text and images are still clear before sending.",
    ],
  },
  "pdf-to-images": {
    about: [
      "PDF to Images converts each page of a PDF into a picture file. This is useful when you need a page as an image for a presentation, a website, a chat message or software that does not accept PDFs.",
      "Pages are rendered in your browser, so your document is not uploaded anywhere.",
    ],
    useCases: [
      "Putting a PDF page into a slide deck or document",
      "Sharing one page as an image in a messaging app",
      "Posting a document preview on a website",
      "Extracting pages for editing in an image editor",
    ],
    tips: [
      "Choose PNG for text-heavy pages and JPG when file size matters more.",
      "Higher scale or quality gives sharper text but larger files.",
      "For long documents, convert only the pages you actually need.",
    ],
  },
  "pdf-text-extractor": {
    about: [
      "PDF Text Extractor pulls the text out of a PDF so you can copy, search or reuse it elsewhere. It works on PDFs that contain real text, such as exported documents, reports and ebooks.",
      "Extraction runs in your browser, so the contents of your document stay private.",
    ],
    useCases: [
      "Copying passages from a PDF into a document or notes",
      "Pulling text out for translation or summarising",
      "Searching a PDF's contents in a text editor",
      "Reusing content from reports and papers",
    ],
    tips: [
      "If the PDF is a scan, it has no text layer; convert its pages to images and use Image to Text instead.",
      "Tables and multi-column layouts may come out in a different order than they appear on the page.",
      "Check the output for odd line breaks and fix them before reusing the text.",
    ],
  },
  "docx-editor": {
    about: [
      "The DOCX Editor lets you open a Word document, make changes and save it again without installing office software. It is handy for quick corrections when you are on a shared or borrowed computer.",
      "The file is opened and edited in your browser and saved to your device, so it is not uploaded to a server.",
    ],
    useCases: [
      "Fixing a typo or updating a date in a Word file",
      "Editing a resume or letter on a device without Word",
      "Making quick changes before converting to PDF",
      "Reviewing and tweaking documents received by email",
    ],
    tips: [
      "Complex layouts, macros and some fonts may look slightly different from the original in Word.",
      "Save your edited copy under a new name to keep the original.",
      "After editing, open the file once in Word or another viewer to check formatting.",
    ],
  },
  "word-to-pdf": {
    about: [
      "A PDF looks the same on every device, which makes it the safest way to share a finished document. Word to PDF turns a DOCX file into a PDF you can send, print or upload.",
      "The conversion happens in your browser, so your document is not uploaded.",
    ],
    useCases: [
      "Sending a resume or cover letter that keeps its layout",
      "Turning reports and assignments into submission-ready PDFs",
      "Sharing a document that others should not accidentally edit",
      "Preparing files for printing",
    ],
    tips: [
      "Proofread the document in Word first; changes are harder once it is a PDF.",
      "Very elaborate formatting can shift slightly, so check the PDF before sending it.",
      "Use Compress PDF afterwards if the file is too large.",
    ],
  },
  "txt-editor": {
    about: [
      "The TXT Editor is a simple, distraction-free place to write and edit plain text. There is no formatting to fight with, which makes it ideal for notes, code snippets, lists and configuration text.",
      "Text is edited in your browser and saved to your device as a .txt file, with nothing sent to a server.",
    ],
    useCases: [
      "Jotting down quick notes and to-do lists",
      "Cleaning up text copied from websites or documents",
      "Editing small config or log files",
      "Drafting content before pasting it elsewhere",
    ],
    tips: [
      "Plain text removes all formatting, which is useful for cleaning pasted content.",
      "Download your work before closing the tab so you do not lose it.",
      "Use UTF-8 files so special characters and other languages display correctly.",
    ],
  },
  "csv-editor": {
    about: [
      "CSV files hold tabular data and open in spreadsheet apps, but sometimes you only need to fix a few cells. The CSV Editor shows your file as an editable table so you can change values, add or remove rows and columns, and export the result.",
      "The file is processed in your browser, so datasets with private information are not uploaded.",
    ],
    useCases: [
      "Correcting values in exported data",
      "Cleaning a contact or product list before importing it",
      "Adding and removing columns in a data file",
      "Reviewing a CSV without opening a spreadsheet application",
    ],
    tips: [
      "Check that the delimiter and header row were detected correctly after opening.",
      "Keep a copy of the original in case an edit needs to be reverted.",
      "Very large files can be slow in a browser; work with a smaller sample if needed.",
    ],
  },
  "video-trimmer": {
    about: [
      "Video Trimmer cuts a clip down to just the part you want. Set a start and end point and export the shorter video, which is useful for sharing highlights or removing unwanted intros and endings.",
      "Trimming is performed in your browser, so videos are not uploaded, but longer or higher-resolution files will take more time on slower devices.",
    ],
    useCases: [
      "Cutting a highlight from a longer recording",
      "Removing dead time from the start or end of a clip",
      "Shortening videos to fit social media limits",
      "Preparing a clip to share in a chat",
    ],
    tips: [
      "Use short clips when possible; processing happens on your device, so big files take longer.",
      "Preview your start and end points before exporting.",
      "Keep the original video until you have checked the trimmed result.",
    ],
  },
  "video-converter": {
    about: [
      "Different devices and platforms support different video formats. Video Converter changes a video from one format to another so it will play where you need it.",
      "Conversion runs in your browser, so your video is not uploaded, though large files can take a while depending on your computer.",
    ],
    useCases: [
      "Making a video playable on a phone, TV or editing app",
      "Converting recordings to a widely supported format",
      "Preparing clips for upload to a website",
      "Reducing a video's size by changing format",
    ],
    tips: [
      "MP4 is the most widely supported format and a safe default.",
      "Converting large, high-resolution videos can use a lot of memory; close other tabs first.",
      "Converting cannot improve quality, so start from the best source you have.",
    ],
  },
  "audio-extractor": {
    about: [
      "Audio Extractor pulls the soundtrack out of a video file and saves it as an audio file. It is a quick way to keep the audio from a lecture, interview, song or recording without the video.",
      "Extraction is done in your browser, so your media stays on your device.",
    ],
    useCases: [
      "Saving the audio of a lecture or meeting recording",
      "Creating a podcast-style version of a video",
      "Taking a voice recording out of a clip",
      "Making a smaller file for listening on the go",
    ],
    tips: [
      "Only extract audio from content you own or have permission to use.",
      "Longer videos take more time, since all processing is on your device.",
      "Listen to the result to confirm the right audio track was used.",
    ],
  },
  "youtube-thumbnail": {
    about: [
      "YouTube Thumbnail Downloader finds the thumbnail image for a video from its link and lets you save it in available sizes. It is useful for reference, mockups and understanding what works visually.",
      "Thumbnails are the property of their creators, so use downloaded images responsibly and respect copyright.",
    ],
    useCases: [
      "Checking how a video's thumbnail looks at different sizes",
      "Saving a thumbnail for your own video when you have lost the original",
      "Referencing thumbnail styles when designing your own",
      "Including a preview image in your own notes or presentations",
    ],
    tips: [
      "Paste the full video link, including the video ID.",
      "Choose the highest available resolution for the sharpest image.",
      "Do not reuse other creators' thumbnails commercially without permission.",
    ],
  },
};

export function getToolGuide(slug: string): ToolGuide | undefined {
  return toolGuides[slug];
}
