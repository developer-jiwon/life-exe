import { NextRequest, NextResponse } from 'next/server'

const BOT_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'facebookcatalog',
  'Instagram',
  'Threadbot',
  'meta-externalagent',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'WhatsApp',
  'kakaotalk-scrap',
  'googlebot',
  'bingbot',
  'bot',
  'crawl',
  'spider',
  'preview',
  'fetch',
]

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || ''
  const isBot = BOT_AGENTS.some(bot => ua.toLowerCase().includes(bot.toLowerCase()))

  const path = request.nextUrl.pathname
  // JS를 실행 안 하는 요청 = 크롤러일 가능성 높음
  const accept = request.headers.get('accept') || ''
  const noJS = !request.headers.get('sec-fetch-dest') // 브라우저는 sec-fetch-dest 보냄, 크롤러는 안 보냄
  const looksLikeBot = isBot || (noJS && !accept.includes('*/*'))

  if (looksLikeBot && (path === '/' || path === '' || path === '/life' || path === '/start' || path === '/me')) {
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Life.exe — How far along are you?</title>
<meta name="description" content="Your life in numbers. Heartbeats, seasons, sunsets, and the people who changed the world at your age.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://so.now-then.dev">
<meta property="og:title" content="Life.exe — How far along are you?">
<meta property="og:description" content="Your life in numbers. Heartbeats, seasons, sunsets, and the people who changed the world at your age.">
<meta property="og:image" content="https://so.now-then.dev/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Life.exe — How far along are you?">
<meta name="twitter:description" content="Your life in numbers. Heartbeats, seasons, sunsets, and the people who changed the world at your age.">
<meta name="twitter:image" content="https://so.now-then.dev/og-image.png">
</head>
<body></body>
</html>`

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/life'],
}
