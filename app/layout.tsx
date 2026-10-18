import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C.A.N.D.I.D.A. | Cognitive Adaptive Neural Digital Intelligence",
  description:
    "Cognitive Adaptive Neural Digital Intelligence & Decision Assistant — a modular AI command center for cognitive augmentation and decision support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-candida-bg text-zinc-200 antialiased">
        {children}
      </body>
    </html>
  );
}
