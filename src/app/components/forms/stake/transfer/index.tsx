import Button from "@/app/components/button"
import { Input } from "@/app/components/input"
import SelectComp from "@/app/components/select"
import { useForm } from "react-hook-form"
import StakingDisclaimer from "../disclaimer"
import { usePolkadot } from "@/context"
import { ValidatorExtendedType } from "@/types"
import { useGetAllValidatorsQuery } from "@/store/api/statsApi"
import { formatTokenPrice } from "@/utils"
import { useBalance } from "@/context/balanceContext"

const TransferStakingForm = ({
  validator,
  callback,
}: {
  validator: ValidatorExtendedType | undefined
  callback?: () => void
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
  const { transferStake, selectedAccount } = usePolkadot()

  const { data: validatorData } = useGetAllValidatorsQuery()
  const { userBalance: balanceData } = useBalance()

  const onSubmit = (data: any) => {
    transferStake({
      amount: String(data.stakeAmount),
      validatorFrom: String(validator?.key),
      validatorTo: String(data.validator.value),
      callback,
    })
  }

  return (
    <form className="space-y-1 w-full" onSubmit={handleSubmit(onSubmit)}>
      <SelectComp
        label="Select Module"
        name="validator"
        isSearchable
        placeholder=""
        value={{
          label: "vali::comstats",
          value: "5H9YPS9FJX6nbFXkm9zVhoySJBX9RRfWF36abisNz5Ps9YaX",
        }}
        options={validatorData?.map((d) => ({
          label: d.name,
          value: d.key,
        }))}
        control={control}
        errors={errors["validator"]}
        rules={{ required: "Module is required" }}
      />
      <div className="pt-3">
        <Input
          type="number"
          placeholder=""
          label={
            <div className="flex justify-between">
              <div className="text-sm text-customBlack">
                Input $COMAI Amount
              </div>
            </div>
          }
          register={register}
          name="stakeAmount"
          rules={{
            required: "Stake Amount is Required",
          }}
          errors={errors.stakeAmount}
          maxButton
          handleMaxClick={(e: any) => {
            e.preventDefault()
            const amount = Number(
              balanceData?.stakes?.find(
                (item) =>
                  item.validator.key === validator?.key &&
                  item.validator.subnet_id === validator?.subnet_id
              )?.amount ?? 0
            )
            setValue(
              "stakeAmount",
              formatTokenPrice({
                amount: amount < 0 ? 0 : amount,

                precision: 9,
              })
            )
          }}
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
