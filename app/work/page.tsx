import type { Metadata } from "next";
import { WorkGrid } from "@/components/work-grid";
import { CtaSection } from "@/components/cta-section";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Recent builds by Tech.Regardless: who the client is, what was broken, and what got fixed.",
  alternates: { canonical: "/work" },
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
