import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ShoppingCartProvider } from "@/lib/useShoppingCart";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "E-commerce Store",
  description: "Your one-stop shop for everything!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} font-sans`}>
          <ShoppingCartProvider>{children}</ShoppingCartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
