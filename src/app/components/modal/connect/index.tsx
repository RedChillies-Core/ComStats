import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import React, { useState } from "react"
import Modal from "react-responsive-modal"
import Button from "../../button"
import { AiFillCheckCircle } from "react-icons/ai"

const WalletModal = ({
  open,
  setOpen,
  wallets,
  handleWalletSelections,
}: {
  open: boolean
  setOpen: (args: boolean) => void
  wallets: InjectedAccountWithMeta[]
  handleWalletSelections: (arg: InjectedAccountWithMeta) => void
}) => {
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>()
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      center
      classNames={{
        modal: "rounded-lg shadow-card min-w-[500px]",
      }}
    >
      Select one of your wallet
      <hr className="my-3" />
      <div className="mt-5">
        <div className="flex flex-col gap-y-4">
          {[...wallets, ...wallets].map((item) => (
            <button
              key={item.address}
              className="border-2 text-sm rounded-xl border-purple p-3 px-3 cursor-pointer shadow-md flex items-center gap-x-3"
              onClick={() => setSelectedAccount(item)}
            >
              {selectedAccount === item && (
                <AiFillCheckCircle size={20} className="text-green-400" />
              )}{" "}
              {item.address}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <Button
          variant="primary"
          size="large"
          className="w-full justify-center"
          onClick={() =>
            handleWalletSelections(selectedAccount as InjectedAccountWithMeta)
          }
        >
          Connect Now!
        </Button>
      </div>
    </Modal>
  )
}

export default WalletModal
