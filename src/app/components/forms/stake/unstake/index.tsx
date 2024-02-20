import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import React from "react"
import { useForm } from "react-hook-form"
import StakingDisclaimer from "../disclaimer"
import { ValidatorType } from "@/types"

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
  const onSubmit = () => {}
  return (
    <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
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
        />
      </div>
      <StakingDisclaimer />

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
