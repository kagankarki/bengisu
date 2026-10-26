import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";

// Zarif, sıcak bir serif — yalnızca büyük başlıklarda kullanılır.
const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Merhaba Bengisu",
  description: "Sana küçük bir sorum var.",
  // WhatsApp / Instagram / Facebook link önizlemesi (Open Graph)
  openGraph: {
    title: "Merhaba Bengisu",
    description: "Sana küçük bir sorum var.",
    type: "website",
    locale: "tr_TR",
    siteName: "Merhaba Bengisu",
  },
  twitter: {
    card: "summary",
    title: "Merhaba Bengisu",
    description: "Sana küçük bir sorum var.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={display.variable}>
      <body className="app-bg min-h-dvh font-sans text-espresso-800 antialiased">
        {children}
      </body>
    </html>
  );
}
