import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { GUARANTEE } from "@/lib/offer";

const items: AccordionItem[] = [
  {
    id: "timeline",
    question: "How long does it take?",
    answer: (
      <p>
        A custom website takes 1 to 2 weeks. The AI Front Desk goes live as
        soon as your business number is approved for texting. Business
        automation and custom projects are scoped on the discovery call,
        where you get the delivery date and the cost in writing before
        anything starts.
      </p>
    ),
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
    id: "guarantee",
    question: "What if the AI Front Desk doesn't pay off?",
    answer: <p>{GUARANTEE}</p>,
  },
  {
    id: "hosting",
    question: "Do you handle hosting and domains?",
    answer: (
      <p>
        Yes. I host it, keep it fast, and keep it running. If you&apos;d
        rather keep your current host, I&apos;ll work with it.
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
      className="border-b border-border py-16 sm:py-20"
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
