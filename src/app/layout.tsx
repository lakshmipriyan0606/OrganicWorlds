import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { CartProvider } from "@/components/cart/CartContext";
import { StoreLayoutWrapper } from "@/components/layout/StoreLayoutWrapper";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Pavishna Organic Worlds",
    "herbal bath soaps",
    "vetiver bath soap",
    "hibiscus bath soap",
    "neem herbal soap",
    "cold-pressed hair oil",
    "Ayurvedic scalp elixir",
    "natural handmade soaps India",
    "plastic-free botanical beauty"
  ],
  authors: [{ name: "Pavishna Organic Worlds" }],
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${bodoni.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-ivory-50 text-charcoal-900 font-body antialiased">
        <CartProvider>
          <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
