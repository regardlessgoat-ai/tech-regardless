"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              aria-controls={`acc-${item.id}`}
              className="flex w-full items-center justify-between gap-6 py-6 text-left focus-ring"
            >
              <span className="text-lg font-medium tracking-tight text-foreground sm:text-xl">
                {item.question}
              </span>
              <Plus
                className={cn(
                  "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
                  open && "rotate-45 text-accent"
                )}
                aria-hidden
              />
            </button>
            <div
              id={`acc-${item.id}`}
              role="region"
              hidden={!open}
              className={cn(
                "overflow-hidden text-muted-foreground",
                open && "pb-6"
              )}
            >
              <div className="max-w-2xl text-base leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
