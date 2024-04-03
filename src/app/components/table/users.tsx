import { formatTokenPrice } from "@/utils"
import React, { useState } from "react"
import { FaSearch } from "react-icons/fa"

const StakedUsersTable = ({ stakedUsers }: { stakedUsers: [] }) => {
  const [search, setSearch] = useState("")

  return (
    <div className="max-w-full overflow-x-hidden">
      <div className="relative flex items-center flex-1 mb-3">
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          className="relative  border-[1px] w-full h-[50px] rounded-xl text-sm pl-10"
          placeholder="Search by address"
        />
        <div className="absolute left-4 z-10">
          <FaSearch size={16} className="text-textSecondary" />
        </div>
      </div>
      <div className="shadow-md rounded-lg">
        <div className="bg-gray-100 p-3 hidden md:block">
          <div className="grid grid-cols-[10%_70%_20%] gap-3">
            <div>
              <p className="text-xs text-gray-500 font-semibold">S.N</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Address</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Amount</p>
            </div>
          </div>
        </div>
        <div className="px-3">
          {stakedUsers
            .filter((val) =>
              String(val[0]).toLowerCase().includes(search.toLowerCase()),
            )
            .map((user, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-[10%_70%_20%] gap-3 items-center py-3 border-b ${
                  index === stakedUsers.length - 1 ? "border-0" : ""
                }`}
              >
                <div className="text-sm text-gray-800">
                  <span className="md:hidden font-semibold">S.N.&ensp;</span>
                  {index + 1}
                  </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex items-center">
                    <span className="md:hidden font-semibold">Address&ensp;</span>
                    {user[0]}
                  
                </div>
                </div>
                <div className="">
                  <p className="text-sm text-gray-800 text-left">
                  <span className="md:hidden font-semibold">Amount&ensp;</span>
                    {formatTokenPrice({ amount: user[1] })} COMAI
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default StakedUsersTable
