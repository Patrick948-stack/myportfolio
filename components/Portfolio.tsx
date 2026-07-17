"use client";
import Image from "next/image";
import { FaArrowUpRightFromSquare, FaCode } from "react-icons/fa6";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import Magnetic from "./Magnetic";
import { useSound } from "./SoundProvider";
import type { PortfolioContent } from "@/types";

export default function Portfolio({ content }: { content: PortfolioContent }) {
  const { hover, click } = useSound();
  const projects = content.items;

  return (
    <section id="portfolio" className="px-[10%] py-12">
      <Reveal>
        <h2 className="text-5xl font-semibold text-white sm:text-6xl">
          My Work
        </h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={(i % 3) * 0.1}>
            <TiltCard
              maxTilt={8}
              dataCursor={project.href !== "#" ? "view" : undefined}
              onMouseEnter={hover}
              className="group relative overflow-hidden rounded-xl"
            >
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={300}
                  className="block aspect-[4/3] w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-[#262626] to-[#141414] px-6 text-center transition-transform duration-500 group-hover:scale-110">
                  <FaCode className="text-4xl text-[#ff004f]/60" />
                  <span className="text-sm font-medium text-[#ababab]">
                    {project.title}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 flex h-0 w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-t from-[#ff004f] to-black/60 px-6 text-center text-sm transition-all duration-500 group-hover:h-full">
                <h3 className="mb-3 font-medium leading-snug">{project.title}</h3>
                <p className="line-clamp-4 text-xs leading-relaxed">{project.description}</p>
                {project.href !== "#" && (
                  <Magnetic strength={0.4} className="mt-4">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      onClick={click}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-lg text-[#ff004f]"
                    >
                      <FaArrowUpRightFromSquare />
                    </a>
                  </Magnetic>
                )}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      <Magnetic className="mx-auto mt-12 w-fit">
        <a
          href="https://github.com/Patrick948-stack"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          onClick={click}
          className="block w-fit rounded-lg border border-[#ff004f] px-12 py-3.5 text-white transition-colors duration-500 hover:bg-[#ff004f]"
        >
          See more
        </a>
      </Magnetic>
    </section>
  );
}
