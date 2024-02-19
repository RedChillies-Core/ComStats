import React, { useState } from "react"
import { AiFillInfoCircle, AiOutlineClear } from "react-icons/ai"
import { LiaCubesSolid } from "react-icons/lia"
import Modal from "react-responsive-modal"
import Button from "../../button"
import { FaMoneyBillTransfer } from "react-icons/fa6"
import AddStakingForm from "../../forms/stake/add"
import TransferStakingForm from "../../forms/stake/transfer"
import UnstakingForm from "../../forms/stake/unstake"

type IStakingModal = {
  open: boolean
  setOpen: (arg: boolean) => void
}
const StakingModal = ({ open, setOpen }: IStakingModal) => {
  const [selectedOperation, setSelectedOperation] = useState("add")
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      center
      classNames={{
        modal: "rounded-lg shadow-card",
      }}
    >
      <h1 className="text-lg font-semibold leading-8">Manage Stake</h1>
      <hr />
      <div className="w-full">
        <div className="my-3">
          <div className="border-[2px] my-5 p-4 text-sm rounded-lg shadow-card">
            <div className="flex justify-between">
              <h6 className=" text-base tracking-tight font-semibold flex items-center">
                <LiaCubesSolid size={40} /> Validator Details
              </h6>
            </div>
            <hr className="my-2" />
            <ul>
              <li className="flex gap-x-2 pb-1">
                <h6 className="font-normal w-1/2 tracking-tighter">Name</h6>
                <h1 className="font-normal w-1/2">ekdhfy.....wiuhh</h1>
              </li>
              <li className="flex gap-x-2 pb-1">
                <h6 className="font-normal w-1/2 tracking-tighter">
                  Total Staked{" "}
                </h6>
                <h1 className="font-normal w-1/2 tracking-tighter">2 COMAI</h1>
              </li>
              <li className="flex gap-x-2 pb-1">
                <h6 className="font-normal w-1/2 tracking-tighter">
                  Total Stakers{" "}
                </h6>
                <h1 className="font-normal w-1/2 tracking-tighter">400</h1>
              </li>
              <li className="flex gap-x-2 pb-1">
                <h6 className="font-normal w-1/2 tracking-tighter">
                  Monthly APY{" "}
                </h6>
                <h1 className="font-normal w-1/2 tracking-tighter">5%</h1>
              </li>
              <li className="flex gap-x-2 pb-1">
                <h6 className="font-normal w-1/2 tracking-tighter">Fees</h6>
                <h1 className="font-normal w-1/2 tracking-tighter">2.34%</h1>
              </li>
            </ul>
          </div>
          <div className="flex p-3 rounded-2xl bg-green-100 items-center justify-between">
            <h5 className="text-sm font-semibold flex items-center gap-x-3">
              <AiFillInfoCircle />
              You have staked $300 COMAI here.
            </h5>
          </div>
        </div>
        <div className="flex py-2 flex-col gap-y-3  justify-between sm:flex-row sm:gap-x-3">
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
        </div>
        <div className="pt-4">
          {selectedOperation === "add" && <AddStakingForm />}
          {selectedOperation === "transfer" && <TransferStakingForm />}
          {selectedOperation === "unstake" && <UnstakingForm />}
        </div>
      </div>
    </Modal>
  )
}

export default StakingModal
