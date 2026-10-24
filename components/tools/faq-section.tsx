import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ToolFaq } from "@/lib/tools-registry";

export function FaqSection({ faqs, title = "Frequently asked questions" }: { faqs: ToolFaq[]; title?: string }) {
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-semibold">
        {title}
      </h2>
      <Accordion className="mt-3">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index.toString()}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              <p>{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
