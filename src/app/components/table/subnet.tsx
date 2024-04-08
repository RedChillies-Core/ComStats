import { SubnetInterface, ValidatorType } from "@/types"
import React from "react"
import Verified from "../verified"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { formatTokenPrice } from "@/utils"
import Link from "next/link"
import Button from "../button"
import Skeleton from "react-loading-skeleton"

const SubnetTable = ({
  subnet,
  isLoading,
}: {
  subnet: ValidatorType[]
  isLoading: boolean
}) => {
  return (
    <div className="max-w-full overflow-x-hidden">
      <div className="shadow-md rounded-lg">
        <div className="bg-gray-100 p-3 hidden md:block">
          <div className="grid grid-cols-[5%_30%_15%_20%_10%_20%] gap-3">
            <div>
              <p className="text-xs text-gray-500 font-semibold">S.N</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Validator</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">
                Total Stakers
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Total Stake</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Net APY</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Action</p>
            </div>
          </div>
        </div>
        <div className="p-3">
          {isLoading &&
            new Array(10).fill(0).map((_, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-[5%_30%_15%_20%_10%_20%] gap-3 items-center py-3 border-b ${
                  index === subnet.length - 1 ? "border-0" : ""
                }`}
              >
                <div className="text-sm text-gray-800">
                  <Skeleton />
                </div>
                <div className=" ">
                  <Skeleton />
                </div>
                <div className="">
                  <p className="text-sm text-gray-800">
                    <Skeleton />
                  </p>
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
            subnet.map((validator, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-[5%_30%_15%_20%_10%_20%] gap-3 items-center py-3 border-b ${
                  index === subnet.length - 1 ? "border-0" : ""
                }`}
              >
                <div className="text-sm text-gray-800">{index + 1}</div>
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div className="text-md font-bold truncate  max-w-[200px]">
                          {validator.name}
                        </div>
                        {validator.isVerified && (
                          <Verified
                            isGold={
                              validator.verified_type === "golden"
                            }
                            isOfComStats={
                              validator?.expire_at === -1
                            }
                          />
                        )}
                      </div>
                      <p className="text-[10px] text-textSecondary">
                        {validator.key}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="">
                  <p className="text-sm text-gray-800">
                    {numberWithCommas(validator.total_stakers)}
                  </p>
                </div>
                <div className="">
                  <p className="text-sm">
                    {" "}
                    {numberWithCommas(
                      formatTokenPrice({ amount: validator.stake }),
                    )}{" "}
                    COMAI
                  </p>
                </div>
                <div className="">{Number(validator.apy.toFixed(2))}%</div>
                <div className="">
                  <Link
                    href={`/validator/${validator.key}`}
                    className="flex items-center gap-x-1 "
                  >
                    <Button size="small" variant="outlined">
                      Delegate
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default SubnetTable
