"use client";
import { useState } from "react";
import { FaLink, FaLinkedin, FaSquareXTwitter, FaCheck } from "react-icons/fa6";
import Magnetic from "@/components/Magnetic";
import { useSound } from "@/components/SoundProvider";

interface ShareButtonsProps {
  title: string;
  url: string;
}

const buttonClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#ababab] transition-colors duration-300 hover:border-[#ff004f] hover:text-[#ff004f]";

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { click, success } = useSound();

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    success();
    setTimeout(() => setCopied(false), 2000);
  }

  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-wider text-[#666]">Share</span>
      <Magnetic strength={0.4}>
        <button
          onClick={handleCopy}
          data-cursor="link"
          aria-label="Copy link"
          className={buttonClass}
        >
          {copied ? <FaCheck className="text-[#ff004f]" /> : <FaLink />}
        </button>
      </Magnetic>
      <Magnetic strength={0.4}>
        <a
          href={xHref}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          onClick={click}
          aria-label="Share on X"
          className={buttonClass}
        >
          <FaSquareXTwitter />
        </a>
      </Magnetic>
      <Magnetic strength={0.4}>
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          onClick={click}
          aria-label="Share on LinkedIn"
          className={buttonClass}
        >
          <FaLinkedin />
        </a>
      </Magnetic>
    </div>
  );
}
