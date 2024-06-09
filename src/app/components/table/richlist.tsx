import { RichListType } from "@/types"
import React from "react"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { formatTokenPrice } from "@/utils"
import Skeleton from "react-loading-skeleton"

const RichListTable = ({
  users,
  isLoading,
}: {
  users: RichListType[] | []
  isLoading: boolean
}) => {
  return (
    <div className="max-w-full overflow-x-hidden mt-3 mb-8">
      <div className="shadow-md rounded-lg">
        <div className="bg-gray-100 p-3 hidden md:block !uppercase">
          <div className="grid grid-cols-[5%_30%_15%_15%_15%] gap-3">
            <div>
              <p className="text-xs text-gray-500 font-semibold">Rank</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Wallet Address</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">
                Balance
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Stake</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">
                Total Balance
              </p>
            </div>
          </div>
        </div>
        <div className="">
          {isLoading &&
            new Array(10).fill(0).map((_, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-[5%_30%_15%_15%_15%] gap-3 items-center p-3 border-b ${
                  index === users.length - 1 ? "border-0" : ""
                }`}
              >
                <div className="text-sm text-gray-800">
                  <Skeleton />
                </div>
                <div className=" ">
                  <Skeleton />
                </div>
            
                <div className="">
                  <p className="text-sm">
                    <Skeleton />
                  </p>
                </div>
                <div className="">
                  {" "}
                  <Skeleton />
                </div>
                <div className="">
                  <Skeleton />
                </div>
              </div>
            ))}
          {!isLoading &&
            users.map((user, index) => (
              <div
                key={index}
                className={`grid grid-cols-1  md:grid-cols-[5%_30%_15%_15%_15%] gap-3 items-center py-1 px-3 border-b ${
                  index === users.length - 1 ? "border-0" : ""
                } hover:bg-gray-100 hover:cursor-pointer`}
              >
                <div className="text-sm text-gray-800">{user.rank}</div>
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        {/* <div className="text-md font-bold truncate  max-w-[200px]">
                          {user.address}
                        </div> */}
                        {/* {validator.isVerified && (
                          <Verified
                            isGold={validator.verified_type === "golden"}
                            isOfComStats={validator?.expire_at === -1}
                          />
                        )} */}
                      </div>
                      <p className="text-[10px] text-textSecondary">
                        {user.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="">
                  <p className="text-sm text-gray-800">
                    {numberWithCommas(formatTokenPrice({ amount: user.balance }))}
                  </p>
                </div>
                <div className="">
                  <p className="text-sm">
                    {" "}
                    {numberWithCommas(
                      formatTokenPrice({ amount: user.stake}),
                    )}{" "}
                  </p>
                </div>
                <div className="">
                  {numberWithCommas(
                    formatTokenPrice({
                      amount: user.total,
                    }),
                  )}
                </div>
               
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default RichListTable
