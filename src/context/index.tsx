"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { NET_ID, PLATFORM_FEE } from "@/constants"
import { IAddStaking, ITransfer, ITransferStaking } from "@/types"
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types"

interface PolkadotApiState {
  web3Accounts: (() => Promise<InjectedAccountWithMeta[]>) | null
  web3Enable: ((appName: string) => Promise<InjectedExtension[]>) | null
  web3FromAddress: ((address: string) => Promise<InjectedExtension>) | null
}

interface PolkadotContextType {
  api: ApiPromise | null
  isInitialized: boolean
  accounts: InjectedAccountWithMeta[]
  selectedAccount: InjectedAccountWithMeta | undefined
  handleConnect: () => void
  addStake: (args: IAddStaking) => void
  removeStake: (args: IAddStaking) => void
  transfer: (args: ITransfer) => void
  transferStake: (args: ITransferStaking) => void
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(
  undefined,
)

interface PolkadotProviderProps {
  children: React.ReactNode
  wsEndpoint: string
}

export const PolkadotProvider: React.FC<PolkadotProviderProps> = ({
  children,
  wsEndpoint,
}) => {
  const [api, setApi] = useState<ApiPromise | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])

  const [polkadotApi, setPolkadotApi] = useState<PolkadotApiState>({
    web3Accounts: null,
    web3Enable: null,
    web3FromAddress: null,
  })
  async function loadPolkadotApi() {
    const { web3Accounts, web3Enable, web3FromAddress } = await import(
      "@polkadot/extension-dapp"
    )
    setPolkadotApi({
      web3Accounts,
      web3Enable,
      web3FromAddress,
    })
    const provider = new WsProvider(wsEndpoint)
    const newApi = await ApiPromise.create({ provider })
    setApi(newApi)
    setIsInitialized(true)
  }
  useEffect(() => {
    loadPolkadotApi()

    return () => {
      api?.disconnect()
    }
  }, [wsEndpoint])

  const handleConnect = async () => {
    if (!polkadotApi.web3Enable || !polkadotApi.web3Accounts) return
    const extensions = await polkadotApi.web3Enable("ComAISwap")
    if (!extensions) {
      throw Error("NO_EXTENSION_FOUND")
    }
    const allAccounts = await polkadotApi.web3Accounts()
    setAccounts(allAccounts)
    if (allAccounts.length === 1) {
      setSelectedAccount(allAccounts[0])
    }
  }

  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>()

  async function addStake({ validator, amount }: IAddStaking) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return
    const injector = await polkadotApi.web3FromAddress(selectedAccount.address)
    await api.tx.subspaceModule
      .addStake(NET_ID, validator, amount)
      .signAndSend(selectedAccount.address, {
        signer: injector.signer,
        tip: PLATFORM_FEE,
      })
  }
  const removeStake = async ({ validator, amount }: IAddStaking) => {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return
    const injector = await polkadotApi.web3FromAddress(selectedAccount.address)
    await api.tx.subspaceModule
      .addStake(NET_ID, validator, amount)
      .signAndSend(selectedAccount.address, {
        signer: injector.signer,
        tip: PLATFORM_FEE,
      })
  }
  const transferStake = async ({
    validatorFrom,
    validatorTo,
    amount,
  }: ITransferStaking) => {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return
    const injector = await polkadotApi.web3FromAddress(selectedAccount.address)
    api.tx.subspaceModule
      .addStake(NET_ID, validatorFrom, amount)
      .signAndSend(selectedAccount.address, {
        signer: injector.signer,
        tip: PLATFORM_FEE,
      })
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        console.log(err)
        alert(err)
      })
  }

  const transfer = async ({ to, amount }: ITransfer) => {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return
    const injector = await polkadotApi.web3FromAddress(selectedAccount.address)
    api.tx.balances
      .transfer(to, amount)
      .signAndSend(
        selectedAccount.address,
        { signer: injector.signer },
        (status) => {
          if (status.isCompleted) {
          }
        },
      )
  }

  return (
    <PolkadotContext.Provider
      value={{
        api,
        isInitialized,
        accounts,
        selectedAccount,
        handleConnect,
        addStake,
        transfer,
        removeStake,
        transferStake,
      }}
    >
      {children}
    </PolkadotContext.Provider>
  )
}

export const usePolkadot = (): PolkadotContextType => {
  const context = useContext(PolkadotContext)
  if (context === undefined) {
    throw new Error("usePolkadot must be used within a PolkadotProvider")
  }
  return context
}
