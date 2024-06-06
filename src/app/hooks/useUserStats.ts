import { usePolkadot } from "@/context"
import { statsApi, useGetBalanceQuery, useGetTotalStatsQuery, useGetValidatorsQuery } from "@/store/api/statsApi"
import { SubnetInterface, ValidatorType, IStats } from "@/types"
import axios from "axios"
import { useEffect, useState } from "react"


const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
})

export const useUserStats = ({
  onChainData,
}: {
  onChainData?: IStats
}) => {
  const [walletAddress, setWalletAddress] = useState("")
  const [searchFetching, setSearchFetching] = useState(false)
  const { isConnected, selectedAccount, api } = usePolkadot()

  const [userBalance, setUserBalance] = useState({
    balance: 0,
    staked: 0,
    // stakes: [],
    daily_reward: 0,
  })

  const userStakedDollar = (onChainData?.price || 0) * userBalance.staked / 10 ** 9

  const userBalanceDollar = (onChainData?.price || 0) * userBalance.balance / 10 ** 9

  const fetchBalance = async (address?: string) => {
    const wallet = address || walletAddress || selectedAccount?.address
    if (!wallet) return
    const balance: any = await api?.query.system.account(wallet)
    return balance?.data?.free.toNumber() || 0
  }

  const fetchStakes = async (wallet?: string) => {
    setSearchFetching(true)
    console.log("fetching stakes")
    const { data: subnetsData } = await backendApi.get("/subnets/")
    const address = wallet ||  walletAddress || selectedAccount?.address
    console.log("address", address)
    if (!address || !api) return
    console.log("fetching balance")
    const balance = await fetchBalance(address)
    console.log("balance", balance)
    const subnets =
      subnetsData?.subnets?.map((each: SubnetInterface) => each.subnet_id) ??
      [];
    let stakes: any[] = [];
    while (subnets.length > 0) {
      const subnetChunk = subnets.splice(0, 8);
      const chunkStakes = await Promise.all(
        subnetChunk.map(async (subnet: any) => {
          return api.query.subspaceModule
            .stakeTo(subnet, address)
            .then((res) => {
              const data = res.toJSON() as any;
              if (Object.keys(data).length === 0) return [];
              return Object.keys(data).map((key) => ({
                subnet: subnet,
                module: key,
                amount: data[key],
              }));
            });
        })
      );
      stakes = [...stakes, ...chunkStakes.flat()];

      const totalStaked = stakes.reduce((acc, stake) => acc + stake.amount, 0);

      setUserBalance({
        balance,
        staked: totalStaked,
        // stakes,
        daily_reward: 0,
      })
      setSearchFetching(false)
    }
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