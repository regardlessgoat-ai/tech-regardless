import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/trust-bar";
import { ServicesSection } from "@/components/services-section";
import { WorkGrid } from "@/components/work-grid";
import { AboutSection } from "@/components/about-section";
import { ProcessSection } from "@/components/process-section";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { CtaSection } from "@/components/cta-section";
import { getAllProjects } from "@/lib/projects";
import { SITE } from "@/lib/utils";

export default async function HomePage() {
  const projects = await getAllProjects();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: SITE.name,
        url: SITE.url,
        jobTitle: "Web Designer & Developer",
        email: `mailto:${SITE.email}`,
        sameAs: [
          SITE.social.twitter,
          SITE.social.github,
          SITE.social.linkedin,
          SITE.social.instagram,
        ],
      },
      {
        "@type": "ProfessionalService",
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        priceRange: "$$",
        areaServed: "Worldwide",
        slogan: SITE.tagline,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <TrustBar />
      <ServicesSection />
      <WorkGrid projects={projects} variant="home" />
      <AboutSection />
      <ProcessSection />
      <Testimonials />
      <FAQ />
      <CtaSection />
    </>
  );
}
