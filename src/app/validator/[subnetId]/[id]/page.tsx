"use client"

import Button from "@/app/components/button"
import StakingModal from "@/app/components/modal/stake"
import { useGetValidatorsByIdQuery } from "@/store/api/statsApi"
import React, { useCallback, useEffect, useState } from "react"
import { FaArrowLeft, FaDiscord, FaSpinner } from "react-icons/fa6"
import { GoKey } from "react-icons/go"
import { PiCirclesFourLight } from "react-icons/pi"
import { GiProfit } from "react-icons/gi"
import { SiBlockchaindotcom } from "react-icons/si"
import { FaUsers } from "react-icons/fa"
import { RiAiGenerate } from "react-icons/ri"
import { useRouter } from "next/navigation"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { formatTokenPrice } from "@/utils"
import { usePolkadot } from "@/context"
import { FaXTwitter } from "react-icons/fa6"
import { TbWorld } from "react-icons/tb"
import Verified from "@/app/components/verified"
import StakedUsersTable from "@/app/components/table/users"
import VerifyModal from "@/app/components/modal/verifyModule"
import UpdateDetailsModal from "@/app/components/modal/updateDetails"

const detailInfo = [
  {
    key: process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR,
    name: "ComStats",
    description: "All Statistics of CommuneAI at one place. Staking infrastructure, prices, validators, miners, swap, bridge, exchange for $COMAI",
    twitter: "https://twitter.com/comstatsorg",
    website: "https://comstats.org",
    discord: ""
  },
  {
    key: "5DtTeoNjcN19qTpoFgyW9iQaiRsYtBPF5FarjoxPEy4k4ieJ",
    name: "Project Eden",
    description: "Education, validation, mining & more for CommuneAI",
    twitter: "https://twitter.com/project_eden_ai",
    website: "https://projecteden.ai",
    discord: ""
  }
]

