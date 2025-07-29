import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Manga Colorizer - AI-Powered Manga Colorization',
  description: 'Transform black and white manga into vibrant colored images using advanced AI technology. Upload your manga pages and watch them come to life with intelligent colorization.',
  keywords: 'manga, colorization, AI, image processing, anime, comic',
  authors: [{ name: 'Manga Colorizer Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}