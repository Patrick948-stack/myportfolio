import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0b0d] px-[10%] text-center text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-[#ff004f]">404</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
        This post doesn&apos;t exist
      </h1>
      <p className="mt-4 max-w-md text-[#ababab]">
        It may have been unpublished, renamed, or never existed. Head back to
        the writing index to find something else.
      </p>
      <Link
        href="/blog"
        data-cursor="link"
        className="mt-8 rounded-full border border-[#ff004f] px-8 py-3 text-sm font-medium transition-colors duration-300 hover:bg-[#ff004f]"
      >
        Back to Writing
      </Link>
    </main>
  );
}
