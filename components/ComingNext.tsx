"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FaCode, FaXmark } from "react-icons/fa6";
import Reveal from "./Reveal";
import type { ComingNextContent, ComingNextProject } from "@/types";

const HOVER_CLOSE_DELAY = 150;
const PIXELS_PER_SECOND = 40;
const CARD_WIDTH = 224; // w-56
const CARD_GAP = 24; // gap-6

function ProjectCard({
  project,
  onEnter,
  onLeave,
}: {
  project: ComingNextProject;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onEnter}
      className="group relative h-80 w-56 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#262626] to-[#141414]"
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="224px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-5 text-center transition-transform duration-500 group-hover:scale-110">
          <FaCode className="text-4xl text-[#ff004f]/60" />
          <span className="text-sm font-medium text-[#ababab]">{project.name}</span>
        </div>
      )}
      {project.image && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
          <span className="text-sm font-medium text-white">{project.name}</span>
        </div>
      )}
    </div>
  );
}

function ProjectDetail({
  project,
  onEnter,
  onLeave,
}: {
  project: ComingNextProject;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const total = project.todos.length;
  const done = project.todos.filter((todo) => todo.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#141414] p-8"
      >
        <button
          type="button"
          onClick={onLeave}
          aria-label="Close"
          className="float-right text-[#ababab] hover:text-white"
        >
          <FaXmark />
        </button>
        <h3 className="text-2xl font-semibold text-white">{project.name}</h3>

        <p className="mt-5 text-xs font-medium uppercase tracking-wider text-[#ff004f]">
          Need behind / inspiration
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[#ababab]">{project.needBehind}</p>

        <p className="mt-5 text-xs font-medium uppercase tracking-wider text-[#ff004f]">
          Project description
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[#ababab]">{project.description}</p>

        {project.techStack.length > 0 && (
          <>
            <p className="mt-5 text-xs font-medium uppercase tracking-wider text-[#ff004f]">Tech stack</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-[#ababab]">
                  {tech}
                </span>
              ))}
            </div>
          </>
        )}

        {total > 0 && (
          <>
            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-[#ff004f]">Plan</p>
              <span className="text-xs text-[#ababab]">{pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#ff004f] transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <ul className="mt-3 flex flex-col gap-1.5">
              {project.todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`flex items-start gap-2 text-sm leading-snug ${
                    todo.done ? "text-[#666] line-through" : "text-[#ababab]"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">{todo.done ? "☑" : "☐"}</span>
                  <span>{todo.text}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ComingNext({ content }: { content: ComingNextContent }) {
  const projects = content.items;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function measure() {
      if (el) setContainerWidth(el.clientWidth);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function open(id: string) {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenId(id);
  }
  function scheduleClose() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => setOpenId(null), HOVER_CLOSE_DELAY);
  }

  if (projects.length === 0) return null;

  const openProject = projects.find((project) => project.id === openId) ?? null;
  const naturalWidth = projects.length * CARD_WIDTH + Math.max(0, projects.length - 1) * CARD_GAP;
  const shouldScroll = containerWidth > 0 && naturalWidth > containerWidth;
  const duration = naturalWidth / PIXELS_PER_SECOND;

  return (
    <section id="coming-next" className="px-[10%] py-12">
      <Reveal>
        <h2 className="text-5xl font-semibold text-white sm:text-6xl">Coming Next</h2>
        <p className="mt-3 max-w-xl text-[#ababab]">
          Projects I&rsquo;m thinking of building next. Tap or hover a card for the full plan.
        </p>
      </Reveal>

      <div ref={containerRef} className="relative mt-12 overflow-hidden">
        <div
          style={
            shouldScroll
              ? {
                  animation: `coming-next-scroll ${duration}s linear infinite`,
                  animationPlayState: openId ? "paused" : "running",
                }
              : undefined
          }
          className="flex w-max gap-6"
        >
          {(shouldScroll ? [...projects, ...projects] : projects).map((project, i) => (
            <ProjectCard
              key={`${project.id}-${i}`}
              project={project}
              onEnter={() => open(project.id)}
              onLeave={scheduleClose}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openProject && (
          <ProjectDetail project={openProject} onEnter={() => open(openProject.id)} onLeave={scheduleClose} />
        )}
      </AnimatePresence>
    </section>
  );
}
