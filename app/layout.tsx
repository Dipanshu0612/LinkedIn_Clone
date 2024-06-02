import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="bg-white sticky top-0 z-50 border-b"><Header /></header>
        <div className="flex-1 bg-[#F4F2ED] w-full">
          <main>{children}</main>
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}
