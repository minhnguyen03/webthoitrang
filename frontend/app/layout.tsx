import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AiChatWidget } from "@/components/AiChatWidget";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "./globals.css";
import "./standardized-ui.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} | Thời trang công sở`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["elimaz shop", "thời trang", "quần áo online", "Next.js ecommerce", "Vietnam fashion"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Thời trang công sở`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.heroImage,
        width: 2200,
        height: 1467,
        alt: "Elimaz Shop storefront",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Thời trang hiện đại`,
    description: siteConfig.description,
    images: [siteConfig.heroImage],
  },
  icons: {
    icon: absoluteUrl("/icon.svg"),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#20211f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <div className="siteShell">
          <Header />
          <main className="mainContent">{children}</main>
          <Footer />
          <AiChatWidget />
        </div>
      </body>
    </html>
  );
}
