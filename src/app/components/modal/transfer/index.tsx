import React from "react"
import { AiFillCopy } from "react-icons/ai"
import Modal from "react-responsive-modal"
import { usePolkadot } from "@/context"
import TransferForm from "../../forms/transfer"

type ITransferModal = {
  open: boolean
  setOpen: (arg: boolean) => void
}
const TransferModal = ({ open, setOpen }: ITransferModal) => {
  const { selectedAccount } = usePolkadot()
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      center
      classNames={{
        modal: "rounded-lg shadow-card",
      }}
    >
      <h1 className="text-lg font-semibold leading-8">Transfer Funds</h1>
      <hr />
      <div className="w-full">
        <div className="flex p-5 rounded-2xl bg-green-100 items-start justify-between my-5 flex-col">
          <h6 className="text-sm tracking-tighter">Wallet Address:</h6>
          <h5 className="text-sm font-semibold flex items-center gap-x-3">
            {selectedAccount?.address}
            <button
              onClick={() => alert("Copy to Clipboard")}
              className="cursor-pointer"
            >
              <AiFillCopy />
            </button>
          </h5>
        </div>
        <TransferForm />
      </div>
    </Modal>
  )
}

export default TransferModal
