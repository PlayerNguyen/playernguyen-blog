import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import { environment } from "@/configs";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: environment.siteUrl,
  title: "PlayerNguyen Blog",
  description: "Personal blog of PlayerNguyen.",
};

/**
 * Defines the application shell shared by every route.
 *
 * @param props - The root layout props, including the routed `children`.
 * @returns The root HTML document element.
 *
 * @example
 * ```tsx
 * // Applied automatically by Next.js around all routes
 * <RootLayout>{children}</RootLayout>
 * ```
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
