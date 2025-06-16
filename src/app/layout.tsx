import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "./shared/components/Layout";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "./shared/providers/QueryClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Road Works Management",
  description: "Application for managing road works documentation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <Layout>{children}</Layout>
        </QueryClientProvider>
      </body>
    </html>
  );
}
