import { truncateWalletAddress } from "@/utils"
import React from "react"

const ModuleCard = () => {
  return (
    <div className=" h-[100px] w-[180px] card-shadow flex items-center justify-center flex-col ">
      <h1 className="text-md font-bold">vali::comstats</h1>
      <p className="text-xs">
        {truncateWalletAddress(
          "5H9YPS9FJX6nbFXkm9zVhoySJBX9RRfWF36abisNz5Ps9YaX",
        )}
      </p>
      <div className="flex gap-x-3 justify-between items-center">
        <div className="text-sm text-textPrimary">
          <p className="text-xs  text-textSecondary">APR</p>
          <h6 className="text-sm">30%</h6>
        </div>
        <div className="text-sm text-textPrimary">
          <p className="text-xs text-textSecondary">Total Stakers</p>
          <h6>300</h6>
        </div>
      </div>
    </div>
  )
}

export default ModuleCard
