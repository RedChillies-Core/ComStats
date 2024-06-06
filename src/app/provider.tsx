"use client";

import { PolkadotProvider } from "@/context";
import { BalanceProvider } from "@/context/balanceContext";
import { store } from "@/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <PolkadotProvider wsEndpoint={String(process.env.NEXT_PUBLIC_COMMUNE_API)}>
      <Provider store={store}>
        <BalanceProvider>
          {children} <ToastContainer />
        </BalanceProvider>
      </Provider>
    </PolkadotProvider>
  );
};

export default Providers;
