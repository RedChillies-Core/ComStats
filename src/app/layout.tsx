import type { Metadata } from "next"
import Navbar from "@/app/components/navbar"
import Providers from "@/app/provider"
import "react-responsive-modal/styles.css"
import "react-toastify/dist/ReactToastify.css"
import "react-tooltip/dist/react-tooltip.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "ComStats",
  description:
    "All Statistics of CommuneAI at one place. Staking infrastructure, prices, validators, miners, swap, bridge, exchange for $COMAI",
  keywords: [
    "CommuneAI",
    "Bitensor",
    "AI",
    "Staking",
    "COMAI",
    "Validators",
    "ComStats",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
