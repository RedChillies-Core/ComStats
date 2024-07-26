import { InterfacePagination, SubnetInterface, ValidatorType } from "@/types"
import React from "react"
import Verified from "../verified"
import ReactPaginate from "react-paginate"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { formatTokenPrice } from "@/utils"
import { numberWithCommas } from "@/utils/numberWithCommas"
import Link from "next/link"
import Skeleton from "react-loading-skeleton"
import Button from "../button"

const SubnetValidatorTable = ({
  validators,
  handlePageClick,
  isLoading,
}: {
  isLoading: boolean
  handlePageClick: (event: { selected: number }) => void
  validators?: InterfacePagination<ValidatorType[]>
}) => {
  return (
    <div className="mt-3 sm:px-0 px-2">
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
                Total Stakers
              </th>
              <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Total Stake
              </th>
              <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Emission <br />
                (100 Blocks)
              </th>
              <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Net APY
              </th>
              <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Fee
              </th>
              <th className="px-2 bg-gray-100 text-gray-500 align-middle border border-solid border-blueGray-100 py-3 text-[14px] uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Action
              </th>
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
                        {validator.key}
                      </p>
                    </div>
                  </td>
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 ">
                    {validator.total_stakers}
                  </td>
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 ">
                    {numberWithCommas(
                      formatTokenPrice({ amount: validator.stake })
                    )}
                  </td>
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 ">
                    {numberWithCommas(
                      formatTokenPrice({ amount: validator.emission })
                    )}
                  </td>
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 ">
                    {validator.apy.toFixed(2)}%
                  </td>
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 ">
                    {Number(validator.delegation_fee.toFixed(2))}%
                  </td>
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 ">
                    <Link
                      href={`/validator/${validator.key}`}
                      className="flex items-center gap-x-1 "
                    >
                      <Button size="small" variant="outlined">
                        Delegate
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!isLoading && validators?.total !== validators?.validators.length && (
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

export default SubnetValidatorTable
