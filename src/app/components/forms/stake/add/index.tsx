import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import StakingDisclaimer from "../disclaimer"
import { usePolkadot } from "@/context"
import { useGetBalanceQuery } from "@/store/api/statsApi"
import { ValidatorType } from "@/types"

const AddStakingForm = ({
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

  const { addStake, selectedAccount } = usePolkadot()
  const { data } = useGetBalanceQuery(
    { wallet: String(selectedAccount?.address) },
    {
      skip: !selectedAccount,
    },
  )

  const onSubmit = (data: any) => {
    addStake({
      validator: String(process.env.NEXT_PUBLIC_COMSWAP_VALIDATOR),
      amount: data.stakeAmount,
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
              <div className="text-sm">234.56 $COMAI</div>
            </div>
          }
          type="number"
          placeholder=""
          maxButton
          handleMaxClick={() => alert("Max")}
          register={register}
          name="stakeAmount"
          errors={errors["stakeAmount"]}
          rules={{ required: "Amount is required" }}
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
