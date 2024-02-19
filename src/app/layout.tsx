import type { Metadata } from "next"
import "react-responsive-modal/styles.css"
import "./globals.css"
import Providers from "./provider"

export const metadata: Metadata = {
  title: "ComStats",
  description: "Comstats is the one stop solution for Commune AI.",
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
