import type { Metadata } from "next"
import Providers from "./provider"
import "react-responsive-modal/styles.css"
import "./globals.css"
import "react-toastify/dist/ReactToastify.css"

export const metadata: Metadata = {
  title: "ComStats",
  description: "All Statistics of CommuneAI at one place. Staking infrastructure, prices, validators, miners, swap, bridge, exchange for $COMAI",
  keywords: [
    "CommuneAI",
    "Bitensor",
    "AI",
    "Staking",
    "COMAI",
    "Validators",
    "ComStats",
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
