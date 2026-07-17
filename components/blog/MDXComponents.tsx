import type { ComponentPropsWithoutRef, ElementType } from "react";

function makeHeading(Tag: ElementType, sizeClass: string) {
  function HeadingComponent({
    id,
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<"h2">) {
    return (
      <Tag
        id={id}
        className={`group scroll-mt-28 font-semibold text-white ${sizeClass} ${className ?? ""}`}
        {...props}
      >
        {children}
        {id && (
          <a
            href={`#${id}`}
            aria-label="Link to this section"
            className="ml-2 text-[#ff004f] no-underline opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            #
          </a>
        )}
      </Tag>
    );
  }
  return HeadingComponent;
}

export const mdxComponents = {
  h1: makeHeading("h2", "text-3xl sm:text-4xl mt-14 mb-4"),
  h2: makeHeading("h2", "text-3xl sm:text-4xl mt-14 mb-4"),
  h3: makeHeading("h3", "text-2xl sm:text-3xl mt-10 mb-3"),
  h4: makeHeading("h4", "text-xl mt-8 mb-2"),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-6 text-lg leading-relaxed text-[#c9c9c9]" {...props} />
  ),
  a: ({ href, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      href={href}
      className="text-[#ff004f] underline decoration-[#ff004f]/40 underline-offset-4 transition-colors hover:decoration-[#ff004f]"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-6 list-disc space-y-2 pl-6 text-lg text-[#c9c9c9]" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-6 list-decimal space-y-2 pl-6 text-lg text-[#c9c9c9]" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="pl-1" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mb-6 border-l-4 border-[#ff004f] pl-6 italic text-[#ababab]"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-white/10" />,
  img: ({ alt, ...props }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element -- MDX authors write plain markdown images without known dimensions, so next/image's required width/height can't be inferred here.
    <img
      alt={alt ?? ""}
      className="my-8 w-full rounded-xl border border-white/5"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => {
    const isHighlightedBlock =
      typeof props.className === "string" && props.className.includes("hljs");
    if (isHighlightedBlock) return <code {...props} />;
    return (
      <code
        className="rounded bg-[#1c1c1c] px-1.5 py-0.5 text-[0.9em] text-[#ff8fae]"
        {...props}
      />
    );
  },
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="mb-6 overflow-x-auto rounded-xl border border-white/5 bg-[#0d1117] p-5 text-sm leading-relaxed"
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-base" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th className="border-b border-white/10 px-3 py-2 font-semibold text-white" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border-b border-white/5 px-3 py-2 text-[#c9c9c9]" {...props} />
  ),
};
