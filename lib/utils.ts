import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "Tech.Regardless",
  tagline: "Solutions that work. Regardless.",
  description:
    "Tech solutions for businesses: custom websites, an AI front desk that answers missed calls, and automation for the busywork in between. Built and run by one person in Kissimmee, FL.",
  email: "ali@techregardless.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://techregardless.com",
  social: {
    twitter: "https://twitter.com/techregardless",
    github: "https://github.com/techregardless",
    linkedin: "https://linkedin.com/in/techregardless",
    instagram: "https://instagram.com/techregardless",
  },
} as const;
