import { usePolkadot } from "@/context"
import { IStats } from "@/types"
import axios from "axios"
import { useEffect, useState } from "react"

const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
})

export const useUserStats = ({ onChainData }: { onChainData?: IStats }) => {
  const [walletAddress, setWalletAddress] = useState("")
  const [searchFetching, setSearchFetching] = useState(false)
  const { isConnected, selectedAccount, api } = usePolkadot()

  const [userBalance, setUserBalance] = useState({
    balance: 0,
    staked: 0,
    // stakes: [],
    daily_reward: 0,
  })

  const userStakedDollar =
    ((onChainData?.price || 0) * userBalance.staked) / 10 ** 9

  const userBalanceDollar =
    ((onChainData?.price || 0) * userBalance.balance) / 10 ** 9

  const fetchBalance = async (address?: string) => {
    const wallet = address || walletAddress || selectedAccount?.address
    if (!wallet) return
    const balance: any = await api?.query.system.account(wallet)
    return balance?.data?.free.toNumber() || 0
  }

  const fetchStakes = async (wallet?: string) => {
    setSearchFetching(true)
    console.log("fetching stakes")
    const address = wallet || walletAddress || selectedAccount?.address
    console.log("address", address)
    if (!address || !api) return
    console.log("fetching balance")
    const balance = await fetchBalance(address)
    console.log("balance", balance)

    const stakes = await api.query.subspaceModule.stakeTo
      .entries(address)
      .then((entries) => {
        const data = Object.fromEntries(
          entries.map(([key, value]) => {
            return [key.args[1].toString(), value.toJSON()]
          })
        )
        if (Object.keys(data).length === 0) return []
        return Object.keys(data).map((key) => ({
          module: key,
          amount: Number(data[key]),
        }))
      })

    const totalStaked = stakes.reduce((acc, stake) => acc + stake.amount, 0)

    setUserBalance({
      balance,
      staked: totalStaked,
      daily_reward: 0,
    })
    setSearchFetching(false)
  }

  useEffect(() => {
    if (selectedAccount?.address) {
      setWalletAddress(selectedAccount?.address)
      setSearchFetching(true)
      fetchStakes(selectedAccount?.address)
    }
  }, [selectedAccount])

  return {
    walletAddress,
    setWalletAddress,
    searchFetching,
    userBalance,
    userStakedDollar,
    userBalanceDollar,
    refetchSearch: fetchStakes,
  }
}
