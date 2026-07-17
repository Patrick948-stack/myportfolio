"use client";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaPaperPlane,
  FaSquarePhone,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSquareXTwitter,
  FaCheck,
  FaTriangleExclamation,
  FaGlobe,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import { useSound } from "./SoundProvider";
import type { ContactContent } from "@/types";

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyAxbxsOu8NKw-7QD5vxQBaMKRfV8ptcC6RhQnu0Is82n9XbQ67ECIqEEduaehVRCVGCA/exec";

const socialIconMap: Record<string, IconType> = {
  facebook: FaFacebook,
  twitter: FaSquareXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
};

type Status = "idle" | "sending" | "success" | "error";

const fields = [
  { name: "Name", type: "text", label: "Your Name" },
  { name: "email", type: "email", label: "Your Email" },
];

export default function Contact({ content }: { content: ContactContent }) {
  const [status, setStatus] = useState<Status>("idle");
  const { click, success: successSound } = useSound();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      await fetch(SHEET_URL, { method: "POST", body: new FormData(form) });
      setStatus("success");
      successSound();
      form.reset();
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <section id="contact">
      <div className="px-[10%] py-12">
        <div className="flex flex-wrap justify-between gap-12">
          <Reveal className="flex-[0_0_35%] min-w-[280px]">
            <h2 className="text-5xl sm:text-6xl font-semibold text-white mb-8">
              Contact Me
            </h2>
            <p className="flex items-center gap-4 mt-6 text-[#ababab]">
              <FaPaperPlane className="text-[#ff004f] text-2xl shrink-0" />
              {content.email}
            </p>
            <p className="flex items-center gap-4 mt-4 text-[#ababab]">
              <FaSquarePhone className="text-[#ff004f] text-2xl shrink-0" />
              {content.phone}
            </p>
            <div className="flex gap-4 mt-8">
              {content.social.map(({ href, label }) => {
                const Icon = socialIconMap[label.toLowerCase()] ?? FaGlobe;
                return (
                  <Magnetic key={label} strength={0.5}>
                    <a
                      href={href || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      onClick={click}
                      className="text-[#ababab] text-3xl transition-colors duration-300 hover:text-[#ff004f] block"
                    >
                      <Icon />
                    </a>
                  </Magnetic>
                );
              })}
            </div>
            <Magnetic className="mt-8 inline-block">
              <a
                href="/my-cv.pdf"
                download
                data-cursor="link"
                onClick={click}
                className="inline-block bg-[#ff004f] border border-[#ff004f] px-12 py-3.5 rounded-lg text-white transition-colors duration-500 hover:bg-[#cc003f]"
              >
                Download CV
              </a>
            </Magnetic>
          </Reveal>

          <Reveal delay={0.1} className="flex-[0_0_60%] min-w-[280px]">
            <form onSubmit={handleSubmit} className="w-full">
              {fields.map((field) => (
                <div key={field.name} className="relative mt-3 mb-3">
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder=" "
                    required
                    disabled={status === "sending"}
                    className="peer w-full bg-[#262626] px-4 pt-6 pb-2 text-white text-lg rounded-lg outline-none border border-transparent focus:border-[#ff004f] transition-colors duration-300 placeholder:text-transparent disabled:opacity-60"
                  />
                  <label className="pointer-events-none absolute left-4 top-4 text-[#666] text-lg transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#ff004f] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
                    {field.label}
                  </label>
                </div>
              ))}
              <div className="relative mt-3 mb-3">
                <textarea
                  name="Message"
                  rows={6}
                  placeholder=" "
                  disabled={status === "sending"}
                  className="peer w-full bg-[#262626] px-4 pt-6 pb-2 text-white text-lg rounded-lg outline-none border border-transparent focus:border-[#ff004f] transition-colors duration-300 resize-none placeholder:text-transparent disabled:opacity-60"
                />
                <label className="pointer-events-none absolute left-4 top-4 text-[#666] text-lg transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#ff004f] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
                  Your Message
                </label>
              </div>

              <Magnetic strength={0.2} className="mt-3 inline-block">
                <motion.button
                  type="submit"
                  data-cursor="link"
                  disabled={status === "sending"}
                  whileHover={status === "idle" ? { scale: 1.03 } : undefined}
                  whileTap={status === "idle" ? { scale: 0.97 } : undefined}
                  className="relative flex h-[54px] w-48 items-center justify-center overflow-hidden rounded-lg border border-[#ff004f] bg-[#ff004f] text-lg text-white transition-colors duration-500 disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {status === "idle" && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        Submit
                      </motion.span>
                    )}
                    {status === "sending" && (
                      <motion.span
                        key="sending"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      />
                    )}
                    {status === "success" && (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="flex items-center gap-2 text-base"
                      >
                        <FaCheck /> Sent
                      </motion.span>
                    )}
                    {status === "error" && (
                      <motion.span
                        key="error"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 12 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <FaTriangleExclamation /> Retry
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </Magnetic>
            </form>
          </Reveal>
        </div>
      </div>

      <div className="w-full text-center py-6 bg-[#262626] font-light mt-5 text-sm">
        <p>
          Copyright &copy; MMP. Made with{" "}
          <span className="text-[#ff004f]">♥</span> by Patrick Mulikuza
        </p>
      </div>
    </section>
  );
}
