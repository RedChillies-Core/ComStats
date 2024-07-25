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
    <div className="block w-full overflow-x-auto">
      <table className="items-center bg-transparent w-full border-collapse ">
        <thead>
          <tr>
            <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              Rank
            </th>
            <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              Wallet Address
            </th>
            <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              Balance
            </th>
            <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              Stake
            </th>
            <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              Total Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            new Array(5).fill(0).map((_, index) => (
              <tr key={index}>
                {new Array(5).fill(0).map((_, index) => (
                  <td
                    key={`index${index}`}
                    className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 "
                  >
                    <Skeleton />
                  </td>
                ))}
              </tr>
            ))}
          {!isLoading &&
            users.map((user, index) => (
              <tr
                key={user.address}
                className={`${index === users.length - 1 ? "" : "border-b"}`}
              >
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 ">
                  {index + 1}
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1">
                  {user.address}
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1">
                  {numberWithCommas(formatTokenPrice({ amount: user.balance }))}
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1">
                  {numberWithCommas(formatTokenPrice({ amount: user.stake }))}
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1">
                  {numberWithCommas(formatTokenPrice({ amount: user.total }))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default RichListTable
