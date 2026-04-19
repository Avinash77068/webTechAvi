import PageShell from "@/components/PageShell";
import { useSeo } from "@/hooks/use-seo";
import { brandInfo as brand } from "@/data/constants";

const Terms = () => {
  useSeo({
    title: "Terms of Service",
    description: `Terms under which ${brand.name} provides services.`,
    path: "/terms",
  });

  return (
    <PageShell>
      <article className="container mx-auto px-6 max-w-3xl prose prose-invert">
        <h1 className="font-heading text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <p className="mt-8 text-muted-foreground leading-relaxed">
          By using {brand.siteUrl} or engaging {brand.name} for services, you agree to these terms. Please read carefully.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">1. Services</h2>
        <p className="text-muted-foreground leading-relaxed">
          We provide web design, web development, and related consulting services under a signed Statement of Work (SOW).
          Scope, timeline, deliverables, and fees are defined per project in the SOW.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">2. Payment Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          Projects typically require a 50% advance to begin and the balance before launch. Retainer agreements are billed
          monthly in advance. Overdue invoices may incur a 2% monthly late fee.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">3. Intellectual Property</h2>
        <p className="text-muted-foreground leading-relaxed">
          On full payment, all deliverables (code, design files, assets) become your property. We retain the right to
          display the completed work in our portfolio and case studies unless an NDA specifies otherwise.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">4. Revisions & Changes</h2>
        <p className="text-muted-foreground leading-relaxed">
          Each SOW includes a defined number of revision rounds. Additional changes or scope beyond the SOW will be
          quoted separately before work begins.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">5. Warranty</h2>
        <p className="text-muted-foreground leading-relaxed">
          We offer a 30-day bug-fix warranty from launch, covering defects in the delivered code. Content changes, new
          features, and third-party service issues are outside this warranty.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">6. Limitation of Liability</h2>
        <p className="text-muted-foreground leading-relaxed">
          {brand.name}'s total liability is limited to the fees paid for the specific project giving rise to the claim.
          We are not liable for indirect, consequential, or lost-profits damages.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">7. Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed">
          These terms are governed by the laws of India. Any disputes fall under the exclusive jurisdiction of courts in
          Noida, Uttar Pradesh.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">8. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          Questions about these terms? Email{" "}
          <a href={`mailto:${brand.email}`} className="text-primary hover:underline">{brand.email}</a>.
        </p>
      </article>
    </PageShell>
  );
};

export default Terms;
