import Button from "@/app/components/button";
import { Input } from "@/app/components/input";
import SelectComp from "@/app/components/select";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { usePolkadot } from "@/context";
import { ValidatorType } from "@/types";
import {
  useGetBalanceQuery,
  useGetValidatorsQuery,
} from "@/store/api/statsApi";
import { formatTokenPrice } from "@/utils";
import { getVerificationAmount } from "@/utils/getVerificationAmount";
import { errorToast } from "../../toast";
import { api } from "@/store/api/api";
import { toast } from "react-toastify";

type ValidatorDetails = {
  /**
   * description, twitter, discord, website, message, signature
   */
  // key: string;
  // name: string;
  description: string;
  twitter?: string;
  discord?: string;
  website?: string;
  image?: FileList;
};

const UpdateDetailsForm = ({
  validator,
  callback,
}: {
  validator: ValidatorType | undefined;
  callback?: () => void;
}) => {
  // const {selectedAccount, setExtensionSelected} = usePolkadot();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ValidatorDetails>({
    mode: "all",
    defaultValues: {
      description: validator?.description || "",
      twitter: validator?.twitter || "",
      discord: validator?.discord || "",
      website: validator?.website || "",
      // image: validator?.image || "",
    },
  });
  const { verifyModule, selectedAccount, extensionSelected } = usePolkadot();

  const { data: validatorData } = useGetValidatorsQuery();
  const { data: balanceData } = useGetBalanceQuery(
    { wallet: String(selectedAccount?.address) },
    {
      skip: !selectedAccount,
    }
  );

  const onSubmit = async (data: any) => {
    console.log("data", data);
    try {
      if (!data.image) {
        toast.error("Image is required");
        return;
      }
      if (!data.description) {
        toast.error("Description is required");
        return;
      }
      if (data.description.length > 1000) {
        toast.error("Description is too long");
        return;
      }
      if (
        !selectedAccount?.address ||
        !extensionSelected ||
        !selectedAccount ||
        !validator ||
        selectedAccount?.address !== validator?.key
      ) {
        errorToast("You are not allowed to update this module");
        return;
      }
      const message = `Please sign this message with nonce ${Math.floor(
        new Date().getTime() / 1000
      )} to update the details of the module ${validator?.name} on ComStats`;
      if (!extensionSelected?.signer || !extensionSelected.signer?.signRaw)
        return;
      const { signature } = await extensionSelected.signer.signRaw({
        address: selectedAccount?.address,
        data: message,
        type: "payload",
      });
      const formData = new FormData();
      formData.append("description", data.description);
      formData.append("twitter", data.twitter);
      formData.append("discord", data.discord);
      formData.append("website", data.website);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      formData.append("message", message);
      formData.append("signature", signature);
      await api.post(
        `v2/metadata/${validator?.subnet_id}/${validator?.key}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      callback && callback();
    } catch (error) {
      errorToast("Failed to update module details");
    }
  };

  return (
    <form className="space-y-1 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        Description
        <div className="relative">
          <textarea
            placeholder="Description"
            className="w-full bg-white border text-sm leading-6 font-medium text-[#202223] border-border rounded-lg  px-3 py-3 focus:ring-purple focus:outline-purple "
            {...register("description", {
              required: "Description is required",
              validate: {
                lessThan1000: (value) =>
                  value.length < 1000 || "Description is too long",
              },
            })}
          />
          {errors.description && (
            <span className="text-red-500 text-xs">
              {errors.description.message}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        Twitter Link
        <div className="relative">
          <input
            placeholder="Twitter"
            type="text"
            className="w-full bg-white border text-sm leading-6 font-medium text-[#202223] border-border rounded-lg  px-3 py-3 focus:ring-purple focus:outline-purple "
            {...register("twitter", {})}
          />
        </div>
      </div>

      <div className="space-y-1">
        Discord Link
        <div className="relative">
          <input
            placeholder="Discord"
            type="text"
            className="w-full bg-white border text-sm leading-6 font-medium text-[#202223] border-border rounded-lg  px-3 py-3 focus:ring-purple focus:outline-purple "
            {...register("discord", {})}
          />
        </div>
      </div>

      <div className="space-y-1">
        Website Link
        <div className="relative">
          <input
            placeholder="Website"
            type="text"
            className="w-full bg-white border text-sm leading-6 font-medium text-[#202223] border-border rounded-lg  px-3 py-3 focus:ring-purple focus:outline-purple "
            {...register("website", {})}
          />
        </div>
      </div>

      <div className="space-y-1">
        Image
        <div className="relative">
          <input
            type="file"
            className="w-full bg-white border text-sm leading-6 font-medium text-[#202223] border-border rounded-lg  px-3 py-3 focus:ring-purple focus:outline-purple "
            {...register("image", {
              // required: "Image is required",
              validate: {
                fileFormat: (value) => {
                  if (value && value?.length > 0) {
                    return (
                      value[0].type.includes("image") || "Invalid file format"
                    );
                  }
                  return true;
                },
                fileSize: (value) => {
                  if (value && value?.length > 0) {
                    return (
                      value[0].size < 5000000 ||
                      "Image size should be less than 5MB"
                    );
                  }
                  return true;
                },
              },
            })}
            multiple={false}
          />
          {errors.image && (
            <span className="text-red-500 text-xs">{errors.image.message}</span>
          )}
        </div>
      </div>

      <div className="pt-3">
        {/* Cost for Verification:{" "}
        {getVerificationAmount(
          getValues().type?.value,
          getValues().duration?.value
        )}{" "}
        $COMAI */}
      </div>
      <Button
        size="large"
        variant="primary"
        className="w-full justify-center"
        onClick={() => {}}
        isDisabled={
          selectedAccount?.address === "" ||
          !extensionSelected ||
          !selectedAccount ||
          !validator ||
          selectedAccount?.address !== validator?.key
        }
      >
        Update Module
      </Button>
    </form>
  );
};

export default UpdateDetailsForm;
