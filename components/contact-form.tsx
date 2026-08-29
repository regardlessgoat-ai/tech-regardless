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

export const contactSchema = z.object({
  name: z.string().min(2, "Tell me your name."),
  email: z.string().email("That doesn't look like a valid email."),
  company: z.string().optional(),
  projectType: z.enum(
    ["new-website", "redesign", "automation", "ongoing-support", "exploring"],
    { errorMap: () => ({ message: "Pick one." }) }
  ),
  budget: z.enum(
    ["under-500", "under-1k", "under-2k", "2k-5k", "5k-10k", "10k-plus"],
    { errorMap: () => ({ message: "Pick one." }) }
  ),
  message: z.string().min(10, "A few sentences about the project, please."),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
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
          Got it. Talk soon.
        </h2>
        <p className="text-muted-foreground">
          Your message hit my inbox. I respond within 24 hours — usually
          faster. In the meantime, no follow-up needed from your end.
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

      <div className="grid gap-2">
        <Label htmlFor="company">Company (optional)</Label>
        <Input
          id="company"
          autoComplete="organization"
          placeholder="Where you work"
          {...register("company")}
        />
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
              <option value="new-website">New website</option>
              <option value="redesign">Redesign</option>
              <option value="automation">Automation</option>
              <option value="ongoing-support">Ongoing support</option>
              <option value="exploring">Just exploring</option>
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
              <option value="under-500">Under $500</option>
              <option value="under-1k">Under $1k</option>
              <option value="under-2k">Under $2k</option>
              <option value="2k-5k">$2k – $5k</option>
              <option value="5k-10k">$5k – $10k</option>
              <option value="10k-plus">$10k+</option>
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
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="A few sentences about the project — what you have, what you need, when you need it."
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        <FieldError>{errors.message?.message}</FieldError>
      </div>

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
