"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Scene3D from "./Scene3D";
import RobotEye from "./RobotEye";
import Magnetic from "./Magnetic";
import Typewriter from "./Typewriter";
import { useSound } from "./SoundProvider";
import type { HeroContent } from "@/types";

export default function Hero({ content }: { content: HeroContent }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { hover, click } = useSound();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const headlineScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div
      id="header"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={
          content.backgroundImage
            ? { y: bgY, backgroundImage: `url(${content.backgroundImage})` }
            : { y: bgY }
        }
        className={`absolute inset-0 scale-110 bg-cover bg-center ${
          content.backgroundImage ? "" : "hero-bg"
        }`}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0b0d]"
      />

      <div className="pointer-events-none absolute right-[4%] top-[10%] hidden h-[380px] w-[380px] opacity-90 md:block lg:h-[460px] lg:w-[460px]">
        <Scene3D />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-24 right-4 z-10 h-24 w-24 sm:bottom-24 sm:right-[4%] sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-[180px] lg:w-[180px]"
      >
        <RobotEye />
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full flex-col px-[10%]"
      >
        <div className="mt-28 max-w-3xl sm:mt-32 md:mt-[18%]">
          <p className="min-h-[1.5em] text-base font-medium tracking-wide text-[#ff004f] sm:text-lg">
            <Typewriter words={content.titles} />
          </p>
          <motion.h1
            style={{ scale: headlineScale }}
            className="mt-6 origin-left text-2xl font-semibold leading-[1.15] sm:text-4xl lg:text-5xl"
          >
            {content.headline}
          </motion.h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#ababab] sm:text-base">
            {content.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Magnetic className="inline-block">
              <a
                href="/my-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                onMouseEnter={hover}
                onClick={click}
                className="inline-flex items-center gap-3 rounded-full bg-[#ff004f] px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-[#cc003f]"
              >
                View My Resume
              </a>
            </Magnetic>
            <Magnetic className="inline-block">
              <a
                href="#services"
                data-cursor="link"
                onMouseEnter={hover}
                onClick={click}
                className="inline-flex items-center gap-3 rounded-full border border-[#ff004f] px-8 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 hover:bg-[#ff004f]"
              >
                My Services
              </a>
            </Magnetic>
          </div>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[#ababab]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-[#ababab] to-transparent" />
      </motion.div>
    </div>
  );
}
