"use client";

import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorBanner } from "@/components/tools/error-banner";
import { extractYoutubeVideoId, getYoutubeThumbnails, type YoutubeThumbnail } from "@/lib/youtube";
import { PLACEHOLDER_SIZE } from "../constants";

export function YoutubeThumbnailTool() {
  const [input, setInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<YoutubeThumbnail[]>([]);
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const id = extractYoutubeVideoId(input);
    if (!id) {
      setError("That doesn't look like a valid YouTube URL or video ID.");
      setVideoId(null);
      setThumbnails([]);
      return;
    }
    setError(null);
    setVideoId(id);
    setUnavailable(new Set());
    setThumbnails(getYoutubeThumbnails(id));
  }

  function markUnavailable(key: string) {
    setUnavailable((prev) => new Set(prev).add(key));
  }

  function handleImageLoad(thumb: YoutubeThumbnail, event: React.SyntheticEvent<HTMLImageElement>) {
    const img = event.currentTarget;
    const isPlaceholderFallback =
      thumb.width !== PLACEHOLDER_SIZE &&
      img.naturalWidth === PLACEHOLDER_SIZE &&
      img.naturalHeight === 90;
    if (isPlaceholderFallback) markUnavailable(thumb.key);
  }

  const visibleThumbnails = thumbnails.filter((t) => !unavailable.has(t.key));

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Label htmlFor="youtube-input">YouTube video URL or ID</Label>
        <div className="flex gap-2">
          <Input
            id="youtube-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=… or dQw4w9WgXcQ"
            className="flex-1"
          />
          <Button type="submit">
            <Search aria-hidden="true" />
            View thumbnails
          </Button>
        </div>
      </form>

      <ErrorBanner messages={error ? [error] : []} />

      {videoId && visibleThumbnails.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleThumbnails.map((thumb) => (
            <div key={thumb.key} className="overflow-hidden rounded-xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb.url}
                alt={`${thumb.label} thumbnail`}
                onLoad={(e) => handleImageLoad(thumb, e)}
                onError={() => markUnavailable(thumb.key)}
                className="aspect-video w-full bg-muted/30 object-cover"
              />
              <div className="flex items-center justify-between gap-2 p-3">
                <div>
                  <p className="text-sm font-medium">{thumb.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {thumb.width}×{thumb.height}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<a href={thumb.url} target="_blank" rel="noopener noreferrer" />}
                >
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
