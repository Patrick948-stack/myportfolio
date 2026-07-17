"use client";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useSound } from "./SoundProvider";

export default function SoundToggle() {
  const { enabled, toggle } = useSound();

  return (
    <motion.button
      onClick={toggle}
      aria-label={enabled ? "Mute sound effects" : "Enable sound effects"}
      aria-pressed={enabled}
      data-cursor="link"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#262626]/80 backdrop-blur-md border border-white/10 text-[#ababab] flex items-center justify-center hover:border-[#ff004f] hover:text-[#ff004f] transition-colors duration-300"
    >
      {enabled ? <FaVolumeHigh /> : <FaVolumeXmark />}
    </motion.button>
  );
}
