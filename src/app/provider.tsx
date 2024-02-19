"use client"

import { PolkadotProvider } from "@/context"
import { store } from "@/store"
import React, { ReactNode } from "react"
import { Provider } from "react-redux"

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <PolkadotProvider wsEndpoint={String(process.env.NEXT_PUBLIC_COMMUNE_API)}>
      <Provider store={store}>{children}</Provider>
    </PolkadotProvider>
  )
}

export default Providers
