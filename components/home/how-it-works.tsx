import { MousePointerClick, Settings2, Download } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Choose a tool and add your file",
    description: "Pick a tool, then drag and drop a file or browse to select one.",
  },
  {
    icon: Settings2,
    title: "Adjust the settings",
    description: "Set quality, size, format or pages — whatever the tool supports — and run it.",
  },
  {
    icon: Download,
    title: "Download your result",
    description: "Preview the output and download it. Your file never has to leave your browser.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="relative">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <step.icon className="size-5" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-medium text-primary">Step {index + 1}</p>
            <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
