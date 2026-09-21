import { EmbedBridge } from "@/components/EmbedBridge";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { content } from "@/data/content";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/pencil.css";

export const metadata: Metadata = content.metadata;

const bounded = localFont({
  src: "../../public/fonts/Bounded-Variable.ttf",
  variable: "--font-bounded",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

const onest = localFont({ src: "../../public/fonts/Onest-Variable.ttf", variable: "--font-onest", weight: "100 900", display: "swap" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" data-design="pencil" className={`${bounded.variable} ${onest.variable}`}><body><div id="checku-app" style={{ display: "flow-root" }}>{children}</div><EmbedBridge /></body></html>;
}
