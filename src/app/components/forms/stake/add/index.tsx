import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import { useForm } from "react-hook-form"
import StakingDisclaimer from "../disclaimer"
import { usePolkadot } from "@/context"
import { ValidatorExtendedType } from "@/types"
import { formatTokenPrice } from "@/utils"
import { infoToast } from "@/app/components/toast"
import { useBalance } from "@/context/balanceContext"

const AddStakingForm = ({
  validator,
  callback,
}: {
  validator: ValidatorExtendedType | undefined
  callback?: () => void
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "all",
  })

  const { addStake } = usePolkadot()
  const { userBalance: balanceData } = useBalance()

  const onSubmit = (data: any) => {
    if (Number(balanceData?.balance) / 10 ** 9 < Number(data.stakeAmount)) {
      infoToast("Insufficient Balance")
      return
    }
    addStake({
      validator:
        validator?.key || String(process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR),
      amount: data.stakeAmount,
      callback,
    })
  }
  return (
    <form className="space-y-2 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input
          label={
            <div className="flex justify-between">
              <div className="text-sm text-customBlack">
                Input $COMAI Amount
              </div>
              <div className="text-sm">
                {formatTokenPrice({ amount: Number(balanceData?.balance) })}{" "}
                $COMAI
              </div>
            </div>
          }
          type="number"
          placeholder=""
          maxButton
          handleMaxClick={(e: any) => {
            e.preventDefault()
            const amount = Number(balanceData?.balance) - 1000 - 2 * 10 ** 9
            // if(amount < 0) {
            //   // errorToast("Insufficient Balance")
            //   return
            // }
            setValue(
              "stakeAmount",
              formatTokenPrice({
                amount: amount < 0 ? 0 : amount,
                precision: 9,
              })
            )
          }}
          register={register}
          name="stakeAmount"
          errors={errors["stakeAmount"]}
          rules={{
            required: "Amount is required",
            min: {
              value: 0.000001,
              message: "Minimum staking amount is 0.000001 COMAI",
            },
          }}
        />
      </div>
      <StakingDisclaimer />
      <Button
        size="large"
        variant="primary"
        // isLoading
        className="w-full justify-center"
        onClick={() => {}}
      >
        Stake $COMAI
      </Button>
    </form>
  )
}

export default AddStakingForm
