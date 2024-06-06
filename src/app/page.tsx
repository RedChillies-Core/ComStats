"use client"
import { AiOutlineSwap } from "react-icons/ai"
import { LiaCubesSolid } from "react-icons/lia"
import Image from "next/image"
import { RiStockLine } from "react-icons/ri"
import { CiCoinInsert } from "react-icons/ci"
import { TbBasketDollar } from "react-icons/tb"
import { PiUsersThreeBold, PiVaultFill } from "react-icons/pi"
import Button from "@/app/components/button"
import Footer from "@/app/components/footer"
import { useState } from "react"
import TransferModal from "@/app/components/modal/transfer"
import { useGetValidatorsByIdQuery } from "@/store/api/statsApi"
import {
  convertNumberToLetter,
  formatTokenPrice,
  truncateWalletAddress,
} from "@/utils"
import SearchWalletForm from "@/app/components/forms/search"
import { usePolkadot } from "@/context"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { useUserStats } from "@/app/hooks/useUserStats"
import ValidatorTable from "@/app/components/table"
import ManageStakingModal from "./components/modal/manage"
import { useBalance } from "@/context/balanceContext"

export default function Home() {
  const [stakingOpen, setStakingOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const { isConnected, selectedAccount } = usePolkadot()
  const { data: comStatsData, isLoading: comStatsLoading } =
    useGetValidatorsByIdQuery({
      key: String(process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR),
      wallet: "",
      subnet_id: 0,
    })
  const { onChainData} = useBalance()
  const {
    walletAddress,
    searchFetching,
    userBalance,
    userStakedDollar,
    userBalanceDollar,
    refetchSearch,
    setWalletAddress,
  } = useUserStats({
    onChainData
  })

  const comswapStats = [
    {
      id: 1,
      statsName: "Validator",
      icon: <LiaCubesSolid size={40} />,
      value: truncateWalletAddress(
        String(process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR),
      ),
      description: (
        <div className="flex gap-x-1 items-center">{comStatsData?.name}</div>
      ),
    },
    {
      id: 2,
      statsName: "Current APY",
      icon: <RiStockLine size={40} />,
      value: `${(comStatsData?.apy ?? 0).toFixed(2)}%`,
      description: (
        <p>{(comStatsData?.apy ?? 0)?.toFixed(2)}% ROI over a year</p>
      ),
    },
    {
      id: 3,
      statsName: "Delegation fee",
      icon: <CiCoinInsert size={40} />,
      value: `${comStatsData?.delegation_fee ?? 0}%`,
      description: <p>Minimal fee of {comStatsData?.delegation_fee}%</p>,
    },
    {
      id: 4,
      statsName: "Total Staked",
      icon: <TbBasketDollar size={40} />,
      value:
        numberWithCommas(
          formatTokenPrice({
            amount: Number(comStatsData?.stake),
          }),
        ) ?? "0",
      description: (
        <p>
          {(
            Number(comStatsData?.stake) /
            10 ** 9 /
            Number(onChainData?.total_stake)
          ).toFixed(3)}
          % of Total Staked
        </p>
      ),
    },
    {
      id: 5,
      statsName: "Total Stakers",
      icon: <PiUsersThreeBold size={40} />,
      value: comStatsData?.total_stakers,
      description: <p>Total Number of Stakers</p>,
    },
  ]
  const communeStats = [
    {
      id: 1,
      statsName: "Price",
      icon: <LiaCubesSolid size={40} />,
      value: onChainData?.price && `$${onChainData?.price}`,
    },
    {
      id: 2,
      statsName: "Total Circulation",
      icon: <RiStockLine size={40} />,
      value:
        convertNumberToLetter(
          Number(onChainData?.circulating_supply?.toFixed(2)),
        ) ?? "0",
    },
    {
      id: 3,
      statsName: "Total Market Cap",
      icon: <CiCoinInsert size={40} />,
      value: `${convertNumberToLetter(
        Number((onChainData?.marketcap ?? 0)?.toFixed(2)),
      )}`,
    },
    {
      id: 4,
      statsName: "Emission (per Day)",
      icon: <TbBasketDollar size={40} />,
      value: numberWithCommas(onChainData?.daily_emission),
    },
    {
      id: 5,
      statsName: "Total Modules",
      icon: <PiUsersThreeBold size={40} />,
      value: numberWithCommas(onChainData?.total_modules),
    },
    {
      id: 6,
      statsName: "Total Staked",
      icon: <PiUsersThreeBold size={40} />,
      value: `${convertNumberToLetter(
        Number(onChainData?.total_stake?.toFixed(2)),
      )} ~ (${(
        (Number(onChainData?.total_stake) /
          Number(onChainData?.circulating_supply)) *
        100
      ).toFixed(0)}%)`,
    },
    {
      id: 7,
      statsName: "Total Stakers",
      icon: <PiUsersThreeBold size={40} />,
      value: numberWithCommas(onChainData?.total_stakers),
    },
    {
      id: 8,
      statsName: "Total Subnets",
      icon: <PiUsersThreeBold size={40} />,
      value: numberWithCommas(onChainData?.total_subnets),
    },
    {
      id: 9,
      statsName: "Average APY",
      icon: <PiUsersThreeBold size={40} />,
      value: onChainData?.avg_apy && `${onChainData?.avg_apy?.toFixed(2)}%`,
    },
  ]

  return (
    <div>
      <section className="container">
        <div className="min-h-96 flex justify-center gap-y-4 flex-col items-center mt-6">
          <div className="container text-center">
            <h1 className="text-4xl font-semibold text-textPrimary">
              Introducing ComStats
            </h1>
            <p className="text-md font-medium text-textSecondary mt-3">
              All Statistics of CommuneAI at one place. Staking infrastructure,
              prices, validators, miners, swap, bridge, exchange for $COMAI
            </p>
          </div>

          <ManageStakingModal
            open={stakingOpen}
            setOpen={setStakingOpen}
            // validatorId={String(process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR)}
          />

          <TransferModal open={transferOpen} setOpen={setTransferOpen} />
          <div className="container">
            <div className="flex justify-center w-full no-scrollbar p-5 flex-wrap gap-3">
              {communeStats.map((stats) => (
                <div
                  className="shadow-card rounded-xl flex items-center gap-x-4 p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/6 truncate"
                  key={stats.id}
                >
                  <div className="text-purple">{stats.icon}</div>
                  <div>
                    <h4 className="text-xs uppercase font-normal text-grey-500">
                      {stats.statsName}
                    </h4>
                    <div className="text-md font-semibold w-full truncate tracking-tight">
                      {stats.value || "N/A"}
                    </div>
                    {/* <div className="text-[10px]">{stats.description}</div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 flex-col justify-center p-4 sm:flex-row">
            <Button
              size="large"
              variant="primary"
              suffix={<PiVaultFill size={22} />}
              isDisabled={!isConnected}
              onClick={() => {
                setStakingOpen(true)
                setWalletAddress(String(selectedAccount?.address))
              }}
            >
              Manage Stakes
            </Button>
            <Button
              size="large"
              variant="outlined"
              suffix={<AiOutlineSwap size={22} />}
              isDisabled={!isConnected}
              onClick={() => {
                setTransferOpen(true)
                setWalletAddress(String(selectedAccount?.address))
              }}
            >
              Transfer Funds
            </Button>
          </div>
        </div>
      </section>
      <div className="bg-button mx-3 p-5 rounded-lg shadow-lg text-white text-center my-10 sm:rounded-none sm:mx-0 sm:p-10">
        <h1 className="text-2xl font-bold mb-2">Enter your wallet address </h1>
        <p className="mb-4">
          Check balances, staking and many more with just a single input!
        </p>
        <div className="max-w-xl mx-auto">
          <SearchWalletForm
            wallet={walletAddress}
            setWallet={setWalletAddress}
            loading={searchFetching}
            refetch={refetchSearch}
          />
        </div>

        <div>
          <div>
            Balance:{" "}
            {numberWithCommas(
              Number(((userBalance?.balance || 0) / 10 ** 9).toFixed(2)),
            )}{" "}
            COMAI (${numberWithCommas(Number(userBalanceDollar.toFixed(2)))})
          </div>
          <div>
            Staked:{" "}
            {numberWithCommas(
              Number(((userBalance?.staked || 0) / 10 ** 9).toFixed(2)),
            )}{" "}
            COMAI (${numberWithCommas(Number(userStakedDollar.toFixed(2)))})
          </div>
        </div>
      </div>
      <section className="container my-10">
        <div className="flex justify-between mb-4 items-center flex-col gap-x-3 sm:flex-row sm:px-5">
          <h1 className="text-2xl text-left font-semibold flex leading-10 text-purple tracking-tighter items-center">
            <Image src="/Animated1.gif" alt="comm" height={30} width={30} />{" "}
            ComStats Statistics
          </h1>
        </div>

        <div className="shadow-card bg-blue-50 mx-4 p-8 rounded-xl flex gap-8 justify-between sm:m-0 flex-wrap">
          {comswapStats.map((item) => (
            <div key={item.id} className="text-left w-full sm:w-48">
              <h6 className="text-xs uppercase font-normal text-grey-500">
                {item.statsName}
              </h6>
              <h1 className="text-md font-semibold w-full truncate tracking-tight">
                {item.value}
              </h1>
            </div>
          ))}
        </div>
        <div className="flex gap-4 flex-col justify-center p-4 sm:flex-row">
          <Button
            size="large"
            variant="primary"
            suffix={<PiVaultFill size={22} />}
            isDisabled={!isConnected}
            onClick={() => {
              setStakingOpen(true)
              setWalletAddress(String(selectedAccount?.address))
            }}
          >
            Manage Stake on Comstats
          </Button>
        </div>
      </section>
      <div className="bg-button mx-3 p-5 rounded-lg shadow-lg text-white text-center my-10 sm:rounded-none sm:mx-0 sm:p-10">
        <h1 className="text-2xl font-bold mb-2">
          wCOMAI on Solana (Live now) 🔥
        </h1>
        <p className="mb-4">
          Bridge COMAI between Solana and CommuneAI
          <br /> Powered by ComSolBridge
        </p>
        <div className="w-full flex justify-center">
          <a href="https://comsolbridge.com" target="_blank">
            <Button variant="transparent" size="medium">
              Bridge Now
            </Button>
          </a>
        </div>
        {/* <p className="italic mt-3 text-sm">Coming Soon in April...</p> */}
      </div>
      <section className="container my-10 ">
        <div className="flex justify-between mb-4 items-center flex-col sm:flex-row sm:px-5">
          <h1 className="text-2xl text-left font-semibold flex gap-x-2 leading-10 text-purple tracking-tighter items-center">
            <Image src="/CommAI.webp" alt="comm" height={30} width={30} /> COMAI
            Modules
          </h1>
        </div>
        <ValidatorTable />
      </section>
      <Footer
        copyrightText={`© ${new Date().getFullYear()} ComStats. All Rights Reserved.`}
      />
    </div>
  )
}
