import { InterfacePagination, SubnetInterface, ValidatorType } from "@/types"
import React from "react"
import Verified from "../verified"
import ReactPaginate from "react-paginate"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { formatTokenPrice } from "@/utils"
import { numberWithCommas } from "@/utils/numberWithCommas"
import Link from "next/link"
import Skeleton from "react-loading-skeleton"

const SubnetRootnetTable = ({
  subnets,
  validators,
  handlePageClick,
  isLoading,
}: {
  subnets: SubnetInterface[]
  isLoading: boolean
  handlePageClick: (event: { selected: number }) => void
  validators?: InterfacePagination<ValidatorType[]>
}) => {
  return (
    <div className="mt-3">
      <div className="block w-full overflow-x-auto">
        <table className="items-center bg-transparent w-full border-collapse ">
          <thead>
            <tr>
              <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                S.N.
              </th>
              <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Validator
              </th>
              <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Stake
              </th>
              {isLoading &&
                Array(7)
                  .fill(0)
                  .map((_, index) => (
                    <th
                      key={index}
                      className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                    >
                      <Skeleton />
                    </th>
                  ))}
              {subnets.map((subnet, index) => (
                <th
                  key={index}
                  className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                >
                  <div className="flex flex-col">
                    <div>SN{subnet.subnet_id}</div>
                    <p className="text-xs text-textSecondary">
                      {Number(subnet?.emission_percent?.toFixed(2))}%
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              new Array(10).fill(0).map((_, index) => (
                <tr key={index}>
                  {new Array(10).fill(0).map((_, index) => (
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
              validators?.validators.map((validator, index) => (
                <tr
                  key={validator.key}
                  className={`${
                    index === validators?.validators.length - 1
                      ? ""
                      : "border-b"
                  }`}
                >
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 ">
                    {(validators.page-1) * validators.limit + index + 1}
                  </td>
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1">
                    <Link
                      href={`/validator/${validator.key}`}
                      className="flex items-center gap-x-1 "
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <div className="text-[14px] font-bold truncate max-w-[200px]">
                            {validator.name}
                          </div>
                          {validator.verified_type !== "unverified" && (
                            <Verified
                              isGold={validator.verified_type === "golden"}
                              isOfComStats={validator?.expire_at === -1}
                            />
                          )}
                        </div>
                        <p className="text-[10px] text-textSecondary">
                          {validator.key.slice(0, 10)}...
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 ">
                    {numberWithCommas(
                      formatTokenPrice({ amount: validator.stake })
                    )}
                  </td>
                  {subnets.map((subnet) => (
                    <td
                      key={`${subnet.subnet_id}-${validator.key}`}
                      className="border-t-0 px-2 align-center border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1"
                    >
                      {Number(
                        (
                          ((Object.fromEntries(validator.weights || [])[
                            subnet.subnet_id
                          ] || 0) *
                            100) /
                          65535
                        ).toFixed(2)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!isLoading && (
        <div className="flex py-5 justify-center text-textPrimary">
          <ReactPaginate
            breakLabel="...."
            nextLabel={<FaAngleRight />}
            className="gap-x-5 p-2 flex justify-center items-center flex-wrap"
            pageClassName="py-2 md:py-0"
            onPageChange={handlePageClick}
            activeClassName="bg-purple text-white p-2 px-3 rounded-xl"
            pageRangeDisplayed={5}
            pageCount={Number(validators?.total) / Number(validators?.limit)}
            previousLabel={<FaAngleLeft />}
            renderOnZeroPageCount={null}
          />
        </div>
      )}
    </div>
  )
}

export default SubnetRootnetTable
