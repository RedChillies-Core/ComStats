"use client"
import { statsApi } from "@/store/api/statsApi"
import React from "react"
import ModuleCard from "../components/card/subnet"

const Subnets = () => {
  const { data } = statsApi.useGetSubnetsQuery()
  const { data: subnetInfo } = statsApi.useGetSubnetByIdQuery("0")
  console.log(subnetInfo)

  return (
    <div className="container">
      <div className="flex p-3">
        <div className="w-72">
          <div className="py-3 flex flex-wrap gap-1 items-center">
            {data?.map((item) => (
              <button
                className="rouded-sm border px-5 py-1  w-8 flex items-center justify-center"
                key={item.subnet_id}
              >
                {item.subnet_id}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 flex gap-x-3">
          <ModuleCard />
          <ModuleCard />
          <ModuleCard />
        </div>
      </div>
    </div>
  )
}

export default Subnets
