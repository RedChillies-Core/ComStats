import { IStats, SubnetInterface, ValidatorType } from "@/types";
import {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePolkadot } from ".";
import axios from "axios";
import { useGetTotalStatsQuery } from "@/store/api/statsApi";

export type BalanceContextType = {
  userBalance: {
    balance: number;
    staked: number;
    stakes: { amount: number; validator: ValidatorType }[];
    daily_reward: number;
  };
  userBalanceDollar: number;
  userStakedDollar: number;
  onChainData: IStats;
  fetchUserStats?: () => void;
};

const BalanceContext = createContext<BalanceContextType>({
  userBalance: {
    balance: 0,
    staked: 0,
    stakes: [],
    daily_reward: 0,
  },
  userBalanceDollar: 0,
  userStakedDollar: 0,
  onChainData: {
    circulating_supply: 0,
    total_stake: 0,
    total_subnets: 0,
    total_validators: 0,
    total_miners: 0,
    total_modules: 0,
    price: 0,
    marketcap: 0,
    daily_emission: 0,
    total_stakers: 0,
    avg_apy: 0,
  },
});

export const BalanceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { selectedAccount, api } = usePolkadot();
  const { data: onChainData, isLoading: chainLoading } = useGetTotalStatsQuery(
    undefined,
    {
      pollingInterval: 8000,
    }
  );
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakes, setStakes] = useState<
    { amount: number; validator: ValidatorType }[]
  >([]);
  const [dailyReward, setDailyReward] = useState(0);

  const fetchBalance = useCallback(async () => {
    if (!selectedAccount || !api) return;
    const balance: any = await api.query.system.account(
      selectedAccount.address
    );
    console.log("balance", balance?.data.free.toNumber());
    setBalanceAmount(Number(balance.data.free));
  }, [selectedAccount, api]);

  const fetchStakes = useCallback(async () => {
    const { data: subnetsData } = await axios.get(
      "https://api.comstats.org/subnets/"
    );
    if (!selectedAccount || !api) return;
    const address = selectedAccount.address;
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
    }
    const { data: validatorsData } = await axios.get(
      "https://api.comstats.org/validators/",
      {
        params: {
          vali_keys: stakes.map((item) => item.module).join(","),
        },
      }
    );
    let dailyReward = 0;
    const userStakes = stakes.map((item) => {
      const validator = validatorsData?.validators.find(
        (vali: ValidatorType) =>
          vali.key === item.module && vali.subnet_id === item.subnet
      ) ?? {
        name: "Unknown",
        key: item.module,
        subnet_id: item.subnet,
      };
      dailyReward += (item.amount * validator?.apy) / 36500;
      return {
        amount: item.amount,
        validator: validator,
      };
    });
    setStakes(userStakes);
    setStakedAmount(
      userStakes.reduce((acc, item) => {
        return acc + item.amount;
      }, 0)
    );
    setDailyReward(dailyReward);
  }, [selectedAccount, api]);

  const fetchUserStats = useCallback(async () => {
    await fetchBalance();
    await fetchStakes();
  }, [fetchBalance, fetchStakes]);

  const userBalanceDollar =
    (onChainData?.price || 0) * (balanceAmount / 10 ** 9);
  const userStakedDollar = (onChainData?.price || 0) * (stakedAmount / 10 ** 9);

  useEffect(() => {
    fetchUserStats();
    const interval = setInterval(() => {
      fetchUserStats();
    }, 20000);
    return () => clearInterval(interval);
  }, [selectedAccount, api]);

  return (
    <BalanceContext.Provider
      value={{
        userBalance: {
          balance: balanceAmount,
          staked: stakedAmount,
          stakes: stakes,
          daily_reward: dailyReward,
        },
        userBalanceDollar,
        userStakedDollar,
        fetchUserStats,
        onChainData: onChainData ?? {
          circulating_supply: 0,
          total_stake: 0,
          total_subnets: 0,
          total_validators: 0,
          total_miners: 0,
          total_modules: 0,
          price: 0,
          marketcap: 0,
          daily_emission: 0,
          total_stakers: 0,
          avg_apy: 0,
        },
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  return useContext(BalanceContext);
};
