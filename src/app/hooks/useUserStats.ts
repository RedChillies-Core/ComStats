import { usePolkadot } from "@/context"
import { statsApi, useGetBalanceQuery, useGetTotalStatsQuery, useGetValidatorsQuery } from "@/store/api/statsApi"
import { SubnetInterface, ValidatorType } from "@/types"
import axios from "axios"
import { useEffect, useState } from "react"

// create a type with dynamic key and number value
type Stakes = {
  subnet: number
  module: string
  amount: number
}

type ValiStakes = {
  amount: number
  validator: ValidatorType
}

export const useUserStats = () => {
  const [walletAddress, setWalletAddress] = useState("")
  const { isConnected, selectedAccount, api } = usePolkadot()
  const [userAvailableBalance, setUserAvailableBalance] = useState(0)
  const [userStakedBalance, setUserStakedBalance] = useState(0)
  const [userStakes, setUserStakes] = useState<ValiStakes[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: subnetsData, isLoading: subnetLoading } = statsApi.useGetSubnetsQuery()
  const { data: onChainData, isLoading: chainLoading } = useGetTotalStatsQuery(
    undefined,
    {
      pollingInterval: 8000,
    },
  )
  const {
    data: userBalance,
    isFetching,
    // refetch: refetchSearch,
  } = useGetBalanceQuery(
    { wallet: walletAddress },
    {
      skip: !walletAddress && walletAddress === "",
    },
  )

  useEffect(() => {
    if (isConnected && !subnetLoading) {
      setIsLoading(true)
      setWalletAddress(String(selectedAccount?.address))
      fetchBalance(String(selectedAccount?.address))
      .then(() => fetchUsersStake(subnetsData?.map((each) => each.subnet_id) ?? []))
      // fetchUsersStake(subnetsData?.map((each) => each.subnet_id) ?? [])
    }
  }, [isConnected, selectedAccount, subnetLoading])

  const fetchBalance = async (wallet?: string) => {
    api?.query.system.account(wallet ?? walletAddress).then((res) => {
      const data = res.toJSON() as any
      setUserAvailableBalance(data?.data?.free || 0 / 1e9)
      // setUserBalance(res.toJSON()?.data?.free)
    })
  }
  const fetchUsersStake = async (sub: number[]) => {
    const {data: sub1} = await axios.get("https://api.comstats.org/subnets/")
    console.log('fetching stakes on subnets', sub1)
    const startTime = Date.now()
    const subnets = sub1?.subnets.map((each: SubnetInterface) => each.subnet_id as number)
    console.log('fetching stakes on subnets', subnets)
    let stakes: any[] = [];
    console.log('walletAddress', walletAddress)
    while (subnets.length) {
      const subnetChunk = subnets.splice(0, 8);
      const chunkStakes = await Promise.all(subnetChunk.map(async (subnet: any) => {
        return api?.query.subspaceModule.stakeTo(subnet, walletAddress !== "" ? walletAddress : selectedAccount?.address).then((res) => {
          const data = res.toJSON() as any
          if(Object.keys(data).length === 0) return []
          return Object.keys(data).map((key)=>({
            subnet: subnet,
            module: key,
            amount: data[key]
          }));
        })
      }));
      console.log('chunkStakes', chunkStakes)
      stakes = [...stakes, ...chunkStakes.filter((item) => item.length > 0)]
    }
    stakes = stakes.flat()
    console.log('stakes', stakes)
    const endTime = Date.now()
    setUserStakedBalance(
      stakes.reduce((acc, item) => {
        return acc + item.amount
      }, 0)
    )

    const {data: validatorsData} = await axios.get("https://api.comstats.org/validators/", {
      params: {
        vali_keys: stakes.map((item) => item.module).join(",")
      },
    })
    console.log('validatorsData', validatorsData)
    const userStakes = stakes.map((item) => {
      const validator = validatorsData?.validators.find((vali: ValidatorType) => vali.key === item.module && vali.subnet_id === item.subnet)
      return {
        amount: item.amount,
        validator: validator
      }
    })
    setUserStakes(userStakes)
    setIsLoading(false)
    console.log(`Time taken: $(${(endTime-startTime)/(1000)}) sec`)
  }
  const userBalanceDollar =
    ((userAvailableBalance ?? 0) * (onChainData?.price ?? 0)) / 10 ** 9
  const userStakedDollar =
    ((userStakedBalance ?? 0) * (onChainData?.price ?? 0)) / 10 ** 9
  return {
    walletAddress,
    searchFetching: isFetching || isLoading || subnetLoading || chainLoading,
    userBalance: {
      ...userBalance,
      balance: userAvailableBalance,
      staked: userStakedBalance,
      stakes: userStakes,
    },
    userBalanceDollar,
    userStakedDollar,
    onChainData,
    refetchSearch: () => {
      fetchBalance()
      .then(() => fetchUsersStake(subnetsData?.map((each) => each.subnet_id) ?? []))
    },
    setWalletAddress,
  }
}
