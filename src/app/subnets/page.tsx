"use client"
import { statsApi } from "@/store/api/statsApi"
import React from "react"
import SubnetValidatorTable from "../components/table/subnetValidator"
import { FaRegCircleCheck } from "react-icons/fa6"
import Skeleton from "react-loading-skeleton"
import SubnetRootnetTable from "../components/table/subnetRootnet"

const Subnets = () => {
  const [page, setPage] = React.useState<number>(1)
  const [subnetId, setSubnetId] = React.useState<string>("0")
  const { data, isLoading } = statsApi.useGetSubnetsQuery()
  const {
    data: subnetValidators,
    refetch,
    isLoading: subnetLoading,
  } = statsApi.useGetSubnetByIdQuery({
    subnetId: subnetId,
    page: page,
  })
  const handleSubnetChange = (subnetId: string) => {
    setSubnetId(subnetId)
    setPage(1)
    refetch()
  }
  const handlePageClick = (event: { selected: any }) => {
    setPage(Number(event.selected + 1))
    refetch()
  }
  return (
    <div className="container sm:px-0 px-8">
      {!isLoading && (
        <div className="py-3 text-[14px] flex flex-wrap gap-2 items-center mt-3">
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
              {item.subnet_id === Number(subnetId) && <FaRegCircleCheck />} SN
              {item.subnet_id}::{item.name}
            </button>
          ))}
        </div>
      )}
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

      {subnetId.toString() === "0" ? (
        <SubnetRootnetTable
          validators={subnetValidators}
          handlePageClick={handlePageClick}
          subnets={data || []}
          isLoading={subnetLoading}
        />
      ) : (
        <SubnetValidatorTable
          validators={subnetValidators}
          handlePageClick={handlePageClick}
          isLoading={subnetLoading}
        />
      )}
    </div>
  )
}

export default Subnets
