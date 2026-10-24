import { Download, MousePointerClick, Settings2 } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Choose a tool and add your file",
    description: "Pick a tool, then drop a file or browse to select one.",
  },
  {
    icon: Settings2,
    title: "Adjust the settings",
    description: "Set the quality, size, format or pages the tool supports.",
  },
  {
    icon: Download,
    title: "Download your result",
    description: "Preview the output and save it right to your device.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-border bg-card/20">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.67rem] font-bold uppercase tracking-[0.16em] text-sky-300">Quick and simple</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-[1.75rem]">How it works</h2>
          </div>
          <p className="text-sm text-muted-foreground">Get results in three easy steps.</p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="step-card relative flex min-h-[6.4rem] items-center gap-3.5 p-3.5 sm:gap-4 sm:p-4">
              <span className="absolute -top-2.5 left-3 flex size-6 items-center justify-center rounded-full border-2 border-background bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-950/40 sm:left-4">
                {index + 1}
              </span>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.08] text-sky-300 sm:size-12">
                <step.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
