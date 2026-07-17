"use client";
import {
  FaArrowUpRightFromSquare,
  FaRobot,
  FaTowerBroadcast,
  FaBasketball,
  FaScaleBalanced,
  FaRocket,
  FaMicroscope,
  FaBolt,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import { papers } from "@/data/research";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { useSound } from "./SoundProvider";

const iconMap: Record<string, IconType> = {
  robot: FaRobot,
  "tower-broadcast": FaTowerBroadcast,
  basketball: FaBasketball,
  "scale-balanced": FaScaleBalanced,
  rocket: FaRocket,
  microscope: FaMicroscope,
  bolt: FaBolt,
};

export default function Research() {
  const { hover, click } = useSound();

  return (
    <section id="research" className="px-[10%] py-20">
      <Reveal>
        <h2 className="text-5xl sm:text-6xl font-semibold text-white">
          Research &amp; Writing
        </h2>
      </Reveal>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 mt-12">
        {papers.map((paper, i) => {
          const Icon = iconMap[paper.iconKey];
          return (
            <Reveal key={paper.id} delay={(i % 3) * 0.08}>
              <TiltCard
                maxTilt={5}
                onMouseEnter={hover}
                className="bg-[#262626] rounded-xl p-8 flex flex-col h-full border border-transparent transition-colors duration-300 hover:border-[#ff004f]"
              >
                {Icon && <Icon className="text-4xl text-[#ff004f] mb-4" />}
                <span className="inline-block bg-[#ff004f]/10 text-[#ff004f] text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded mb-4 w-fit">
                  {paper.tag}
                </span>
                <h3 className="text-lg font-semibold text-white mb-3 leading-snug">
                  {paper.title}
                </h3>
                <p className="text-[#ababab] text-sm leading-relaxed flex-1">
                  {paper.description}
                </p>
                <a
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  onClick={click}
                  className="inline-flex items-center gap-2 mt-5 text-[#ff004f] text-sm font-medium transition-all duration-200 hover:gap-3 w-fit"
                >
                  Read Paper <FaArrowUpRightFromSquare className="text-xs" />
                </a>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
