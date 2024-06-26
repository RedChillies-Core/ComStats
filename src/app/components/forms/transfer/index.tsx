import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import { usePolkadot } from "@/context"
import { useGetBalanceQuery } from "@/store/api/statsApi"
import { formatTokenPrice } from "@/utils"
import React from "react"
import { useForm } from "react-hook-form"
import { errorToast } from "../../toast"
import { useUserStats } from "@/app/hooks/useUserStats"
import { useBalance } from "@/context/balanceContext"

const TransferForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const { transfer, selectedAccount } = usePolkadot()
  const {userBalance: balanceData, fetchUserStats:refetchSearch} = useBalance()
  const onSubmit = (data: any) => {
    transfer({
      amount: data.amount,
      to: String(data.receiverWallet),
      callback: () => {
        reset()
        setTimeout(() => {
          refetchSearch?.()
        }, 8000)
      },
    })
  }
 
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
              <div className="text-sm">{formatTokenPrice({ amount: Number(balanceData?.balance) })} $COMAI</div>
            </div>
          }
          type="number"
          placeholder=""
          maxButton
          handleMaxClick={(e: any) => {
            e.preventDefault()
            const amount = Number(balanceData?.balance) - 1000 - 8 * 10 ** 8
            
            setValue(
              "amount",
              formatTokenPrice({ amount: amount < 0 ? 0 : amount, precision: 9 }),
            )
          }}
          register={register}
          name="amount"
          errors={errors["amount"]}
          rules={{
            required: "Amount is required",
            min: {
              value: 0.000000001,
              message: "Minimum Amount is 0.000000001 COMAI",
            },
          }}
        />
      </div>

      <Button
        size="large"
        variant="primary"
        className="w-full justify-center"
        onClick={() => { }}
      >
        Transfer $COMAI
      </Button>
    </form>
  )
}

export default TransferForm
