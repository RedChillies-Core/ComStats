"use client"
import { usePolkadot } from "@/context"
import { formatTokenPrice, truncateWalletAddress } from "@/utils"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FaArrowLeft } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import Button from "../components/button"
import Link from "next/link"
import StakingModal from "../components/modal/stake"
import { AiFillGift, AiFillMoneyCollect } from "react-icons/ai"
import { BiAnalyse, BiCube } from "react-icons/bi"
import { statsApi } from "@/store/api/statsApi"
import { useBalance } from "@/context/balanceContext"

interface NonTransferEvent {
  section: string
  method: string
  data: any
}

const Portfolio = () => {
  const { selectedAccount, isConnected, api } = usePolkadot()
  const {
    userBalance,
    userBalanceDollar,
    userStakedDollar,
    fetchUserStats: refetchSearch,
  } = useBalance()
  const { data: subnetsData, isLoading } = statsApi.useGetSubnetsQuery()
  const router = useRouter()
  const [stakingOpen, setStakingOpen] = useState(false)
  const [validatorId, setValidatorId] = useState("")
  const [subnetId, setSubnetId] = useState(0)

  useEffect(() => {
    const fetchBalance = async () => {
      refetchSearch?.()
    }
    const interval = setInterval(() => {
      fetchBalance()
    }, 30000)
    return () => clearInterval(interval)
  }, [selectedAccount])

  return (
    <div className="container p-2 md:p-0">
      <div className="flex w-full">
        <div className="w-full">
          <div className="flex py-5 items-center gap-x-3">
            <button
              className="border-2 p-2 rounded-lg cursor-pointer"
              onClick={() => router.back()}
            >
              <FaArrowLeft />
            </button>
            <h1 className="heading">Portfolio</h1>
          </div>
          {!isConnected && (
            <p className="p-3">Connect your wallet to load your portfolio!</p>
          )}
          {isConnected && (
            <>
              <div className="bg-orange-50 flex items-center py-6 px-4 rounded-2xl shadow-md mb-6 overflow-hidden truncate ">
                <div className="">
                  <Image
                    src="/polkadot.png"
                    alt="polkadot"
                    height={100}
                    width={100}
                  />
                </div>
                <div className="flex">
                  <div className="miniheading flex-1 flex items-start gap-y-3 flex-col">
                    <div className="flex gap-x-2 items-start flex-col ">
                      <p className="subheading tracking-tight">Account Name</p>
                      <h3 className="text-md font-semibold">
                        {selectedAccount?.meta.name}
                      </h3>
                    </div>
                    <div className="flex gap-x-2 items-start flex-col w-full ">
                      <p className="subheading tracking-tight">
                        Account Address
                      </p>
                      <h3 className="text-md font-semibold ">
                        {selectedAccount?.address}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-3 justify-between w-full flex-col gap-y-3 md:gap-y-0 md:flex-row ">
                <div className=" bg-blue-50 rounded-2xl relative flex justify-center items-center space-x-4 flex-auto py-4 px-4 max-w-96">
                  <div className="absolute right-3">
                    <AiFillMoneyCollect
                      size={28}
                      className="text-textSecondary"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="subheading tracking-tight">Total Balance</p>
                    <h2 className="heading flex items-center gap-x-3">
                      {formatTokenPrice({
                        amount: Number(userBalance?.balance),
                      })}{" "}
                      COMAI
                    </h2>
                    <p className="text-sm text-textSecondary">
                      ${userBalanceDollar.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className=" bg-blue-50 rounded-2xl relative flex justify-center items-center space-x-4 flex-auto py-4 px-4 max-w-96 ">
                  <div className="absolute right-3">
                    <BiCube size={28} className="text-textSecondary" />
                  </div>
                  <div className="flex-1">
                    <p className="subheading tracking-tight">Your Stakes</p>
                    <h2 className="heading flex items-center gap-x-3">
                      {formatTokenPrice({
                        amount: Number(userBalance?.staked),
                      })}{" "}
                      COMAI
                    </h2>
                    <p className="text-xs text-textSecondary">
                      ${userStakedDollar.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className=" bg-blue-50 rounded-2xl relative flex justify-center items-center space-x-4 flex-auto py-4 px-4 max-w-96">
                  <div className="absolute right-3">
                    <BiAnalyse size={28} className="text-textSecondary" />
                  </div>
                  <div className="flex-1">
                    <p className="subheading tracking-tight">Total Stakes</p>
                    <h2 className="heading flex items-center gap-x-3">
                      {userBalance?.stakes?.length}
                    </h2>
                    <p className="text-xs text-textSecondary">
                      Count of total stakes
                    </p>
                  </div>
                </div>
                <div className=" bg-blue-50 rounded-2xl relative flex justify-center items-center space-x-4 flex-auto py-4 px-4 max-w-96">
                  <div className="absolute right-3">
                    <AiFillGift size={28} className="text-textSecondary" />
                  </div>
                  <div className="flex-1">
                    <p className="subheading tracking-tight">Daily Reward</p>
                    <h2 className="heading flex items-center gap-x-3">
                      {formatTokenPrice({
                        amount: Number(userBalance?.daily_reward),
                      })}{" "}
                      COMAI
                    </h2>
                    <p className="text-xs text-textSecondary">
                      Your 24h earning
                    </p>
                  </div>
                </div>
              </div>
              <h1 className="heading my-8">Your Stakes</h1>
              <div className="flex flex-wrap gap-y-8">
                {userBalance?.stakes?.map((stake) => (
                  <div
                    key={stake.validator.key}
                    className=" bg-blue-50  p-6 rounded-xl flex sm:m-0 flex-wrap max-w-80 flex-col gap-y-1 items-start md:p-8 md:mx-4"
                  >
                    <h1 className="text-lg font-bold">
                      {stake.validator.name}
                    </h1>
                    <h4 className="text-md font-medium">
                      {truncateWalletAddress(stake.validator.key)}
                    </h4>
                    <div className="shadow-card text-medium flex rounded-2xl gap-x-2 items-center flex-row p-3 font-bold w-full text-textPrimary mt-3">
                      <Image
                        src="/CommAI.webp"
                        alt="comm"
                        height={40}
                        width={40}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-textSecondary">
                          Staked Amount
                        </span>
                        {formatTokenPrice({
                          amount: Number(stake?.amount),
                        })}{" "}
                        COMAI
                      </div>
                    </div>
                    <div className="my-3 flex gap-x-3">
                      <Button
                        variant="primary"
                        size="large"
                        onClick={() => {
                          setStakingOpen(true)
                          setValidatorId(stake.validator.key)
                          setSubnetId(stake.validator.subnet_id)
                        }}
                      >
                        Manage Stake
                      </Button>
                      <Link href={`/validator/${stake.validator.key}`}>
                        <Button variant="outlined" size="large">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <StakingModal
            open={stakingOpen}
            setOpen={setStakingOpen}
            validatorId={validatorId}
          />
        </div>
      </div>
    </div>
  )
}

export default Portfolio
