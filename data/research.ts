import type { ResearchPaper } from "@/types";

export const papers: ResearchPaper[] = [
  {
    id: "astro-agent",
    iconKey: "robot",
    tag: "ML / AI",
    title: "Astro-Agent Research Proposal",
    description:
      "Proposes a multi-agent AI system to address the flood of new astronomy papers by extracting physical parameters from articles and cross-verifying them against official catalogs like SIMBAD and Gaia—flagging discrepancies and surfacing discoveries far faster than manual review.",
    href: "/Astro_agent_research_proposal_Final_Version.pdf",
  },
  {
    id: "cell-phone-radiation",
    iconKey: "tower-broadcast",
    tag: "Physics",
    title: "Cell Phone Radiation Safety",
    description:
      "Investigates whether radiation from phones and cell towers poses a cancer risk, concluding that non-ionizing signals lack the energy to cause cellular damage. Personal devices are a larger exposure source than distant towers, yet both remain well within legal safety limits.",
    href: "/Cell%20Phone%20Radiation%20Safety.pdf",
  },
  {
    id: "crazy-bounces",
    iconKey: "basketball",
    tag: "Physics",
    title: "Investigating Crazy Bounces",
    description:
      "Applies Newtonian mechanics to explain why a tennis ball rebounds nearly seven times its drop height when stacked on a basketball. Compares theoretical predictions against real-world experiments and accounts for energy loss and timing effects.",
    href: "/Investigating%20Crazy%20Bounces.pdf",
  },
  {
    id: "power-privilege",
    iconKey: "scale-balanced",
    tag: "Reflection",
    title: "Power and Privilege Symposium Reflection",
    description:
      "Connects a talk on ethnic cleansing to systemic inequalities in physics, exploring the \"Matilda Effect\"—the historical erasure of women's scientific contributions—and arguing that even a field built on objective truth must actively dismantle ingrained social privilege.",
    href: "/Power_and_Privilege_Symposium_Reflection.pdf",
  },
  {
    id: "relativistic-photography",
    iconKey: "rocket",
    tag: "Physics / CS",
    title: "Simulating Relativistic Photography with Python",
    description:
      "Uses Python simulations to visualize how a book would appear when moving at 95% the speed of light. Reveals that rather than simply looking compressed, the object appears twisted due to the Terrell-Penrose effect.",
    href: "/Simulating%20Relativistic%20Photography%20with%20Python.pdf",
  },
  {
    id: "diffraction-metrology",
    iconKey: "microscope",
    tag: "Physics",
    title: "Testing Reliability of Diffraction Metrology",
    description:
      "Demonstrates how the wave nature of light can measure a human hair's diameter without contact. Using red and green lasers and Babinet's principle, both wavelengths produced consistent results, validating diffraction metrology as a reliable high-precision technique.",
    href: "/Testing%20Reliability%20of%20Diffraction%20Metrology.pdf",
  },
  {
    id: "electric-fields",
    iconKey: "bolt",
    tag: "Physics",
    title: "Electric Fields and Van der Waals Forces",
    description:
      "Models water molecules as electric dipoles to calculate the hidden forces that hold liquid water together and explain why ice, water, and steam behave so differently. Concludes that as charges balance out, their influence vanishes almost instantly beyond a material's surface.",
    href: "/electric_fields_vdw_noimages.pdf",
  },
];
