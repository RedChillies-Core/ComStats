import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import SelectComp from "@/app/components/select"
import React from "react"
import { useForm } from "react-hook-form"
import StakingDisclaimer from "../disclaimer"
import { usePolkadot } from "@/context"
import { ValidatorType } from "@/types"
import { useGetValidatorsQuery } from "@/store/api/statsApi"

const TransferStakingForm = ({
  validator,
}: {
  validator: ValidatorType | undefined
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const { transferStake } = usePolkadot()
  const { data } = useGetValidatorsQuery()
  const onSubmit = (data: any) => {
    transferStake({
      amount: String(data.stakeAmount),
      validatorFrom: String(validator?.key),
      validatorTo: String(data.validator),
    })
  }
  return (
    <form className="space-y-1 w-full" onSubmit={handleSubmit(onSubmit)}>
      <SelectComp
        label="Select Validator"
        name="validator"
        isSearchable
        placeholder=""
        options={[{ label: "NA", value: "NA" }]}
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
