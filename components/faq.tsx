import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";

const items: AccordionItem[] = [
  {
    id: "timeline",
    question: "How long does a custom build take?",
    answer: <p>1 to 2 weeks.</p>,
  },
  {
    id: "pricing",
    question: "What does pricing actually include?",
    answer: (
      <p>
        Strategy, design, development, launch, and post-launch support. No
        design fees, no developer fees, no “oh that&apos;s an add-on.” You
        see one number on the proposal and that&apos;s the number you pay.
      </p>
    ),
  },
  {
    id: "revisions",
    question: "Do you offer revisions?",
    answer: (
      <p>
        Yes. Two full design rounds and unlimited tweaks during build.
        I&apos;d rather spend a day getting a section right than ship
        something neither of us is proud of.
      </p>
    ),
  },
  {
    id: "after",
    question: "What happens after the site launches?",
    answer: (
      <p>
        Your first 30 days of support are included: bug fixes, business
        changes, personalized edits, anything small that isn&apos;t a full
        redesign. After that, ongoing updates and support are part of the
        $500 a month plan, which also gives you the AI Front Desk. Whenever
        you need something different, or another part of the business
        automated, that&apos;s a one time quote custom to the job. You
        explain the issue, and I tell you honestly whether it can be
        automated securely, reliably, and consistently before you spend a
        dollar.
      </p>
    ),
  },
  {
    id: "hosting",
    question: "Do you handle hosting and domains?",
    answer: (
      <p>
        Yes. I deploy to Vercel by default. It&apos;s fast, reliable, and
        included in the project price for the first year. I can also work
        with whatever stack you already have if you&apos;d rather not
        migrate.
      </p>
    ),
  },
  {
    id: "existing",
    question: "What if I already have a website?",
    answer: (
      <p>
        Even better, we have a starting point. I&apos;ll audit what you
        have, tell you honestly whether it needs a refresh or a full
        rebuild, and we go from there.
      </p>
    ),
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-b border-border py-24 sm:py-32"
    >
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="FAQ"
              title={
                <>
                  Common
                  <br />
                  questions
                </>
              }
              description="The ones every prospective client asks. If yours isn't here, just send it over."
            />
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <Accordion items={items} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
