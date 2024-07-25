import Button from "@/app/components/button"
import SelectComp from "@/app/components/select"
import { useForm } from "react-hook-form"
import { usePolkadot } from "@/context"
import { ValidatorExtendedType } from "@/types"
import { getVerificationAmount } from "@/utils/getVerificationAmount"
import { errorToast } from "../../toast"
import { useBalance } from "@/context/balanceContext"

const VerifyModuleForm = ({
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
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const { verifyModule } = usePolkadot()

  const { userBalance: balanceData } = useBalance()

  const onSubmit = (data: any) => {
    console.log(balanceData?.balance)
    if (
      (balanceData?.balance ?? 0) / 1e9 <
      getVerificationAmount(
        getValues().type?.value,
        getValues().duration?.value
      )
    ) {
      errorToast("Insufficient balance")
      return
    }
    verifyModule({
      verificationType: data.type.value,
      duration: data.duration.value,
      key: String(validator?.key),
      subnetId: validator?.subnet_id ?? 0,
      callback,
    })
  }

  return (
    <form className="space-y-1 w-full" onSubmit={handleSubmit(onSubmit)}>
      <SelectComp
        label="Select Verification Type"
        name="type"
        isSearchable
        placeholder=""
        value={{
          label: "",
          value: "verified",
        }}
        options={[
          {
            label: "Normal Verification",
            value: "verified",
          },
          {
            label: "Golden Verification",
            value: "golden",
          },
        ]}
        control={control}
        errors={errors["type"]}
        rules={{ required: "Type is required" }}
        valueChange={(e) => {
          trigger("type")
        }}
      />
      <div className="pt-3">
        <SelectComp
          label="Select Duration"
          name="duration"
          isSearchable
          placeholder=""
          value={{
            label: "",
            value: "monthly",
          }}
          options={[
            {
              label: "Monthly",
              value: "monthly",
            },
            {
              label: "Yearly",
              value: "yearly",
            },
          ]}
          control={control}
          errors={errors["duration"]}
          valueChange={(e) => {
            trigger("duration")
          }}
          rules={{ required: "Duration is required" }}
        />
      </div>
      <div className="pt-3">
        Cost for Verification:{" "}
        {getVerificationAmount(
          getValues().type?.value,
          getValues().duration?.value
        )}{" "}
        $COMAI
      </div>
      <div>
        Wallet Balance: {((balanceData?.balance ?? 0) / 1e9).toFixed(3)} $COMAI
      </div>
      <div className="text-red-400">
        {(balanceData?.balance ?? 0) / 1e9 <
          getVerificationAmount(
            getValues().type?.value,
            getValues().duration?.value
          ) &&
          `Insufficient balance, additional ${(
            getVerificationAmount(
              getValues().type?.value,
              getValues().duration?.value
            ) -
            (balanceData?.balance ?? 0) / 1e9 +
            1
          ).toFixed(3)} $COMAI required`}
      </div>
      <Button
        size="large"
        variant="primary"
        className="w-full justify-center"
        onClick={() => {}}
        isDisabled={
          (balanceData?.balance ?? 0) / 1e9 <
          getVerificationAmount(
            getValues().type?.value,
            getValues().duration?.value
          )
        }
      >
        Verify Module
      </Button>
    </form>
  )
}

export default VerifyModuleForm
