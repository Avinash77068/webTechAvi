export interface YoutubeThumbnail {
  key: string;
  label: string;
  width: number;
  height: number;
  url: string;
}

const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

/** Extracts a YouTube video ID from common URL formats, or validates a bare ID. */
export function extractYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (VIDEO_ID_PATTERN.test(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return VIDEO_ID_PATTERN.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "music.youtube.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id && VIDEO_ID_PATTERN.test(id) ? id : null;
    }
    const shortsMatch = url.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];

    const embedMatch = url.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    const liveMatch = url.pathname.match(/^\/live\/([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];
  }

  return null;
}

/** Builds the set of thumbnail URLs YouTube publishes for a video. Availability isn't guaranteed per video. */
export function getYoutubeThumbnails(videoId: string): YoutubeThumbnail[] {
  const base = `https://img.youtube.com/vi/${videoId}`;
  return [
    { key: "maxresdefault", label: "Max Resolution", width: 1280, height: 720, url: `${base}/maxresdefault.jpg` },
    { key: "sddefault", label: "Standard Definition", width: 640, height: 480, url: `${base}/sddefault.jpg` },
    { key: "hqdefault", label: "High Quality", width: 480, height: 360, url: `${base}/hqdefault.jpg` },
    { key: "mqdefault", label: "Medium Quality", width: 320, height: 180, url: `${base}/mqdefault.jpg` },
    { key: "default", label: "Default", width: 120, height: 90, url: `${base}/default.jpg` },
  ];
}
