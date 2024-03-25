import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"

export const setWallet = (wallet: InjectedAccountWithMeta) => {
  typeof window !== "undefined" &&
    localStorage.setItem("walletAddress", JSON.stringify(wallet))
}

export const getWallet = () => {
  return typeof window !== "undefined"
    ? JSON.parse(String(localStorage.getItem("walletAddress")))
    : ""
}

export const removeWallet = () => {
  typeof window !== "undefined" && localStorage.removeItem("walletAddress")
}
