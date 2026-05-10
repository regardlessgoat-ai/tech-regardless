import type { Metadata } from "next";
import { WorkGrid } from "@/components/work-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaSection } from "@/components/cta-section";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "A selection of recent web design and development projects by Tech.Regardless.",
};

export default async function WorkIndexPage() {
  const projects = await getAllProjects();

  return (
    <>
      <section className="border-b border-border py-24 sm:py-32">
        <div className="container-wide">
          <SectionHeading
            as="h1"
            eyebrow="The work"
            title={
              <>
                Selected projects.
                <br />
                <span className="text-muted-foreground">No filler.</span>
              </>
            }
            description="Every project below shipped. Every one of them does the job it was built to do."
          />
        </div>
      </section>
      <WorkGrid projects={projects} variant="index" />
      <CtaSection />
    </>
  );
}
