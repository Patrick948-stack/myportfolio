"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { playClickSound, playHoverSound, playSuccessSound } from "@/lib/sound";

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  hover: () => void;
  click: () => void;
  success: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = "sound-enabled";

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // `localStorage` doesn't exist during SSR. Rendering `false` on both the
    // server and the client's first hydration pass (then syncing the real
    // value here) avoids a hydration mismatch on the sound-toggle icon.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      if (next) playClickSound();
      return next;
    });
  }, []);

  const hover = useCallback(() => {
    if (enabled) playHoverSound();
  }, [enabled]);

  const click = useCallback(() => {
    if (enabled) playClickSound();
  }, [enabled]);

  const success = useCallback(() => {
    if (enabled) playSuccessSound();
  }, [enabled]);

  return (
    <SoundContext.Provider value={{ enabled, toggle, hover, click, success }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
