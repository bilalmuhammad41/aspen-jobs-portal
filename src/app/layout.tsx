import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

import TanstackProvider from "@/provider/tanstack-provider";
import { SessionStoreProvider } from "@/provider/session-store-provider";
import SessionInitializer from "@/components/session-intializer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Aspen Jobs",
  description: "An online portal to manage, view and interact with Jobs at Aspen",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionStoreProvider>
          <TanstackProvider>
            {children}
            <Toaster />
          </TanstackProvider>
        </SessionStoreProvider>
      </body>
    </html>
  );
}
