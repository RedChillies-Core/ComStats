"use client"
import { statsApi, useGetValidatorsQuery } from "@/store/api/statsApi"
import React, { useEffect, useMemo, useState } from "react"
import Verified from "../verified"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { formatTokenPrice } from "@/utils"
import Link from "next/link"
import Button from "../button"
import { FaSearch } from "react-icons/fa"
import Skeleton from "react-loading-skeleton"
import ReactPaginate from "react-paginate"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"

enum ValidatorFilterType {
  ALL = "all",
  MINERS = "miner",
  VALIDATORS = "validator",
}
const ValidatorTable = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [validatorFilter, setValidatorFilter] = useState<ValidatorFilterType>(
    ValidatorFilterType.ALL
  )
  const {
    data: paginatedValidator,
    isLoading,
    refetch,
  } = useGetValidatorsQuery({
    page: page,
    search: search,
    type: String(validatorFilter),
  })
  const handlePageClick = (event: { selected: any }) => {
    setPage(Number(event.selected + 1))
    refetch()
  }
  const validatorData = paginatedValidator?.validators

  const options = [
    { value: ValidatorFilterType.ALL, label: "All" },
    { value: ValidatorFilterType.MINERS, label: "Miners" },
    { value: ValidatorFilterType.VALIDATORS, label: "Validators" },
  ]
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setTimeout(() => {
      refetch()
    }, 500)
  }

  return (
    <div className="sm:px-0 px-8">
      <div className="mb-5 flex gap-x-5 py-3 overflow-auto">
        {options.map((opt) => (
          <button
            key={`btn-${opt.value}`}
            onClick={() => {
              setValidatorFilter(opt.value)
              refetch()
            }}
            className={`
            px-3 py-1
              ${
                validatorFilter === opt.value
                  ? "px-6 rounded-3xl bg-purple text-white"
                  : ""
              }`}
          >
            {opt.label}
          </button>
        ))}{" "}
      </div>
      <div className="mb-5 flex gap-x-5 sm:px-5">
        <div className="relative flex items-center flex-1">
          <input
            type="text"
            onChange={(e) => handleSearch(e)}
            className="relative  border-[1px] w-full h-[50px] rounded-xl text-sm pl-10"
            placeholder="Search by address"
          />
          <div className="absolute left-4 z-10">
            <FaSearch size={16} className="text-textSecondary" />
          </div>
        </div>
      </div>
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
                validatorData?.map((validator, index) => (
                  <tr
                    key={validator.key}
                    className={`${
                      index === validatorData.length - 1 ? "" : "border-b"
                    }`}
                  >
                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-[14px] whitespace-nowrap py-1 text-left text-blueGray-700 ">
                      {index + 1}
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
                      {Number(validator.apy.toFixed(2))}%
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
        {!isLoading && paginatedValidator?.total !== validatorData?.length && (
          <div className="flex py-5 justify-center text-textPrimary">
            <ReactPaginate
              breakLabel="...."
              nextLabel={<FaAngleRight />}
              className="gap-x-5 p-2 flex justify-center items-center flex-wrap"
              pageClassName="py-2 md:py-0"
              onPageChange={handlePageClick}
              activeClassName="bg-purple text-white p-2 px-3 rounded-xl"
              pageRangeDisplayed={5}
              pageCount={
                Number(paginatedValidator?.total) /
                Number(paginatedValidator?.limit)
              }
              previousLabel={<FaAngleLeft />}
              renderOnZeroPageCount={null}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ValidatorTable
