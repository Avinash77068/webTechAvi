import PageShell from "@/components/PageShell";
import { useSeo } from "@/hooks/use-seo";
import { brandInfo as brand } from "@/data/constants";

const Privacy = () => {
  useSeo({
    title: "Privacy Policy",
    description: `How ${brand.name} collects, uses, and protects your data.`,
    path: "/privacy",
  });

  return (
    <PageShell>
      <article className="container mx-auto px-6 max-w-3xl prose prose-invert">
        <h1 className="font-heading text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <p className="mt-8 text-muted-foreground leading-relaxed">
          {brand.name} ("we", "our", "us") respects your privacy. This policy describes what information we collect,
          how we use it, and the choices you have. It applies to {brand.siteUrl} and any services we offer.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>Contact form data:</strong> name, email, phone, company, project details you submit.</li>
          <li><strong>Usage data:</strong> anonymised analytics (pages visited, device type, referrer) via privacy-respecting tools.</li>
          <li><strong>Cookies:</strong> strictly necessary cookies for theme preferences. No advertising cookies.</li>
        </ul>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">2. How We Use It</h2>
        <p className="text-muted-foreground leading-relaxed">
          Solely to respond to your inquiry, send the proposal you requested, improve our website, and meet legal obligations.
          We do not sell or share your data with advertisers.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">3. Third-Party Services</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may use Calendly (for bookings), Google Analytics (anonymised), and an email service provider to deliver messages.
          Each has their own privacy policy.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">4. Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed">
          You can request access, correction, or deletion of your data at any time by emailing{" "}
          <a href={`mailto:${brand.email}`} className="text-primary hover:underline">{brand.email}</a>.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">5. Security</h2>
        <p className="text-muted-foreground leading-relaxed">
          We use HTTPS, access-controlled infrastructure, and minimal data retention. No method of transmission is 100%
          secure, but we take industry-standard precautions.
        </p>

        <h2 className="font-heading text-2xl font-bold mt-10 mb-3">6. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          Questions? Email{" "}
          <a href={`mailto:${brand.email}`} className="text-primary hover:underline">{brand.email}</a>{" "}
          or write to us at {brand.location}.
        </p>
      </article>
    </PageShell>
  );
};

export default Privacy;
