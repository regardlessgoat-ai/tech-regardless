"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Input,
  Textarea,
  Select,
  Label,
  FieldError,
} from "@/components/ui/input";
import { captureUtm } from "@/lib/utm";
import {
  PROJECT_TYPES,
  PROJECT_TYPE_VALUES,
  BUDGETS,
  BUDGET_VALUES,
  RESEARCH_QUESTIONS,
  RESEARCH_LETTERS,
  researchSchema,
} from "@/lib/contact-questions";

export const contactSchema = z.object({
  name: z.string().min(2, "Tell me your name."),
  email: z.string().email("That doesn't look like a valid email."),
  company: z.string().trim().min(2, "Tell me the business name."),
  phone: z
    .string()
    .refine((v) => v.replace(/\D/g, "").length >= 10, {
      message: "Include the area code.",
    }),
  projectType: z.enum(PROJECT_TYPE_VALUES, {
    errorMap: () => ({ message: "Pick one." }),
  }),
  budget: z.enum(BUDGET_VALUES, { errorMap: () => ({ message: "Pick one." }) }),
  message: z.string().min(10, "A few sentences about the problem, please."),
  goal: z
    .string()
    .min(3, "One sentence is enough.")
    .max(300, "Keep it to a sentence or two."),
  research: researchSchema,
});

type ContactValues = z.infer<typeof contactSchema>;
export type ProjectTypeValue = ContactValues["projectType"];

/** `defaultProjectType` presets the select, e.g. from /contact?type=free-audit. */
export function ContactForm({ defaultProjectType }: { defaultProjectType?: ProjectTypeValue }) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultProjectType ? { projectType: defaultProjectType } : undefined,
  });

  // The root layout captures campaign tags on the landing page. This covers the
  // one case it misses: a client-side navigation straight to a tagged /contact
  // URL, where the layout's mount-only effect has already run.
  useEffect(() => {
    captureUtm();
  }, []);

  const onSubmit = async (values: ContactValues) => {
    setServerError(null);
    try {
      // Attribution rides along with the submission rather than living in a
      // hidden input: nothing is added to the DOM, so the form's markup and
      // layout are untouched, and there is no field for a bot to see or a
      // browser to autofill. The server caps and sanitises these values and
      // records "direct" when they are empty.
      const utm = captureUtm();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...utm }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong sending that.");
      }
      reset();
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Couldn't send. Try again?"
      );
    }
  };

  if (submitted) {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded border border-accent/40 bg-accent/5 p-8"
      >
        <CheckCircle2 className="size-8 text-accent" aria-hidden />
        <h2 className="text-2xl font-medium tracking-tight">
          Got it. Check your email.
        </h2>
        <p className="text-muted-foreground">
          A confirmation is on its way to your inbox now. I read every
          request myself, and you&apos;ll hear back within one business day,
          usually the same day.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSubmitted(false)}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-5"
      aria-label="Project inquiry form"
    >
      <div className="grid gap-2">
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Your full name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError>{errors.email?.message}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="company" required>
            Business name
          </Label>
          <Input
            id="company"
            autoComplete="organization"
            placeholder="Your business"
            aria-invalid={!!errors.company}
            {...register("company")}
          />
          <FieldError>{errors.company?.message}</FieldError>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone" required>
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(407) 555-0100"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          <FieldError>{errors.phone?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="projectType" required>
            Project type
          </Label>
          <div className="relative">
            <Select
              id="projectType"
              aria-invalid={!!errors.projectType}
              defaultValue=""
              {...register("projectType")}
            >
              <option value="" disabled>
                Pick one
              </option>
              {PROJECT_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>
          <FieldError>{errors.projectType?.message}</FieldError>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="budget" required>
            Budget
          </Label>
          <div className="relative">
            <Select
              id="budget"
              aria-invalid={!!errors.budget}
              defaultValue=""
              {...register("budget")}
            >
              <option value="" disabled>
                Pick one
              </option>
              {BUDGETS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </Select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>
          <FieldError>{errors.budget?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message" required>
          What&apos;s the problem?
        </Label>
        <Textarea
          id="message"
          placeholder="A few sentences: what's broken or missing today, and what you've tried."
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        <FieldError>{errors.message?.message}</FieldError>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="goal" required>
          What would a win look like?
        </Label>
        <Input
          id="goal"
          placeholder="e.g. stop missing calls while I'm on a job"
          aria-invalid={!!errors.goal}
          {...register("goal")}
        />
        <FieldError>{errors.goal?.message}</FieldError>
      </div>

      <fieldset className="grid gap-6 border-t border-border pt-6">
        <legend className="sr-only">Five quick questions</legend>
        <div>
          <p className="text-sm font-medium">Five quick questions</p>
          <p className="mt-1 text-xs text-muted-foreground">
            So we come to the call already knowing your business. Pick the
            closest answer.
          </p>
        </div>
        {RESEARCH_QUESTIONS.map((q, qi) => {
          const err = errors.research?.[q.id]?.message;
          return (
            <fieldset key={q.id} className="grid gap-2">
              <legend className="text-sm">
                {qi + 1}. {q.question}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {RESEARCH_LETTERS.map((letter) => (
                  <label
                    key={letter}
                    className="flex cursor-pointer items-start gap-2.5 rounded border border-border px-3 py-2 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent/10"
                  >
                    <input
                      type="radio"
                      value={letter}
                      className="mt-0.5 accent-[hsl(var(--accent))]"
                      {...register(`research.${q.id}` as const)}
                    />
                    <span>
                      <span className="font-mono text-xs uppercase text-muted-foreground">
                        {letter}.
                      </span>{" "}
                      {q.options[letter]}
                    </span>
                  </label>
                ))}
              </div>
              <FieldError>{err}</FieldError>
            </fieldset>
          );
        })}
      </fieldset>

      {serverError && (
        <p role="alert" className="text-sm text-red-400">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="md" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send it"}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
        <p className="text-xs text-muted-foreground">
          I respond within 24 hours.
        </p>
      </div>
    </form>
  );
}
