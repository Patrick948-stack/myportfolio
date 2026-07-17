"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCode,
  FaCubes,
  FaScrewdriverWrench,
  FaCloud,
  FaDiagramProject,
  FaUsers,
  FaLanguage,
  FaCertificate,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { AboutContent } from "@/types";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { useSound } from "./SoundProvider";

type Tab = "skills" | "experience" | "education";
const tabs: Tab[] = ["skills", "experience", "education"];

const skillIconMap: Record<string, IconType> = {
  code: FaCode,
  cubes: FaCubes,
  tools: FaScrewdriverWrench,
  cloud: FaCloud,
  concepts: FaDiagramProject,
  people: FaUsers,
  language: FaLanguage,
  certificate: FaCertificate,
};

export default function About({ content }: { content: AboutContent }) {
  const [activeTab, setActiveTab] = useState<Tab>("skills");
  const { hover, click } = useSound();
  const { skills, experiences, educations } = content;

  return (
    <section id="about" className="py-20 px-[10%] text-[#ababab]">
      <div className="flex flex-wrap justify-between gap-8">
        <Reveal className="flex-[0_0_35%] min-w-[280px]">
          <TiltCard maxTilt={6} className="rounded-2xl">
            <Image
              src={content.photo || "/images/user.png"}
              alt="Patrick Mulikuza"
              width={400}
              height={500}
              className="w-full rounded-2xl"
            />
          </TiltCard>
        </Reveal>

        <Reveal delay={0.1} className="flex-[0_0_60%] min-w-[280px]">
          <h2 className="text-5xl sm:text-6xl font-semibold text-white mb-6">
            About Me
          </h2>

          {content.bio.map((paragraph, i) => (
            <p key={i} className={i === content.bio.length - 1 ? "mb-8" : "mb-4"}>
              {paragraph}
            </p>
          ))}

          <div className="flex gap-8 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  click();
                }}
                onMouseEnter={hover}
                data-cursor="link"
                className={`relative text-lg font-medium capitalize pb-2 transition-colors duration-300 ${
                  activeTab === tab ? "text-white" : "text-[#ababab]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.span
                    layoutId="about-tab-underline"
                    className="absolute left-0 bottom-0 h-[3px] w-1/2 bg-[#ff004f]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === "skills" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {skills.map((category) => {
                      const Icon = skillIconMap[category.iconKey];
                      return (
                        <TiltCard
                          key={category.category}
                          maxTilt={4}
                          className="rounded-xl border border-white/5 bg-[#141414] p-5 transition-colors duration-300 hover:border-[#ff004f]/40"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            {Icon && <Icon className="text-[#ff004f]" />}
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                              {category.category}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {category.items.map((item) => (
                              <span
                                key={item}
                                className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-[#ababab]"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </TiltCard>
                      );
                    })}
                  </div>
                )}

                {activeTab === "experience" && (
                  <ul className="space-y-6">
                    {experiences.map((exp, i) => (
                      <li key={i}>
                        <span className="text-[#b54769] text-sm block">
                          {exp.period}
                        </span>
                        <strong className="text-white block mb-1">
                          {exp.role} — <em>{exp.org}</em>
                        </strong>
                        <p className="text-sm">{exp.description}</p>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "education" && (
                  <ul className="space-y-4">
                    {educations.map((edu, i) => (
                      <li key={i}>
                        <span className="text-[#b54769] text-sm block">
                          {edu.year}
                        </span>
                        <strong className="text-white">{edu.institution}</strong>,{" "}
                        {edu.location}
                        <br />
                        <em>{edu.degree}</em>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
