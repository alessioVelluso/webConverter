import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'File Converter - Convert Any File Format',
  description: 'Universal file converter supporting images, audio, video, documents, and more',
}

type RootLayoutParams = { children: React.ReactNode }

export default function RootLayout({ children }: RootLayoutParams)
{
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
