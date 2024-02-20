import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import SelectComp from "@/app/components/select"
import React from "react"
import { useForm } from "react-hook-form"
import StakingDisclaimer from "../disclaimer"
import { usePolkadot } from "@/context"

const TransferStakingForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const { transferStake } = usePolkadot()
  const onSubmit = (data: any) => {
    transferStake({ amount: data.amount })
  }
  return (
    <form className="space-y-1 w-full" onSubmit={handleSubmit(onSubmit)}>
      <SelectComp
        label="Select Validator"
        name="validator"
        isSearchable
        placeholder=""
        options={[
          {
            label: "osi2n1isndsajfisaf",
            value: "123123dsfasfd",
          },
        ]}
        control={control}
        errors={errors["validator"]}
        rules={{ required: "Validator is required" }}
      />
      <div className="pt-3">
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
          rules={{
            required: "Stake Amount is Required",
          }}
          errors={errors.stakeAmount}
        />
      </div>
      <StakingDisclaimer />
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

export default TransferStakingForm
