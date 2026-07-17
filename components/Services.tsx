"use client";
import Link from "next/link";
import {
  FaFlask,
  FaCode,
  FaMicrochip,
  FaRocket,
  FaBolt,
  FaCloud,
  FaScrewdriverWrench,
  FaCubes,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { useSound } from "./SoundProvider";
import type { ServicesContent } from "@/types";

const iconMap: Record<string, IconType> = {
  flask: FaFlask,
  code: FaCode,
  microchip: FaMicrochip,
  rocket: FaRocket,
  bolt: FaBolt,
  cloud: FaCloud,
  tools: FaScrewdriverWrench,
  cubes: FaCubes,
};

export default function Services({ content }: { content: ServicesContent }) {
  const { hover, click } = useSound();
  const { items } = content;

  return (
    <section id="services" className="px-[10%] py-8">
      <Reveal>
        <h2 className="text-5xl font-semibold text-white sm:text-6xl">
          My Services
        </h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2">
        {items.map((service, i) => {
          const Icon = iconMap[service.iconKey] ?? FaCode;
          // Preserve the original "featured first card" bento layout for the
          // common 3-service case; degrade to a plain grid for any other count.
          const span =
            items.length === 3 && i === 0
              ? "md:col-span-2 md:row-span-2"
              : "md:col-span-1";

          return (
            <Reveal key={`${service.title}-${i}`} delay={i * 0.1} className={span}>
              <TiltCard
                maxTilt={6}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#262626] p-10 text-sm font-light transition-colors duration-500 hover:border-[#ff004f]/50"
                onMouseEnter={hover}
              >
                <span className="pointer-events-none absolute -right-4 -top-6 text-8xl font-bold text-white/5 transition-colors duration-500 group-hover:text-[#ff004f]/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon className="mb-7 text-5xl text-[#ff004f] transition-transform duration-500 group-hover:scale-110" />
                <h3 className="mb-4 text-2xl font-medium">{service.title}</h3>
                <p className="text-[#ababab]">{service.description}</p>
                {service.extra && (
                  <p className="mt-4 text-xs leading-relaxed text-[#777]">
                    {service.extra}
                  </p>
                )}
                {service.stack && service.stack.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-[#ababab]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {service.ctaHref.startsWith("/") ? (
                  <Link
                    href={service.ctaHref}
                    data-cursor="link"
                    onClick={click}
                    className="relative z-10 mt-5 inline-block w-fit text-xs text-white transition-colors duration-300 hover:text-[#ff004f]"
                  >
                    {service.ctaLabel}
                  </Link>
                ) : (
                  <a
                    href={service.ctaHref}
                    data-cursor="link"
                    onClick={click}
                    className="relative z-10 mt-5 inline-block w-fit text-xs text-white transition-colors duration-300 hover:text-[#ff004f]"
                  >
                    {service.ctaLabel}
                  </a>
                )}
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
