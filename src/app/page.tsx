"use client"
import { AiOutlineSwap } from "react-icons/ai"
import { FaExternalLinkAlt, FaSearch } from "react-icons/fa"
import { LiaCubesSolid } from "react-icons/lia"
import Image from "next/image"
import { RiStockLine } from "react-icons/ri"
import { CiCoinInsert } from "react-icons/ci"
import { TbBasketDollar } from "react-icons/tb"
import { PiUsersThreeBold, PiVaultFill } from "react-icons/pi"
import Button from "@/app/components/button"
import Footer from "@/app/components/footer"
import Navbar from "@/app/components/navbar"
import { useState } from "react"
import StakingModal from "@/app/components/modal/stake"
import TransferModal from "@/app/components/modal/transfer"
import {
  useGetTotalStatsQuery,
  useGetValidatorsQuery,
} from "@/store/api/statsApi"
import { formatTokenPrice } from "@/utils"

export default function Home() {
  const [stakingOpen, setStakingOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const { data: validatorData, isLoading: validatorLoading } =
    useGetValidatorsQuery()
  const { data: chainData, isLoading: chainLoading } = useGetTotalStatsQuery()
  const comswapStats = [
    {
      id: 1,
      statsName: "Validator",
      icon: <LiaCubesSolid size={40} />,
      value: "583....dsg",
      description: (
        <a href="" target="_blank" className="flex gap-x-1 items-center">
          View Here
          <FaExternalLinkAlt />
        </a>
      ),
    },
    {
      id: 2,
      statsName: "Current APY",
      icon: <RiStockLine size={40} />,
      value: "45%",
      description: <p>45% ROI over a year</p>,
    },
    {
      id: 3,
      statsName: "Delegation fee",
      icon: <CiCoinInsert size={40} />,
      value: "5%",
      description: <p>Minimal fee of 5%</p>,
    },
    {
      id: 4,
      statsName: "Total Staked",
      icon: <TbBasketDollar size={40} />,
      value: "568,9394",
      description: <p>19.56% of Total Tokens</p>,
    },
    {
      id: 5,
      statsName: "Total Stakers",
      icon: <PiUsersThreeBold size={40} />,
      value: "4,569",
      description: <p>Total Number of Stakers</p>,
    },
  ]
  console.log(chainData)
  const comTokenStats = [
    { id: "Price", value: chainData?.price },
    {
      id: "Total $COMAI Circulating",
      value: chainData?.circulating_supply,
    },
    {
      id: "Total Market Cap",
      value: chainData?.marketcap,
    },
    {
      id: "Daily Emission",
      value: chainData?.daily_emission,
    },
    {
      id: "Total Miners",
      value: chainData?.total_miners,
    },
    {
      id: "Total Staked",
      value: chainData?.total_stake,
    },
    {
      id: "Total Validators/Stakers",
      value: chainData?.total_stakers,
    },
    {
      id: "Latest Block",
      value: chainData?.block,
    },
  ]

  function toggleAccordion(item: string): void {
    const content = document.getElementById(`content-${item}`)
    if (content) {
      if (content.classList.contains("hidden")) {
        content.classList.remove("hidden")
      } else {
        content.classList.add("hidden")
      }
    }
  }
  return (
    <div>
      <Navbar />
      <section className="container">
        <div className="min-h-96 flex justify-center gap-y-4 flex-col items-center">
          <Image
            alt="blockchain"
            src="/Animated1.gif"
            height={150}
            width={150}
          />
          <div className="container text-center">
            <h1 className="text-4xl font-semibold text-textPrimary">
              ComStats
            </h1>
            <p className="text-md font-medium text-textSecondary mt-3">
              A easiest platform to stake on Commune AI with minimal fees or no
              fees!
            </p>
          </div>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button
              size="large"
              variant="primary"
              suffix={<PiVaultFill size={22} />}
              onClick={() => setStakingOpen(true)}
            >
              Manage Stake
            </Button>
            <Button
              size="large"
              variant="outlined"
              suffix={<AiOutlineSwap size={22} />}
              onClick={() => setTransferOpen(true)}
            >
              Transfer Funds
            </Button>
          </div>
          <StakingModal open={stakingOpen} setOpen={setStakingOpen} />
          <TransferModal open={transferOpen} setOpen={setTransferOpen} />
          <div className="container">
            <div className="flex justify-center w-full no-scrollbar p-5 flex-wrap gap-3">
              {comswapStats.map((stats) => (
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
                      {stats.value}
                    </div>
                    <div className="text-[10px]">{stats.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="bg-button mx-3 p-5 rounded-lg shadow-lg text-white text-center my-10 sm:rounded-none sm:mx-0 sm:p-10">
        <h1 className="text-2xl font-bold mb-2">Enter your wallet address </h1>
        <p className="mb-4">
          Check balances, staking and many more with just a single input!
        </p>
        <input
          type="text"
          placeholder="Enter your wallet address"
          className="p-4 bg-transparent border-white border-2 rounded-2xl w-96"
        />
        <Button
          variant="transparent"
          size="large"
          className="mx-auto my-5"
          onClick={() => {}}
          prefix={<FaSearch />}
        >
          Check Now
        </Button>

        <p>Total Balance: | Staked Balance: | Free: </p>
      </div>
      <section className="container my-10">
        <div className="flex justify-between mb-4 items-center flex-col sm:flex-row">
          <h1 className="text-2xl text-left font-semibold flex gap-x-2 leading-10 text-purple tracking-tighter items-center">
            <Image src="/CommAI.webp" alt="comm" height={30} width={30} /> COMAI
            Token Stats
          </h1>
          <p className="text-sm font-light text-textSecondary tracking-tighter">
            Last Updated: 3 seconds ago
          </p>
        </div>

        <div className="shadow-card mx-4 p-8 rounded-xl flex gap-8 flex-wrap justify-between sm:m-0">
          {comTokenStats.map((item) => (
            <div key={item.id} className="text-left w-full sm:w-1/4">
              <h6 className="text-xs uppercase font-normal text-grey-500">
                {item.id}
              </h6>
              <h1 className="text-md font-semibold w-full truncate tracking-tight">
                {item.value}
              </h1>
            </div>
          ))}
        </div>
      </section>
      <div className="bg-button mx-3 p-5 rounded-lg shadow-lg text-white text-center my-10 sm:rounded-none sm:mx-0 sm:p-10">
        <h1 className="text-2xl font-bold mb-2">Stake WCOMAI in one click?</h1>
        <p className="mb-4">
          Bring wCOMAI from Ethereum and stake in COMAI in a single go!
        </p>
        <p className="mb-4">Exicted for it? So, are we.</p>
        <span className="italic font-semibold">Launching Soon on ComStats</span>
      </div>
      <section className="container my-10 ">
        <div className="flex justify-between mb-4 items-center flex-col sm:flex-row">
          <h1 className="text-2xl text-left font-semibold flex gap-x-2 leading-10 text-purple tracking-tighter items-center">
            <Image src="/CommAI.webp" alt="comm" height={30} width={30} /> COMAI
            Validators
          </h1>
        </div>

        <div className="shadow-2xl px-6 py-3 rounded-3xl mt-6">
          <table className="hidden sm:table border-separate w-full border-spacing-0">
            <thead>
              <tr className="uppercase text-xs  text-left font-semibold bottom-shadow">
                <th className="py-4 pl-3">S.N</th>
                <th>Validators</th>
                <th>Stake</th>
                <th>Monthly APY</th>
                <th>Fee</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {validatorData?.validators.map((validator, index, array) => (
                <tr
                  className={`text-sm font-medium   ${
                    index === array.length - 1 ? "" : "border-b-2 bottom-shadow"
                  } `}
                  key={validator.key}
                >
                  <td className="py-6 pl-3 ">{index + 1}</td>
                  <td>
                    <div className="flex flex-col">
                      <h6 className="text-md font-bold">{validator.name}</h6>
                      <p className="text-sm text-textSecondary">
                        {validator.address}
                      </p>
                    </div>
                  </td>
                  <td>{formatTokenPrice({ amount: validator.balance })} COM</td>
                  <td>{Number(validator.apy).toFixed(2)}%</td>
                  <td>
                    {formatTokenPrice({
                      amount: validator.delegation_fee,
                      precision: 8,
                    })}
                  </td>
                  <td>Delegate</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="sm:hidden">
            {validatorData?.validators.map((validator, index, array) => (
              <div
                key={validator.key}
                className={`py-4 ${
                  index === array.length - 1 ? "" : "border-b-2"
                }`}
                onClick={() => toggleAccordion(validator.name)}
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <div>{validator.name}</div>
                  <div>+</div>
                </div>
                <div id={`content-${validator.name}`} className="hidden">
                  <div className="py-2 flex flex-col">
                    <span>
                      <strong>Name:</strong> {validator.name}
                    </span>
                    <span className="text-sm text-textSecondary">
                      {validator.address}
                    </span>
                  </div>
                  <div className="py-2">
                    <strong>Stake:</strong>{" "}
                    {formatTokenPrice({ amount: validator.balance })} COM
                  </div>
                  <div className="py-2">
                    <strong>Monthly APY:</strong>
                    {Number(validator.apy).toFixed(2)}%
                  </div>
                  <div className="py-2">
                    <strong>Fee:</strong>{" "}
                    {formatTokenPrice({
                      amount: validator.delegation_fee,
                      precision: 8,
                    })}
                  </div>
                  {/* <div className="py-2">
                    <strong>Action:</strong> Delegate
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer
        copyrightText={`© ${new Date().getFullYear()} ComStats. All Rights Reserved.`}
      />
    </div>
  )
}
