import { z } from "zod";

// Single source of truth for the contact form's fixed choices. The form, the
// API validation, the lead email and the Front Desk brain all import from here
// so a new option can never exist in one place and not the others.

export const PROJECT_TYPES = [
  { value: "free-audit", label: "Free audit" },
  { value: "new-website", label: "New website" },
  { value: "redesign", label: "Redesign" },
  { value: "ai-front-desk", label: "AI Front Desk" },
  { value: "automation", label: "Business automation" },
  { value: "ongoing-support", label: "Ongoing support" },
  { value: "custom-project", label: "Custom project" },
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]["value"];
export const PROJECT_TYPE_VALUES = PROJECT_TYPES.map((p) => p.value) as [
  ProjectType,
  ...ProjectType[],
];

export const BUDGETS = [
  { value: "under-500", label: "Under $500" },
  { value: "under-1k", label: "Under $1k" },
  { value: "under-2k", label: "Under $2k" },
  { value: "2k-5k", label: "$2k to $5k" },
  { value: "5k-10k", label: "$5k to $10k" },
  { value: "10k-plus", label: "$10k+" },
] as const;

export type Budget = (typeof BUDGETS)[number]["value"];
export const BUDGET_VALUES = BUDGETS.map((b) => b.value) as [Budget, ...Budget[]];

// Five quick A/B/C/D questions at the end of the form. They exist so the
// discovery call can be prepared even when the free-text answers are thin.
// Every answer is a fixed letter, so they are funnel data, not personal data.
export const RESEARCH_LETTERS = ["a", "b", "c", "d"] as const;
export type ResearchLetter = (typeof RESEARCH_LETTERS)[number];

export const RESEARCH_QUESTIONS = [
  {
    id: "findYou",
    question: "How do new customers usually find you?",
    options: { a: "Google search", b: "Referrals and word of mouth", c: "Social media", d: "Not sure" },
  },
  {
    id: "missedCall",
    question: "What happens when you miss a call?",
    options: { a: "It goes to voicemail", b: "I call back when I can", c: "Someone else picks up", d: "I don't know how many I miss" },
  },
  {
    id: "booking",
    question: "How do you book jobs today?",
    options: { a: "Phone and text", b: "Paper or a whiteboard", c: "Scheduling software", d: "Through my website" },
  },
  {
    id: "callVolume",
    question: "Roughly how many calls a day?",
    options: { a: "Under 5", b: "5 to 15", c: "15 to 40", d: "More than 40" },
  },
  {
    id: "timing",
    question: "When do you want this live?",
    options: { a: "As soon as possible", b: "Within a month", c: "In 1 to 3 months", d: "Just planning ahead" },
  },
] as const;

export type ResearchId = (typeof RESEARCH_QUESTIONS)[number]["id"];
export type ResearchAnswers = Record<ResearchId, ResearchLetter>;

const letter = z.enum(RESEARCH_LETTERS, { errorMap: () => ({ message: "Pick one." }) });

/** Validation for the five answers. Shared by the form and the API. */
export const researchSchema = z.object({
  findYou: letter,
  missedCall: letter,
  booking: letter,
  callVolume: letter,
  timing: letter,
});

/** "How do new customers usually find you? Google search" for emails and prompts. */
export function describeResearch(answers: ResearchAnswers): string[] {
  return RESEARCH_QUESTIONS.map((q) => `${q.question} ${q.options[answers[q.id]]}`);
}
