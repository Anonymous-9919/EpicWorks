import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { LocaleProvider } from "@/lib/locale";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Epic Works — Premium Auto Protection & Care Kuwait",
  description:
    "Kuwait's premier auto protection studio. Professional PPF paint protection film, car wash, detailing, solar tinting & body workshop. COVERGARD & XPEL certified. Mobile service across Kuwait.",
  keywords: "PPF,Kuwait,car wash,paint protection film,solar tinting,car detailing,auto protection,COVERGARD,XPEL,Kuwait car wash",
  openGraph: {
    title: "Epic Works — Premium Auto Protection & Care Kuwait",
    description: "Kuwait's premier auto protection studio. PPF, car wash, detailing, tinting & more. Mobile service across Kuwait.",
    siteName: "Epic Works",
    locale: "en_KW",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-secondary focus:text-primary focus:rounded-xl focus:text-sm focus:font-semibold">
          Skip to content
        </a>
        <LocaleProvider>
          <Header />
          <main id="main-content" className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <CartDrawer />
        </LocaleProvider>
      </body>
    </html>
  );
}
