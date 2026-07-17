"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaHouse,
  FaUser,
  FaScrewdriverWrench,
  FaImages,
  FaChartLine,
  FaFlaskVial,
  FaBook,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaDownload,
  FaMagnifyingGlass,
  FaKeyboard,
  FaVolumeHigh,
  FaVolumeXmark,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import { useSound } from "./SoundProvider";

interface CommandAction {
  id: string;
  label: string;
  hint: string;
  icon: IconType;
  perform: () => void;
}

export function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true;
  let qi = 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

const SHORTCUTS = [
  { keys: "⌘K / Ctrl K", description: "Open the command menu" },
  { keys: "↑ ↓", description: "Move through results" },
  { keys: "Enter", description: "Run the highlighted command" },
  { keys: "Esc", description: "Close any open panel" },
  { keys: "?", description: "Toggle this shortcuts panel" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { enabled, toggle, click, hover } = useSound();
  const router = useRouter();

  const goToSection = useCallback(
    (id: string) => {
      if (window.location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/#${id}`);
      }
    },
    [router]
  );

  const actions: CommandAction[] = useMemo(
    () => [
      { id: "home", label: "Go to Home", hint: "Hero section", icon: FaHouse, perform: () => goToSection("header") },
      { id: "about", label: "Go to About", hint: "Skills, experience, education", icon: FaUser, perform: () => goToSection("about") },
      { id: "services", label: "Go to Services", hint: "What I do", icon: FaScrewdriverWrench, perform: () => goToSection("services") },
      { id: "portfolio", label: "Go to Portfolio", hint: "Project work", icon: FaImages, perform: () => goToSection("portfolio") },
      { id: "viz", label: "Go to Featured Visualization", hint: "Interactive 3D Everest map", icon: FaChartLine, perform: () => goToSection("visualization") },
      { id: "research", label: "Go to Research & Writing", hint: "Papers and reflections", icon: FaFlaskVial, perform: () => goToSection("research") },
      { id: "blog", label: "Go to Blog", hint: "Writing on physics, data viz, and AI", icon: FaBook, perform: () => router.push("/blog") },
      { id: "contact", label: "Go to Contact", hint: "Get in touch", icon: FaEnvelope, perform: () => goToSection("contact") },
      {
        id: "sound",
        label: enabled ? "Mute sound effects" : "Enable sound effects",
        hint: "Toggle UI sound design",
        icon: enabled ? FaVolumeHigh : FaVolumeXmark,
        perform: toggle,
      },
      {
        id: "cv",
        label: "Download CV",
        hint: "PDF résumé",
        icon: FaDownload,
        perform: () => window.open("/my-cv.pdf", "_blank"),
      },
      {
        id: "github",
        label: "Open GitHub",
        hint: "github.com/Patrick948-stack",
        icon: FaGithub,
        perform: () => window.open("https://github.com/Patrick948-stack", "_blank"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        hint: "linkedin.com/in/mulikuzap",
        icon: FaLinkedin,
        perform: () => window.open("https://www.linkedin.com/in/mulikuzap/", "_blank"),
      },
      {
        id: "email",
        label: "Email Patrick",
        hint: "patrickmulikuza948@gmail.com",
        icon: FaEnvelope,
        perform: () => window.open("mailto:patrickmulikuza948@gmail.com"),
      },
    ],
    [enabled, toggle, router, goToSection]
  );

  const results = useMemo(
    () =>
      actions.filter(
        (a) => fuzzyMatch(query, a.label) || fuzzyMatch(query, a.hint)
      ),
    [actions, query]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShortcutsOpen(false);
        setQuery("");
        setSelected(0);
        setOpen((prev) => !prev);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        setShortcutsOpen(false);
        return;
      }
      if (!isTyping && e.key === "?") {
        e.preventDefault();
        setOpen(false);
        setShortcutsOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  function runAction(action: CommandAction) {
    action.perform();
    click();
    setOpen(false);
    setQuery("");
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const action = results[selected];
      if (action) runAction(action);
    }
  }

  return (
    <>
      <motion.button
        onClick={() => {
          setSelected(0);
          setOpen(true);
        }}
        onMouseEnter={hover}
        data-cursor="link"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-[#262626]/80 px-4 py-3 text-xs text-[#ababab] backdrop-blur-md transition-colors duration-300 hover:border-[#ff004f] hover:text-[#ff004f]"
        aria-label="Open command menu"
      >
        <FaMagnifyingGlass />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <FaMagnifyingGlass className="text-[#ababab]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelected(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Jump to a section or run a command…"
                  className="w-full bg-transparent text-white outline-none placeholder:text-[#666]"
                />
                <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-[#ababab]">
                  Esc
                </kbd>
              </div>

              <ul className="max-h-80 overflow-y-auto p-2">
                {results.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-[#666]">
                    No commands match &ldquo;{query}&rdquo;
                  </li>
                )}
                {results.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <li key={action.id}>
                      <button
                        onClick={() => runAction(action)}
                        onMouseEnter={() => setSelected(i)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-150 ${
                          i === selected ? "bg-[#ff004f]/15 text-white" : "text-[#ababab]"
                        }`}
                      >
                        <Icon className={i === selected ? "text-[#ff004f]" : ""} />
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-white">
                            {action.label}
                          </span>
                          <span className="block text-xs text-[#666]">{action.hint}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shortcutsOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShortcutsOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Keyboard shortcuts"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center gap-2 text-white">
                <FaKeyboard className="text-[#ff004f]" />
                <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              </div>
              <ul className="space-y-3">
                {SHORTCUTS.map((s) => (
                  <li key={s.keys} className="flex items-center justify-between text-sm">
                    <span className="text-[#ababab]">{s.description}</span>
                    <kbd className="rounded border border-white/10 px-2 py-1 text-xs text-white">
                      {s.keys}
                    </kbd>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
