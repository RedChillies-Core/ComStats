import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import React from "react"
import { useForm } from "react-hook-form"
import StakingDisclaimer from "../disclaimer"

const AddStakingForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const onSubmit = () => {}
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
        />
      </div>
      <StakingDisclaimer />
      <Button
        size="large"
        variant="primary"
        className="w-full justify-center"
        onClick={() => {}}
      >
        Stake $COMAI
      </Button>
    </form>
  )
}

export default AddStakingForm
