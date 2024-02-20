import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import React from "react"
import { useForm } from "react-hook-form"
import { FaSearch } from "react-icons/fa"

const SearchWalletForm = ({
  wallet,
  setWallet,
}: {
  wallet?: string
  setWallet: (args: string) => void
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      wallet: wallet,
    },
  })

  const onSubmit = (data: any) => {
    setWallet(data.wallet)
  }
  return (
    <form className="space-y-1 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="pt-3">
        <Input
          type="string"
          placeholder="Enter your wallet address"
          register={register}
          name="wallet"
          rules={{
            required: "Wallet is Required",
          }}
          errors={errors.wallet}
        />
      </div>
      <div className="py-3">
        <Button
          size="large"
          variant="transparent"
          className="w-full justify-center"
          prefix={<FaSearch />}
          onClick={() => { }}
        >
          Check Now
        </Button>
      </div>
    </form>
  )
}

export default SearchWalletForm
