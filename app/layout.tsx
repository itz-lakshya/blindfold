/**
 * The root layout for the Next.js application.
 * Loads global fonts, sets up the HTML shell, and imports global Tailwind CSS.
 */

import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Three roles, three faces:
// - Newsreader carries the editorial voice (headlines, pull quotes).
// - IBM Plex Sans runs the interface itself — labels, body copy, controls.
// - IBM Plex Mono is reserved for things that are actually data:
//   ratings, contest ids, percentages. Not decoration.
const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const data = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-data",
  display: "swap",
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
    <html lang="en" className={`${display.variable} ${body.variable} ${data.variable}`}>
      <body>{children}</body>
    </html>
  );
}
