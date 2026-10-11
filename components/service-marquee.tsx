type Item = { href: string; label: string };

/** Infinite horizontal banner of the service names. Each name links to its section. */
export function ServiceMarquee({ items }: { items: Item[] }) {
  // Two copies so the loop is seamless; the second is hidden from assistive tech.
  const copy = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center">
          <a
            href={item.href}
            tabIndex={hidden ? -1 : undefined}
            className="whitespace-nowrap px-6 py-5 font-sans text-3xl font-medium tracking-tight text-foreground transition-colors hover:text-accent focus-ring sm:text-5xl"
          >
            {item.label}
          </a>
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-accent" />
        </li>
      ))}
    </ul>
  );

  return (
    <nav aria-label="Services on this page" className="marquee border-y border-border">
      <div className="marquee-track">
        {copy(false)}
        {copy(true)}
      </div>
    </nav>
  );
}
