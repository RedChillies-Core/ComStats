import React, { useEffect, useState } from "react"
import { AiFillInfoCircle, AiOutlineClear } from "react-icons/ai"
import { LiaCubesSolid } from "react-icons/lia"
import Modal from "react-responsive-modal"
import Button from "../../button"
import { FaMoneyBillTransfer, FaSpinner } from "react-icons/fa6"
import AddStakingForm from "../../forms/stake/add"
import TransferStakingForm from "../../forms/stake/transfer"
import UnstakingForm from "../../forms/stake/unstake"
import {
  useGetBalanceQuery,
  useGetValidatorsByIdQuery,
} from "@/store/api/statsApi"
import { usePolkadot } from "@/context"
import { numberWithCommas } from "@/utils/numberWithCommas"
import Verified from "../../verified"
import VerifyModuleForm from "../../forms/verify"

type IVerifyModal = {
  open: boolean
  setOpen: (arg: boolean) => void
  validatorId: string
}
const VerifyModal = ({ open, setOpen, validatorId }: IVerifyModal) => {
  const { selectedAccount } = usePolkadot()
  const {
    data: validatorData,
    isLoading: validatorLoading,
    refetch: validatorRefetch,
  } = useGetValidatorsByIdQuery({
    key: validatorId,
    wallet: String(selectedAccount?.address),
  })

  const { refetch: refetchBalance } = useGetBalanceQuery(
    { wallet: String(selectedAccount?.address) },
    {
      skip: !selectedAccount,
    }
  )

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      center
      classNames={{
        modal:
          "md:!max-w-[800px] !max-w-[95vw] md:!min-w-[500px] !min-w-[90vw] bg-white rounded-xl shadow-md",
      }}
    >
      <h1 className="text-lg font-semibold leading-8">
        Verify {validatorData?.type}
      </h1>
      <hr />
      <div className="w-full">
        <div className="my-3">
          {validatorLoading && <FaSpinner className="spinner" />}
          {!validatorLoading && (
            <div className="border-[2px] my-5 p-4 text-sm rounded-lg shadow-card">
              <div className="flex justify-between">
                <h6 className=" text-base tracking-tight font-semibold flex items-center">
                  <LiaCubesSolid size={40} /> Module Details
                </h6>
              </div>
              <hr className="my-2" />
              <ul>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">Name</h6>
                  <div className="flex items-center">
                    <h1 className="font-normal">{validatorData?.name}</h1>
                    {validatorData?.verified_type !== "unverified" && (
                      <Verified
                        isGold={validatorData?.verified_type === "golden"}
                        isOfComStats={validatorData?.expire_at === -1}
                      />
                    )}
                  </div>
                </li>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">
                    Total Staked{" "}
                  </h6>
                  <h1 className="font-normal w-1/2 tracking-tighter">
                    {numberWithCommas(
                      (Number(validatorData?.stake) / 10 ** 9).toFixed(2)
                    )}{" "}
                    COMAI
                  </h1>
                </li>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">
                    Total Stakers{" "}
                  </h6>
                  <h1 className="font-normal w-1/2 tracking-tighter">
                    {numberWithCommas(validatorData?.total_stakers)}
                  </h1>
                </li>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">
                    Net APY{" "}
                  </h6>
                  <h1 className="font-normal w-1/2 tracking-tighter">
                    {validatorData?.type === "miner"
                      ? "-"
                      : `${validatorData?.apy?.toFixed(2)} %`}
                  </h1>
                </li>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">Fees</h6>
                  <h1 className="font-normal w-1/2 tracking-tighter">
                    {validatorData?.delegation_fee}%
                  </h1>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="pt-4">
          <VerifyModuleForm
            validator={validatorData}
            callback={() => {
              setOpen(false)
              setTimeout(() => {
                refetchBalance()
                validatorRefetch()
              }, 8000)
            }}
          />
        </div>
      </div>
    </Modal>
  )
}

export default VerifyModal
