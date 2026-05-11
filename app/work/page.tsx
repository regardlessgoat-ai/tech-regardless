import type { Metadata } from "next";
import { WorkGrid } from "@/components/work-grid";
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
      <WorkGrid projects={projects} variant="index" />
      <CtaSection />
    </>
  );
}
