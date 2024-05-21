import React from "react"
import Modal from "react-responsive-modal"
import ManageStakingForm from "../../forms/stake/manage"
import Link from "next/link"

type IStakingModal = {
  open: boolean
  setOpen: (arg: boolean) => void
}

const ManageStakingModal = ({ open, setOpen }: IStakingModal) => {
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
      <h1 className="text-lg md:text-xl font-semibold leading-8 mb-4">
        Manage Stake
      </h1>
      <hr className="mb-4" />
      <ManageStakingForm />
      <Link href="/portfolio" className="block mt-4 text-center">
        <p className="underline text-sm md:text-base">
          Looking for your stakes? Check here.
        </p>
      </Link>
    </Modal>
  )
}

export default ManageStakingModal
