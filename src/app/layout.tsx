"use client";

import "./globals.css";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import dynamic from "next/dynamic";

// Import Starfield with SSR disabled to avoid hydration mismatch
const Starfield = dynamic(
  () => import("@/components/starfield").then((mod) => mod.Starfield),
  {
    ssr: false,
  }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PageContainer background={<Starfield />} title={<PageTitle />}>
          {children}
        </PageContainer>
      </body>
    </html>
  );
}
