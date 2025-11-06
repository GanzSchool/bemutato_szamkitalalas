import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Number Guessing Game',
  description: 'Try to guess the number between 1-100',
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
