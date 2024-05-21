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
    ValidatorFilterType.ALL,
  )
  const {
    data: paginatedValidator,
    isLoading: fetchLoading,
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

  function toggleAccordion(item: string): void {
    const content = document.getElementById(`content-${item}`)
    if (content) {
      if (content.classList.contains("hidden")) {
        content.classList.remove("hidden")
      } else {
        content.classList.add("hidden")
      }
    }
  }
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
    <>
      <div className="mb-5 flex gap-x-5 py-3 flex-col md:flex-row">
        {options.map((opt) => (
          <button
            key={opt.value}
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
      <div className="shadow-2xl px-6  rounded-3xl pt-3">
        <table className="hidden md:table border-separate w-full border-spacing-0">
          <thead>
            <tr className="uppercase text-[10px]  text-left font-semibold bottom-shadow">
              <th className="py-2 w-[5%]">SN</th>
              <th className="w-[30%]">Modules</th>
              <th className="w-[5%]">Stakers</th>
              <th className="w-[20%]">Total Stake</th>
              <th className="w-[10%]">Emission</th>
              <th className="w-[10%]">Net APY</th>
              <th className="w-[10%]">Fee</th>
              <th className="w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {fetchLoading &&
              new Array(10).fill(0).map((_, index) => (
                <tr key={index}>
                  <td className="py-6 pl-3 mx-3">
                    <Skeleton className="w-[10]" />
                  </td>
                  <td>
                    <Skeleton className="w-[40px]" />
                  </td>
                  <td>
                    <Skeleton className="w-[30px]" />
                  </td>
                  <td>
                    <Skeleton className="w-[20px]" />
                  </td>

                  <td>
                    <Skeleton className="w-[10px]" />
                  </td>
                  <td>
                    <Skeleton className="w-[10px]" />
                  </td>
                  <td>
                    <Skeleton className="w-[20px]" />
                  </td>
                </tr>
              ))}
            {!fetchLoading &&
              validatorData &&
              validatorData.map((validator, index, array) => (
                <tr
                  className={`text-sm font-medium   ${
                    index === array.length - 1 ? "" : "border-b-2 bottom-shadow"
                  } `}
                  key={validator.key}
                >
                  <td className="py-3 pl-3">{index + 1 + (page - 1) * 50}</td>
                  <td>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div className="text-md font-bold truncate  max-w-[200px]">
                          {validator.name}
                        </div>
                        {(validator.verified_type === "golden" ||
                          validator.verified_type === "verified") && (
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
                  <td>{numberWithCommas(validator.total_stakers)}</td>
                  <td>
                    {numberWithCommas(
                      formatTokenPrice({ amount: validator.stake }),
                    )}{" "}
                    COMAI
                  </td>

                  <td>
                    {numberWithCommas(
                      formatTokenPrice({
                        amount: Number(validator.emission),
                      }),
                    )}
                  </td>
                  <td>
                    {validator?.type === "miner"
                      ? "-"
                      : `${Number(validator.apy.toFixed(2))}%`}
                  </td>
                  <td>
                    {Number((validator?.delegation_fee ?? 0).toFixed(2))}%
                  </td>
                  <td>
                    <Link
                      href={`/validator/${validator.subnet_id}/${validator.key}`}
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

        <div className="md:hidden">
          {validatorData?.map((validator, index, array) => (
            <div
              key={validator.key}
              className={`py-4  overflow-scroll hide-scrollbar ${
                index === array.length - 1 ? "" : "border-b-2"
              }`}
              onClick={() => toggleAccordion(validator.name)}
            >
              <div className="flex justify-between items-center cursor-pointer">
                <div className="flex gap-1 items-center">
                  <div className="truncate max-w-[200px]">{validator.name}</div>
                  {(validator.verified_type === "golden" ||
                    validator.verified_type === "verified") && (
                    <Verified
                      isGold={validator.verified_type === "golden"}
                      isOfComStats={validator?.expire_at === -1}
                    />
                  )}
                </div>
                <div>+</div>
              </div>
              <div id={`content-${validator.name}`} className="hidden">
                <div className="py-2 flex flex-col ">
                  <div className="w-[200px] truncate">
                    <strong>Name:</strong> {validator.name}
                  </div>
                  <span className="text-[10px] text-textSecondary">
                    {validator.key}
                  </span>
                </div>
                <div className="py-2">
                  <strong>Stake:</strong>{" "}
                  {formatTokenPrice({ amount: validator.stake })} COM
                </div>
                <div className="py-2">
                  <strong>APY: </strong>
                  {validator.type === "miner"
                    ? "-"
                    : `${Number(validator.apy.toFixed(2))}%`}
                </div>
                <div className="py-2">
                  <strong>Fee:</strong>{" "}
                  {Number(validator.delegation_fee.toFixed(2))}%
                </div>
                <div className="py-2">
                  <Link
                    href={`/validator/${validator.subnet_id}/${validator.key}`}
                    className="flex items-center gap-x-1 underline"
                  >
                    View More{" "}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      </div>
    </>
  )
}

export default ValidatorTable
