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
  title: "Life.exe — 내 인생은 몇 퍼센트?",
  description: "29,200개의 픽셀. 그게 당신의 인생입니다. 매일 하나의 픽셀에 오늘의 감정을 색칠하세요.",
  openGraph: {
    title: "Life.exe — 내 인생은 몇 퍼센트?",
    description: "매일 하나의 픽셀에 오늘의 감정을 색칠하세요.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life.exe — 내 인생은 몇 퍼센트?",
    description: "매일 하나의 픽셀에 오늘의 감정을 색칠하세요.",
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
