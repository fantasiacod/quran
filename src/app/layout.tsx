import type { Metadata } from "next";
import { Tajawal, Amiri } from "next/font/google";
import "./globals.css";
import ClientComponents from "@/components/ClientComponents";
import SiteSettingsProvider from "@/components/SiteSettingsProvider";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "Quran Memorization for Kids",
  description: "A professional platform for memorizing the Holy Quran",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body
        className={`${tajawal.variable} ${amiri.variable} font-tajawal antialiased min-h-screen bg-background text-foreground flex flex-col`}
      >
        <ClientComponents />
        <SiteSettingsProvider>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
            {children}
          </main>
        </SiteSettingsProvider>
        <footer className="w-full py-8 text-center bg-card/50 border-t border-border mt-auto">
          <div className="max-w-3xl mx-auto px-4">
            <p className="font-amiri text-xl text-primary/80 leading-loose">
              صدقة جارية لي ولوالديّ ولزوجتي ولكل من مر من هنا
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              نسأل الله القبول ولكم الأجر والمثوبة
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
