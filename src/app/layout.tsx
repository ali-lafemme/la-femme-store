import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "La Femme - متجر التجميل والعناية بالجمال",
  description: "متجر La Femme الإلكتروني للمكياج والعناية بالبشرة والشعر والأظافر. منتجات عالية الجودة بأسعار منافسة",
  keywords: "مكياج, عناية بالبشرة, شعر, أظافر, تجميل, La Femme",
  authors: [{ name: "La Femme" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${tajawal.variable} antialiased bg-gradient-to-br from-pink-50 to-purple-50`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
