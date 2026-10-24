import Link from "next/link";
import { Cpu, EyeOff, ShieldCheck } from "lucide-react";

const points = [
  {
    icon: Cpu,
    title: "Processing happens on your device",
    description:
      "Most tools use your browser's own capabilities — Canvas, WebAssembly and JavaScript — to do the work locally, instead of sending your file to a server.",
  },
  {
    icon: EyeOff,
    title: "We don't read your files",
    description:
      "We don't inspect, store or send the content of your documents or images to analytics or third parties.",
  },
  {
    icon: ShieldCheck,
    title: "Clearly labeled, not assumed",
    description:
      "If a specific tool ever needs to use a server for part of its work, that page says so plainly — we don't label something private unless it actually is.",
  },
];

export function PrivacySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Built with privacy in mind</h2>
        <p className="mt-2 text-muted-foreground">
          Read the full{" "}
          <Link href="/privacy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          for the complete picture.
        </p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {points.map((point) => (
          <div key={point.title} className="rounded-2xl border border-border bg-card p-5">
            <point.icon className="size-5 text-primary" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">{point.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
