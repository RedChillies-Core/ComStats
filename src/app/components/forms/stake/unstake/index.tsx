import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import React from "react"
import { useForm } from "react-hook-form"
import StakingDisclaimer from "../disclaimer"
import { ValidatorType } from "@/types"
import { usePolkadot } from "@/context"

const UnstakingForm = ({
  validator,
}: {
  validator: ValidatorType | undefined
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  })

  const { selectedAccount, removeStake } = usePolkadot()

  const onSubmit = (data: any) => {
    removeStake({
      amount: String(data.stakeAmount),
      validator: String(validator?.key),
    })
  }
  return (
    <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input
          label={
            <div className="text-sm text-customBlack">Input $COMAI Amount</div>
          }
          type="number"
          placeholder=""
          register={register}
          name="stakeAmount"
          errors={errors["stakeAmount"]}
          rules={{
            required: "Stake Amount is Required",
          }}
        />
      </div>
      {/* <StakingDisclaimer /> */}

      <Button
        size="large"
        variant="primary"
        className="w-full justify-center"
        onClick={() => {}}
      >
        Unstake $COMAI
      </Button>
    </form>
  )
}

export default UnstakingForm
