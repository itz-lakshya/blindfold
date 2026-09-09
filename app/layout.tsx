/**
 * The root layout for the Next.js application.
 * Loads global fonts, sets up the HTML shell, and imports global Tailwind CSS.
 */

import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: false,
});

const data = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-data",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Blindfold — practice Codeforces without knowing what you're practicing",
  description:
    "Set a rating range, nudge a few tags, and let Blindfold pick a Codeforces problem. You see the problem. You never see why it was chosen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${data.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('blindfold_theme');
              if (theme && theme !== 'default') {
                document.documentElement.classList.add('theme-' + theme);
              }
            } catch (e) {}
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
