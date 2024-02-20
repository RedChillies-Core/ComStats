import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import SelectComp from "@/app/components/select"
import React from "react"
import { useForm } from "react-hook-form"
import StakingDisclaimer from "../disclaimer"
import { usePolkadot } from "@/context"
import { ValidatorType } from "@/types"
import { useGetBalanceQuery, useGetValidatorsQuery } from "@/store/api/statsApi"
import { formatTokenPrice } from "@/utils"
import { infoToast } from "@/app/components/toast"

const TransferStakingForm = ({
  validator,
}: {
  validator: ValidatorType | undefined
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const { transferStake } = usePolkadot()

  const { data: validatorData } = useGetValidatorsQuery()
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
        options={validatorData?.validators?.map((d) => ({
          label: d.name,
          value: d.key,
        }))}
        control={control}
        errors={errors["validator"]}
        rules={{ required: "Validator is required" }}
      />
      <div className="pt-3">
        <Input
          type="number"
          placeholder=""
          label={
            <div className="flex justify-between">
              <div className="text-sm text-customBlack">
                Enter Receiver Wallet
              </div>
            </div>
          }
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
