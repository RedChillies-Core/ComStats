"use client"
import { statsApi } from "@/store/api/statsApi"
import React from "react"
import SubnetTable from "../components/table/subnet"
import { FaRegCircleCheck } from "react-icons/fa6"
import Skeleton from "react-loading-skeleton"
import Verified from "../components/verified"
import Link from "next/link"

const Subnets = () => {
  const [subnetId, setSubnetId] = React.useState<string>("0")
  const { data, isLoading } = statsApi.useGetSubnetsQuery()
  const {
    data: subnetValidators,
    refetch,
    isLoading: subnetLoading,
  } = statsApi.useGetSubnetByIdQuery(subnetId)
  const handleSubnetChange = (subnetId: string) => {
    setSubnetId(subnetId)
    refetch()
  }
  const nonVerifiedValidators = subnetValidators?.filter(
    (validator) => !validator.isVerified,
  )
  const verifiedValidators = subnetValidators?.filter(
    (validator) => validator.isVerified,
  )

  return (
    <div className="container">
      {isLoading && (
        <div className="flex flex-wrap gap-2 items-center w-full py-10">
          {new Array(30).fill(0).map((_, index) => (
            <Skeleton
              count={1}
              key={index}
              className=" !w-[100px] h-[30px] rounded-3xl"
            />
          ))}
        </div>
      )}
      <div className="flex flex-nowrap gap-x-3 mt-6 overflow-scroll w-[100%] md:flex-wrap hide-scrollbar">
        {verifiedValidators?.map((item, key) => (
          <Link href={`/validator/${item.subnet_id}/${item.key}`} key={key}>
            <div className="p-3 border-[1px] flex rounded-2xl gap-x-1 items-center my-1 text-sm">
              <Verified isGold={item.verified_type === "golden"} />
              {item.name}
            </div>
          </Link>
        ))}
      </div>
      {!isLoading && (
        <div className="py-5 flex flex-wrap gap-2 items-center">
          {data?.map((item) => (
            <button
              className={`border px-5 py-1  w-fit flex items-center justify-center rounded-3xl gap-x-2 ${
                item.subnet_id === Number(subnetId)
                  ? "bg-purple text-white"
                  : "border-gray-300"
              }`}
              key={item.subnet_id}
              onClick={() => handleSubnetChange(String(item.subnet_id))}
            >
              {item.subnet_id === Number(subnetId) && <FaRegCircleCheck />}{" "}
              {item.name || item.subnet_id}
            </button>
          ))}
        </div>
      )}

      <SubnetTable
        subnet={nonVerifiedValidators || []}
        isLoading={subnetLoading}
      />
    </div>
  )
}

export default Subnets
