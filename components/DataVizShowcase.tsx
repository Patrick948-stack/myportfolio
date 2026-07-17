"use client";
import { useEffect, useRef, useState } from "react";
import { FaMountain } from "react-icons/fa6";
import Reveal from "./Reveal";

export default function DataVizShowcase() {
  const plotRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = plotRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    Promise.all([
      import("plotly.js-dist-min"),
      fetch("/everest-elevation.json").then((r) => r.json()),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]).then(([Plotly, data]: [any, { z: (number | null)[][] }]) => {
      if (disposed) return;
      Plotly.newPlot(
        container,
        [
          {
            type: "surface",
            z: data.z,
            colorscale: "Earth",
            showscale: true,
            colorbar: {
              title: { text: "m", side: "right" },
              tickfont: { color: "#ababab", size: 11 },
              titlefont: { color: "#ababab" },
              len: 0.6,
            },
          },
        ],
        {
          paper_bgcolor: "transparent",
          scene: {
            bgcolor: "rgba(0,0,0,0)",
            xaxis: { visible: false },
            yaxis: { visible: false },
            zaxis: {
              title: "Elevation (m)",
              color: "#ababab",
              gridcolor: "#333",
            },
            camera: { eye: { x: 1.4, y: 1.4, z: 0.9 } },
            aspectmode: "manual",
            aspectratio: { x: 1, y: 1, z: 0.5 },
          },
          margin: { l: 0, r: 0, t: 0, b: 0 },
          font: { color: "#ababab", family: "Newsreader, serif" },
        },
        { responsive: true, displayModeBar: false }
      );
      setLoaded(true);
      cleanup = () => Plotly.purge(container);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <section id="visualization" className="px-[10%] py-16">
      <Reveal>
        <h2 className="text-5xl sm:text-6xl font-semibold text-white mb-3">
          Featured Visualization
        </h2>
        <p className="text-[#ababab] mb-8 max-w-2xl text-sm leading-relaxed">
          Interactive 3D elevation map of Mount Everest — built from real survey
          data during my work at the Whitman College Immersive Stories Lab. Drag
          to rotate, scroll to zoom.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-[#141414]">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 animate-pulse">
              <FaMountain className="text-5xl text-white/10" />
              <div className="h-2 w-40 rounded-full bg-white/10" />
              <span className="text-xs text-[#666]">
                Loading elevation data…
              </span>
            </div>
          )}
          <div ref={plotRef} className="w-full h-full" />
        </div>
      </Reveal>
    </section>
  );
}
