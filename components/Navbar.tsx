"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FaBars, FaXmark } from "react-icons/fa6";
import Magnetic from "./Magnetic";
import { useSound } from "./SoundProvider";

interface NavLink {
  label: string;
  href: string;
  isRoute?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "#header" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Coming Next", href: "#coming-next" },
  { label: "Research", href: "#research" },
  { label: "Blog", href: "/blog", isRoute: true },
  { label: "Contact", href: "#contact" },
];

const linkClassName =
  "relative text-lg text-white after:absolute after:-bottom-1.5 after:left-0 after:h-[3px] after:w-0 after:bg-[#ff004f] after:transition-all after:duration-500 after:content-[''] hover:after:w-full";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#header");
  const { hover, click } = useSound();
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  useEffect(() => {
    if (!isHome) return;

    const sections = navLinks
      .filter((link) => link.href.startsWith("#"))
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  function renderLink(link: NavLink, onNavigate?: () => void) {
    const isActive = isHome
      ? activeHref === link.href
      : link.href === "/blog" && pathname.startsWith("/blog");
    const underline = isActive && (
      <motion.span
        layoutId="nav-underline"
        className="absolute -bottom-1.5 left-0 h-[3px] w-full bg-[#ff004f]"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    );

    const handleClick = () => {
      click();
      onNavigate?.();
    };

    if (link.isRoute || !isHome) {
      const href = link.isRoute ? link.href : `/${link.href}`;
      return (
        <Link
          href={href}
          data-cursor="link"
          onMouseEnter={hover}
          onClick={handleClick}
          className={linkClassName}
        >
          {link.label}
          {underline}
        </Link>
      );
    }

    return (
      <a
        href={link.href}
        data-cursor="link"
        onMouseEnter={hover}
        onClick={handleClick}
        className={linkClassName}
      >
        {link.label}
        {underline}
      </a>
    );
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 z-50 flex w-full flex-wrap items-center justify-between px-[10%] py-4 transition-colors duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-[#0a0b0d]/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <Magnetic strength={0.25}>
        <Link href="/" data-cursor="link" onClick={click}>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={192}
            height={109}
            priority
            className="h-auto w-28 sm:w-36 md:w-[180px]"
          />
        </Link>
      </Magnetic>

      <ul className="hidden gap-6 md:flex">
        {navLinks.map((link) => (
          <li key={link.href} className="relative list-none">
            {renderLink(link)}
          </li>
        ))}
      </ul>

      <button
        className={`relative z-50 text-2xl text-white transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        onClick={() => {
          setOpen(true);
          click();
        }}
        aria-label="Open menu"
        data-cursor="link"
      >
        <FaBars />
      </button>

      {open && (
        <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
      )}

      <ul
        className={`fixed top-0 right-0 z-40 flex h-full w-48 flex-col gap-6 bg-[#ff004f] px-6 pt-16 transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-6 left-6 text-2xl text-white"
          onClick={() => {
            setOpen(false);
            click();
          }}
          aria-label="Close menu"
          data-cursor="link"
        >
          <FaXmark />
        </button>
        {navLinks.map((link) => (
          <li key={link.href} className="list-none">
            {renderLink(link, () => setOpen(false))}
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
