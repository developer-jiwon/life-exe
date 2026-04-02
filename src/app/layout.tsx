import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
})

const pretendard = localFont({
  src: [
    { path: "../fonts/PretendardVariable.woff2", style: "normal" },
  ],
  variable: "--font-pretendard",
  fallback: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
})

export const metadata: Metadata = {
  title: "Life.exe — How far along are you?",
  description: "Your life in numbers. Heartbeats, seasons, sunsets, and the people who changed the world at your age.",
  openGraph: {
    title: "Life.exe — How far along are you?",
    description: "Your life in numbers. Heartbeats, seasons, sunsets, and people who changed the world at your age.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life.exe — How far along are you?",
    description: "Your life in numbers. Heartbeats, seasons, sunsets, and the people who changed the world at your age.",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FAFAFA",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${jakarta.variable} ${pretendard.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4588308927468413"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
