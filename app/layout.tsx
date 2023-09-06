import "./globals.css";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/react';


export const metadata = {
  title: "Continue.lol",
  description: "Continue any music with generative AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script async src="https://js.stripe.com/v3/"></script>
        <Script async src="https://js.stripe.com/v3/pricing-table.js" />
        <main className="min-h-screen bg-background flex flex-col items-center">
          {children}
          <Analytics />

        </main>
      </body>
    </html>
  );
}
