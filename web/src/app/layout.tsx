import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#05140e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ceyloncopilot.pages.dev"),
  title: {
    default: "CeylonCopilot 🇱🇰 | The Intelligent Sri Lanka Travel Assistant & Route Engine",
    template: "%s | CeylonCopilot Sri Lanka",
  },
  description:
    "Explore Sri Lanka like a local with CeylonCopilot: true mountain switchback drive times, Kandy to Ella train copilot, seasonal monsoon radar, safari calendars, dual-pricing transparency, and offline packs.",
  keywords: [
    "Sri Lanka",
    "CeylonCopilot",
    "Sri Lanka travel copilot",
    "Sri Lanka travel assistant",
    "Sri Lanka travel",
    "Sri Lanka itinerary",
    "visit Sri Lanka",
    "Kandy to Ella train",
    "Sri Lanka train tickets",
    "Sigiriya",
    "Sri Lanka safari",
    "Yala National Park",
    "Sri Lanka weather",
    "Sri Lanka monsoon season",
    "Sri Lanka tuk tuk fare",
    "Sri Lanka travel guide",
    "Sri Lanka travel advice 2026",
    "Sri Lanka surfing",
    "Galle Fort",
    "Ella Sri Lanka",
    "Nuwara Eliya",
  ],
  authors: [{ name: "CeylonCopilot Team" }],
  creator: "CeylonCopilot",
  publisher: "CeylonCopilot",
  alternates: {
    canonical: "https://ceyloncopilot.pages.dev",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ceyloncopilot.pages.dev",
    siteName: "CeylonCopilot",
    title: "CeylonCopilot 🇱🇰 | The Intelligent Sri Lanka Travel Assistant",
    description:
      "Travel Sri Lanka without mountain delays, scams, or guesswork. Engineered with real topography routing, scenic train copilot, safari calendars, and fair fare calculator.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Nine Arch Bridge Ella Sri Lanka with Blue Train - CeylonCopilot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CeylonCopilot 🇱🇰 | The Intelligent Sri Lanka Travel Assistant",
    description:
      "Travel Sri Lanka without mountain delays or scams: true topography routing, scenic train copilot, safari guide, and fair fare calculator.",
    images: [
      "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200&auto=format&fit=crop&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ceyloncopilot.pages.dev/#website",
      "url": "https://ceyloncopilot.pages.dev",
      "name": "CeylonCopilot",
      "description": "The Intelligent Sri Lanka Travel Assistant & Route Engine",
      "inLanguage": "en-US",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ceyloncopilot.pages.dev/explore?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "TouristDestination",
      "@id": "https://ceyloncopilot.pages.dev/#destination",
      "name": "Sri Lanka",
      "description": "The Resplendent Isle featuring UNESCO Cultural Triangle citadels, central tea highlands, leopard safaris in Yala, and turquoise southern surf coasts.",
      "url": "https://ceyloncopilot.pages.dev",
      "touristType": ["Cultural tourism", "Eco tourism", "Adventure travel", "Surfing", "Wildlife safari"]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#05140e] text-[#f8fafc] font-sans selection:bg-emerald-500/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
