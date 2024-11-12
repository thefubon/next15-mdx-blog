import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Next.js 15 | MDX Blog',
  description: 'Sample MDX Blog for Next.js 15',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
