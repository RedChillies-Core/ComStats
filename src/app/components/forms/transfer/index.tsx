import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import { usePolkadot } from "@/context"
import { useGetBalanceQuery } from "@/store/api/statsApi"
import { formatTokenPrice } from "@/utils"
import React from "react"
import { useForm } from "react-hook-form"

const TransferForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const { transfer, selectedAccount } = usePolkadot()
  const onSubmit = (data: any) => {
    transfer({
      amount: String(Number(data.amount) * 10 ** 9),
      to: String(data.receiverWallet),
    })
  }
  const { data: balanceData } = useGetBalanceQuery(
    { wallet: String(selectedAccount?.address) },
    {
      skip: !selectedAccount,
    },
  )
  return (
    <form className="space-y-2 w-full" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label={
          <div className="flex justify-between">
            <div className="text-sm text-customBlack">
              Enter Receiver Wallet
            </div>
          </div>
        }
        type="string"
        placeholder="Enter the address you want to send"
        register={register}
        name="receiverWallet"
        errors={errors["receiverWallet"]}
        rules={{ required: "Receiver Wallet is required" }}
      />
      <div className="py-2">
        <Input
          label={
            <div className="flex justify-between">
              <div className="text-sm text-customBlack">
                Input $COMAI Amount
              </div>
              <div className="text-sm">234.56 $COMAI</div>
            </div>
          }
          type="number"
          placeholder=""
          maxButton
          handleMaxClick={(e: any) => {
            e.preventDefault()
            setValue(
              "stakeAmount",
              formatTokenPrice({ amount: Number(balanceData?.balance) }),
            )
          }}
          register={register}
          name="amount"
          errors={errors["amount"]}
          rules={{ required: "Amount is required" }}
        />
      </div>

      <Button
        size="large"
        variant="primary"
        className="w-full justify-center"
        onClick={() => {}}
      >
        Transfer $COMAI
      </Button>
    </form>
  )
}

export default TransferForm
