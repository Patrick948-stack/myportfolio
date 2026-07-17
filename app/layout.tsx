import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/SoundProvider";
import SiteChrome from "@/components/SiteChrome";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Patrick Mulikuza — Portfolio",
  description:
    "Software engineer and physics researcher building lab instrumentation, web apps, and data visualizations.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-[#0a0b0d] text-white antialiased font-sans">
        <SoundProvider>
          <SiteChrome>{children}</SiteChrome>
        </SoundProvider>
      </body>
    </html>
  );
}
