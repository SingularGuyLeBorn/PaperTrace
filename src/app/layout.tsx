import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "PaperTrace — Interactive ML Paper Deep-Dives",
  description:
    "Interactive deep-dives into ML papers with formulas, visualizations, and walk-through examples.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Run before React hydrates — sets data-lang on <html> from localStorage.
            This prevents the EN→ZH flash AND the hydration mismatch. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem('papertrace-lang');if(l==='zh')document.documentElement.setAttribute('data-lang','zh');}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
