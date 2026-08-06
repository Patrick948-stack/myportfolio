import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import ComingNext from "@/components/ComingNext";
import DataVizShowcase from "@/components/DataVizShowcase";
import Research from "@/components/Research";
import LatestPosts from "@/components/blog/LatestPosts";
import Contact from "@/components/Contact";
import { getSiteContent } from "@/lib/site-content";

// Every section below reads from the live site_content DB — this route
// can't be statically prerendered at build time (no DATABASE_URL then).
export const dynamic = "force-dynamic";

export default async function Home() {
  const [hero, about, services, portfolio, comingNext, contact] = await Promise.all([
    getSiteContent("hero"),
    getSiteContent("about"),
    getSiteContent("services"),
    getSiteContent("portfolio"),
    getSiteContent("comingNext"),
    getSiteContent("contact"),
  ]);

  return (
    <main>
      <Hero content={hero} />
      <About content={about} />
      <Services content={services} />
      <Portfolio content={portfolio} />
      <ComingNext content={comingNext} />
      <DataVizShowcase />
      <Research />
      <LatestPosts />
      <Contact content={contact} />
    </main>
  );
}
