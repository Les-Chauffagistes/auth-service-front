import type {Metadata} from "next";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Les Chauffagistes — Projet communautaire autour du minage Bitcoin",
    template: "%s | Les Chauffagistes",
  },

  description:
    "Les Chauffagistes est un projet communautaire autour du minage Bitcoin valorisant la chaleur des machines pour le chauffage. Découvrez nos services dont notre pool de minage à 0% de frais.",

  metadataBase: new URL("https://chauffagistes-btc.fr"),

  icons: {
    icon: "/brand-icon.png",
    shortcut: "/brand-icon.png",
    apple: "/brand-icon.png",
  },

  openGraph: {
    title: "Les Chauffagistes — Projet communautaire autour du minage Bitcoin",
    description:
      "Projet communautaire valorisant la chaleur du minage Bitcoin. Découvrez nos services dont notre pool de minage à 0% de frais.",
    url: "https://chauffagistes-btc.fr",
    siteName: "Les Chauffagistes",
    images: [
      {
        url: "/brand.jpg",
        width: 1200,
        height: 630,
        alt: "Les Chauffagistes",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Les Chauffagistes — Projet communautaire autour du minage Bitcoin",
    description:
      "Projet communautaire valorisant la chaleur du minage Bitcoin.",
    images: ["/brand.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
    <head>
      <meta name="theme-color" content="#cc640e"/>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="/config.js"/>
    </head>

    <body>
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
      }}
    >
      {children}
      <Footer/>
    </main>
    </body>
    </html>
  );
}