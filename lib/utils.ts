import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "Tech.Regardless",
  tagline: "Websites that work. Regardless.",
  description:
    "I design and build fast, modern websites for businesses that refuse to settle for templates.",
  email: "hello@techregardless.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://techregardless.com",
  calendly:
    process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-handle",
  social: {
    twitter: "https://twitter.com/techregardless",
    github: "https://github.com/techregardless",
    linkedin: "https://linkedin.com/in/techregardless",
    instagram: "https://instagram.com/techregardless",
  },
} as const;