const ValidatorDetailPage = ({ params }: { params: { id: string, subnetId: string } }) => {
  
  const { data: validatorData, isLoading: validatorLoading } =
    useGetValidatorsByIdQuery(
      {
        key: String(params.id),
        wallet: "",
        subnet_id: Number(params.subnetId),
      },
      {
        skip: !params.id,
      },
    )
  const { isConnected, selectedAccount } = usePolkadot()
  const router = useRouter()
  const [stakingOpen, setStakingOpen] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [isValidImage, setIsValidImage] = React.useState(false);

  useEffect(() => {
    const imgLink = `${process.env.NEXT_PUBLIC_ENDPOINT}/${validatorData?.image}`;
    const img = new Image();
    img.src = imgLink;
    img.onload = () => {
      setIsValidImage(true);
    };
    img.onerror = () => {
      setIsValidImage(false);
    };
    
  }, [validatorData]);

  const isValidLinkD = (link: string, type: 'discord' | 'twitter' | 'website') => {
    if (link === "") return false;
    if (type === 'discord' && !link.includes('discord.gg')) return false;
    if (type === 'twitter' && !link.includes('twitter.com')) return false;
    if (type === 'website' && !link.includes('http')) return false;
    return true;
  }
  const isValidLink = useCallback(isValidLinkD, [
    validatorData?.discord,
    validatorData?.twitter,
    detailInfo.find(each=>each.key === validatorData?.key)?.discord,
    detailInfo.find(each=>each.key === validatorData?.key)?.twitter
  ]);
  return (
    <div className="container px-3 md:px-0">
      <div className="flex py-5 items-center gap-x-3">
        <button
          className="border-2 p-2 rounded-lg cursor-pointer"
          onClick={() => router.push("/")}
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-lg font-semibold flex items-center gap-x-2">
          {validatorData?.name}{" "}
          {validatorData?.isVerified && (
            <Verified
              isGold={
                validatorData?.verified_type === "golden"
              }
              isOfComStats={
                validatorData?.expire_at === -1
              }
            />
          )}
        </h1>
      </div>
      {validatorLoading && <FaSpinner className="spinner my-6 mx-auto" />}
      {!validatorLoading && (
        <>
          <div className="flex gap-x-5 flex-col items-center lg:items-start lg:flex-row">
            <div className="p-4 w-[300px]">
              <div className={`h-44 ${isValidImage ? '': "bg-slate-200"} w-44 flex justify-center items-center rounded-3xl mx-auto`}
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_ENDPOINT}/${validatorData?.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!isValidImage && validatorData?.name}
              </div>
              <p className="text-xl my-3 text-center font-bold">
                 {validatorData?.name ?? detailInfo.find(each=>each.key === validatorData?.key)?.name}
                </p>
                <p className="text-sm my-3 text-center">
                  {validatorData?.description ?? detailInfo.find(each=>each.key === validatorData?.key)?.description}
                </p>
             
              <div className="flex justify-center gap-x-4 my-4">
                <a href={
                  isValidLink(validatorData?.discord || detailInfo.find(each=>each.key === validatorData?.key)?.discord || "", "discord") ? 
                  (validatorData?.discord || detailInfo.find(each=>each.key === validatorData?.key)?.discord || "") : "#"
                } target="_blank">
                  <FaDiscord size={22} />
                </a>
                <a href={
                  isValidLink(validatorData?.twitter || detailInfo.find(each=>each.key === validatorData?.key)?.twitter || "", "twitter") ?
                  (validatorData?.twitter || detailInfo.find(each=>each.key === validatorData?.key)?.twitter || "") : "#"
                }  target="_blank">
                  <FaXTwitter size={22} />
                </a>
                <a href={
                  isValidLink(validatorData?.website || detailInfo.find(each=>each.key === validatorData?.key)?.website || "", "website") ?
                  (validatorData?.website || detailInfo.find(each=>each.key === validatorData?.key)?.website || "") : "#"

                } target="_blank">
                  <TbWorld size={22} />
                </a>
              </div>
              <div className="mt-4">
                {!isConnected && (
                  <p className="text-[10px] mb-1 italic text-center">
                    You have not connected your wallet.
                  </p>
                )}
                <Button
                  size="large"
                  variant="outlined"
                  className="w-full justify-center"
                  isDisabled={!isConnected}
                  onClick={() => setStakingOpen(true)}
                >
                  Stake Now
                </Button>
                {validatorData?.verified_type === "unverified" && <Button
                  size="large"
                  variant="outlined"
                  className="w-full justify-center mt-4"
                  isDisabled={!isConnected}
                  onClick={() => setVerifyOpen(true)}
                >
                  Verify Module
                </Button>}
                {validatorData?.key === selectedAccount?.address && (
                  <Button
                    size="large"
                    variant="outlined"
                    className="w-full justify-center mt-4"
                    isDisabled={!isConnected}
                    onClick={() => setUpdateOpen(true)}
                  >
                    Update Details
                  </Button>
                
                )}
              </div>
            </div>
            <div className="flex gap-4 flex-col flex-1">
              <div className="sm:w-auto w-52">
                <p className="card-validator-heading ">
                  <GoKey size={16} /> Validator Key
                </p>
                <h5 className="card-validator-data truncate">
                  {validatorData?.key}
                </h5>
              </div>
              <div>
                <p className="card-validator-heading">
                  <PiCirclesFourLight size={20} /> Network URL
                </p>
                <h5 className="card-validator-data">
                  {validatorData?.address}
                </h5>
              </div>
              <div>
                <p className="card-validator-heading ">
                  <GiProfit size={20} />
                  APY
                </p>
                <h5 className="card-validator-data">
                {validatorData?.type == "miner" ? '-': `${validatorData?.apy?.toFixed(2)} %`}

                </h5>
              </div>
              <div className="container">
                <div className="flex pt-3 flex-wrap lg:space-x-3">
                  <div className="card-validator">
                    <p className="card-validator-heading">
                      <SiBlockchaindotcom size={20} />
                      Total Staked
                    </p>
                    <h5 className="card-validator-data">
                      {numberWithCommas(
                        formatTokenPrice({
                          amount: Number(validatorData?.stake),
                        }),
                      )}{" "}
                      COMAI
                    </h5>
                  </div>
                  <div className="card-validator">
                    <p className="card-validator-heading">
                      <SiBlockchaindotcom size={20} />
                      Registration Block
                    </p>
                    <h5 className="card-validator-data">
                      {validatorData?.regblock}
                    </h5>
                  </div>
                  <div className="card-validator">
                    <p className="card-validator-heading">
                      <FaUsers size={20} />
                      Total Stakers
                    </p>
                    <h5 className="card-validator-data">
                      {validatorData?.total_stakers}
                    </h5>
                  </div>
                </div>

                <div className="flex pt-3 flex-wrap lg:space-x-3">
                  <div className="card-validator">
                    <p className="card-validator-heading">
                      <RiAiGenerate size={20} />
                      Incentive
                    </p>
                    <h5 className="card-validator-data">
                      {validatorData?.incentive}
                    </h5>
                  </div>
                  <div className="card-validator">
                    <p className="card-validator-heading">
                      <RiAiGenerate size={20} />
                      Emission per 100 blocks
                    </p>
                    <h5 className="card-validator-data">
                      {numberWithCommas(
                        formatTokenPrice({
                          amount: Number(validatorData?.emission),
                        }),
                      )}{" "}
                    </h5>
                  </div>
                  <div className="card-validator">
                    <p className="card-validator-heading">
                      <RiAiGenerate size={20} />
                      Dividends
                    </p>
                    <h5 className="card-validator-data">
                      {validatorData?.dividends}
                    </h5>
                  </div>
                </div>

                <StakingModal
                  open={stakingOpen}
                  setOpen={setStakingOpen}
                  validatorId={String(params.id)}
                  subnet_id={Number(params.subnetId)}
                />
                 <VerifyModal
                  open={verifyOpen}
                  setOpen={setVerifyOpen}
                  validatorId={String(params.id)}
                  subnet_id={Number(params.subnetId)}
                />
                 <UpdateDetailsModal
                  open={updateOpen}
                  setOpen={setUpdateOpen}
                  validatorId={String(params.id)}
                  subnet_id={Number(params.subnetId)}
                />
              </div>
            </div>
          </div>
          <div className="my-6">
            {validatorData && validatorData?.stake_from && (
              <StakedUsersTable stakedUsers={validatorData?.stake_from} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ValidatorDetailPage
