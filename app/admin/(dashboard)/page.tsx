import Link from "next/link";

const sections = [
  {
    href: "/admin/writing",
    title: "Personal Writing",
    description: "Articles and link-outs shown in the Latest Writing section and /blog.",
  },
  {
    href: "/admin/hero",
    title: "Hero",
    description: "Headline, rotating titles, subtitle, and background image.",
  },
  {
    href: "/admin/about",
    title: "About",
    description: "Photo, bio, skills, experience, and education.",
  },
  {
    href: "/admin/services",
    title: "Services",
    description: "The service cards on the homepage.",
  },
  {
    href: "/admin/portfolio",
    title: "Portfolio",
    description: "Project cards in the My Work section.",
  },
  {
    href: "/admin/coming-next",
    title: "Coming Next",
    description: "Upcoming project cards, their plans, and progress.",
  },
  {
    href: "/admin/contact",
    title: "Contact",
    description: "Email, phone, and social links.",
  },
];

export default function AdminHubPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-semibold">What do you want to edit?</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-lg border border-white/10 bg-[#141414] p-5 transition-colors duration-200 hover:border-[#ff004f]/50"
          >
            <p className="font-medium text-white">{section.title}</p>
            <p className="mt-1 text-sm text-[#ababab]">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
