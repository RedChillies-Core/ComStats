import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import StakingDisclaimer from "../disclaimer"
import { ValidatorType } from "@/types"
import { usePolkadot } from "@/context"
import { formatTokenPrice } from "@/utils"
import { useGetBalanceQuery } from "@/store/api/statsApi"
import { useUserStats } from "@/app/hooks/useUserStats"
import { useBalance } from "@/context/balanceContext"

const UnstakingForm = ({
  validator,
  callback,
}: {
  validator: ValidatorType | undefined
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

  const { selectedAccount, removeStake, api } = usePolkadot()
  const { userBalance: balanceData } = useBalance()
  // const { data: balanceData } = useGetBalanceQuery(
  //   { wallet: String(selectedAccount?.address) },
  //   {
  //     skip: !selectedAccount,
  //   },
  // )
  const onSubmit = (data: any) => {
    removeStake({
      subnetId: Number(validator?.subnet_id) || 0,
      amount: String(data.stakeAmount),
      validator: String(validator?.key),
      callback,
    })
  }
  // useEffect(() => {
  //   console.log('vali, selectedAccount', selectedAccount)
  //   if (selectedAccount?.address && api && validator?.subnet_id) {
  //     console.log("fetching stakeTo")
  //     api?.query.subspaceModule.stakeTo(validator?.subnet_id, selectedAccount?.address).then((res) => {
  //       console.log('vali, stakeTo', res.toJSON())
  //     })
  //   }
  // }, [validator?.subnet_id, selectedAccount?.address, api])
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
            required: "Unstake Amount is Required",
            min: {
              value: 0.000000001,
              message: "Minimum Unstake Amount is 0.000000001 COMAI",
            },
          }}
          maxButton
          handleMaxClick={(e: any) => {
            e.preventDefault()
            setValue(
              "stakeAmount",
              formatTokenPrice({
                amount: Number(
                  balanceData?.stakes?.find(
                    (item) => item.validator.key === validator?.key && item.validator.subnet_id === validator?.subnet_id,
                  )?.amount,
                ),
                precision: 9,
              }),
            )
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
