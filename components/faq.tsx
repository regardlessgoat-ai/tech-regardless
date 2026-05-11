import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";

const items: AccordionItem[] = [
  {
    id: "timeline",
    question: "How long does a website take to build?",
    answer: (
      <p>
        Most projects ship in 2–6 weeks. A simple marketing site can be live
        in under three weeks. Larger builds with custom features or a CMS
        usually run six to eight. I always commit to a date in writing
        before we start — and I hit it.
      </p>
    ),
  },
  {
    id: "pricing",
    question: "What does pricing actually include?",
    answer: (
      <p>
        Strategy, design, development, launch, and 30 days of post-launch
        support. No design fees, no developer fees, no “oh that&apos;s an
        add-on.” You see one number on the proposal and that&apos;s the
        number you pay.
      </p>
    ),
  },
  {
    id: "revisions",
    question: "Do you offer revisions?",
    answer: (
      <p>
        Yes — two full design rounds and unlimited tweaks during build.
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
        You get 30 days of free support — bug fixes, copy changes, anything
        small. After that, I offer a monthly retainer for ongoing updates,
        or you can come back as needed at my standard rate.
      </p>
    ),
  },
  {
    id: "hosting",
    question: "Do you handle hosting and domains?",
    answer: (
      <p>
        Yes. I deploy to Vercel by default — it&apos;s fast, reliable, and
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
        Even better — we have a starting point. I&apos;ll audit what you
        have, tell you honestly whether it needs a refresh or a full
        rebuild, and we go from there. No pressure to throw it all away if
        the bones are good.
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
