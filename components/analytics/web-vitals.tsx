"use client";

import { useReportWebVitals } from "next/web-vitals";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function reportWebVitals(metric: Parameters<Parameters<typeof useReportWebVitals>[0]>[0]) {
  window.gtag?.("event", metric.name, {
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    event_category: "Web Vitals",
    event_label: metric.id,
    metric_rating: metric.rating,
    non_interaction: true,
  });
}

export function WebVitals() {
  useReportWebVitals(reportWebVitals);
  return null;
}
