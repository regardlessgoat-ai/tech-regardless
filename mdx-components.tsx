import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => (
      <h1 className="mt-12 text-4xl font-medium tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 text-3xl font-medium tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 text-2xl font-medium tracking-tight">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        {children}
      </p>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-accent underline-offset-4 hover:underline"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-medium text-foreground">{children}</strong>
    ),
  };
}
