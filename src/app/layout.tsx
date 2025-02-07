import { Web3Provider } from "@/components/web3-provider"
import { Toaster } from "@shadcn/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Ethereum Calldata Playground",
  description: "A playground for Ethereum calldata",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>
          <main>{children}</main>
        </Web3Provider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
