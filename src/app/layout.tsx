import type { Metadata } from "next";
import { Providers } from "./components/providers";
import SimpleNavigation from "./components/SimpleNavigation";

import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import "./styles/wallet-override.css"; // Custom z-index overrides for wallet modals

export const metadata: Metadata = {
  title: "Creative Memberships",
  description: "Unlock Your Creativity",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <Providers>
          <SimpleNavigation />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
