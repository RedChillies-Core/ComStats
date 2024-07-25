import { useEffect, useMemo, useState } from "react";
import { AiFillInfoCircle, AiOutlineClear } from "react-icons/ai"
import { LiaCubesSolid } from "react-icons/lia"
import Modal from "react-responsive-modal"
import Button from "../../button"
import { FaMoneyBillTransfer, FaSpinner } from "react-icons/fa6"
import AddStakingForm from "../../forms/stake/add"
import TransferStakingForm from "../../forms/stake/transfer"
import UnstakingForm from "../../forms/stake/unstake"
import { useGetValidatorsByIdQuery } from "@/store/api/statsApi";
import { usePolkadot } from "@/context"
import { numberWithCommas } from "@/utils/numberWithCommas"
import Verified from "../../verified"
import { useBalance } from "@/context/balanceContext"

type IStakingModal = {
  open: boolean
  setOpen: (arg: boolean) => void
  validatorId: string
  callback?: () => void
}
const StakingModal = ({
  open,
  setOpen,
  validatorId,
  callback,
}: IStakingModal) => {
  const [selectedOperation, setSelectedOperation] = useState("add")
  const { selectedAccount } = usePolkadot()
  const {
    data: validatorData,
    isLoading: validatorLoading,
    refetch: validatorRefetch,
  } = useGetValidatorsByIdQuery({
    key: validatorId,
    wallet: String(selectedAccount?.address),
  })

  const { userBalance: balanceData, fetchUserStats: refetchBalance } =
    useBalance()

  // const { refetch: refetchBalance } = useGetBalanceQuery(
  //   { wallet: String(selectedAccount?.address) },
  //   {
  //     skip: !selectedAccount,
  //   }
  // );

  useEffect(() => {
    if (open) {
      setSelectedOperation("add")
    }
  }, [open])

  const wallet_staked = useMemo(() => {
    return (
      balanceData?.stakes?.find(
        (d) =>
          d.validator?.key === validatorData?.key &&
          d.validator?.subnet_id === validatorData?.subnet_id
      )?.amount || 0
    )
  }, [balanceData, validatorData])

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      center
      classNames={{
        modal:
          "w-full max-w-md md:max-w-2xl p-4 md:p-6 bg-white rounded-xl shadow-md",
      }}
    >
      <h1 className="text-lg md:text-xl font-semibold leading-8 mb-4">
        Manage Stake
      </h1>
      <hr className="mb-4" />
      <div className="w-full">
        <div className="my-3">
          {validatorLoading && <FaSpinner className="spinner" />}
          {!validatorLoading && (
            <div className="border-2 my-5 p-4 text-sm rounded-lg shadow-card">
              <div className="flex justify-between items-center">
                <h6 className="text-base tracking-tight font-semibold flex items-center">
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
                    Total Staked
                  </h6>
                  <h1 className="font-normal w-1/2 tracking-tighter">
                    {numberWithCommas(
                      (Number(validatorData?.stake || 0) / 10 ** 9).toFixed(2)
                    )}{" "}
                    COMAI
                  </h1>
                </li>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">
                    Total Stakers
                  </h6>
                  <h1 className="font-normal w-1/2 tracking-tighter">
                    {numberWithCommas(validatorData?.total_stakers)}
                  </h1>
                </li>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">APY</h6>
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
          {wallet_staked !== 0 && (
            <div className="flex p-3 rounded-2xl bg-green-100 items-center justify-between">
              <h5 className="text-sm font-semibold flex items-center gap-x-3">
                <AiFillInfoCircle />
                You have staked{" "}
                {numberWithCommas(
                  (Number(wallet_staked) / 10 ** 9).toFixed(2)
                )}{" "}
                COMAI here.
              </h5>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 py-2 justify-between">
          <Button
            variant="outlined"
            prefix={<FaMoneyBillTransfer />}
            size="small"
            className={`${
              selectedOperation === "add" ? "!bg-button !text-white" : ""
            }`}
            onClick={() => setSelectedOperation("add")}
          >
            Add Stake
          </Button>
          {wallet_staked !== 0 && (
            <Button
              variant="outlined"
              prefix={<FaMoneyBillTransfer />}
              size="small"
              className={`${
                selectedOperation === "transfer" ? "!bg-button !text-white" : ""
              }`}
              onClick={() => setSelectedOperation("transfer")}
            >
              Transfer Stake
            </Button>
          )}
          {wallet_staked !== 0 && (
            <Button
              variant="outlined"
              size="small"
              prefix={<AiOutlineClear />}
              className={`${
                selectedOperation === "unstake" ? "!bg-button !text-white" : ""
              }`}
              onClick={() => setSelectedOperation("unstake")}
            >
              Unstake
            </Button>
          )}
        </div>
        <div className="pt-4">
          {selectedOperation === "add" && (
            <AddStakingForm
              validator={validatorData}
              callback={() => {
                setOpen(false)
                setTimeout(() => {
                  refetchBalance?.()
                  validatorRefetch()
                  callback?.()
                }, 8000)
              }}
            />
          )}
          {selectedOperation === "transfer" && (
            <TransferStakingForm
              validator={validatorData}
              callback={() => {
                setOpen(false)
                setTimeout(() => {
                  refetchBalance?.()
                  validatorRefetch()
                  callback?.()
                }, 8000)
              }}
            />
          )}
          {selectedOperation === "unstake" && (
            <UnstakingForm
              validator={validatorData}
              callback={() => {
                setOpen(false)
                setTimeout(() => {
                  refetchBalance?.()
                  validatorRefetch()
                  callback?.()
                }, 8000)
              }}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default StakingModal
