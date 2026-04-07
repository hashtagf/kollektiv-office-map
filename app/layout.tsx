import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Kollektiv Office Map',
  description: '2D animated office map showing 16 AI agents working collaboratively at Kollektiv',
  keywords: 'AI, office map, animation, kollektiv, agents, collaboration',
  authors: [{ name: 'Kollektiv AI' }],
  openGraph: {
    title: 'Kollektiv Office Map',
    description: '2D animated office map showing 16 AI agents working collaboratively',
    type: 'website',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}