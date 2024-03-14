"use client"
import { useGetValidatorsQuery } from "@/store/api/statsApi"
import React from "react"
import Verified from "../verified"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { formatTokenPrice } from "@/utils"
import Link from "next/link"
import { FaAngleRight, FaSpinner } from "react-icons/fa6"
import Button from "../button"

const ValidatorTable = () => {
  const { data: validatorData, isLoading: validatorLoading } =
    useGetValidatorsQuery(undefined, {
      pollingInterval: 300000,
    })
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
  return (
    <div className="shadow-2xl px-6 py-3 rounded-3xl mt-6">
      <table className="hidden md:table border-separate w-full border-spacing-0">
        <thead>
          <tr className="uppercase text-xs  text-left font-semibold bottom-shadow">
            <th className="py-4 pl-3">S.N</th>
            <th>Modules</th>
            <th>Stakers</th>
            <th>Stake</th>
            <th>APY</th>
            <th>Fee</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {validatorData &&
            validatorData?.map((validator, index, array) => (
              <tr
                className={`text-sm font-medium   ${
                  index === array.length - 1 ? "" : "border-b-2 bottom-shadow"
                } `}
                key={validator.key}
              >
                <td className="py-6 pl-3">{index + 1}</td>
                <td>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <div className="text-md font-bold truncate  max-w-[200px]">
                        {validator.name}
                      </div>
                      {validator.isVerified && (
                        <Verified
                          isGold={
                            validator.key ===
                            process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR
                          }
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

                <td>{Number(validator.apy.toFixed(2))}%</td>
                <td>{Number((validator?.delegation_fee ?? 0).toFixed(2))}%</td>
                <td>
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
      {validatorLoading && <FaSpinner className="spinner my-6 mx-auto" />}
      <div className="md:hidden">
        {validatorData?.map((validator, index, array) => (
          <div
            key={validator.key}
            className={`py-4 ${index === array.length - 1 ? "" : "border-b-2"}`}
            onClick={() => toggleAccordion(validator.name)}
          >
            <div className="flex justify-between items-center cursor-pointer">
              <div className="flex gap-1 items-center">
                <div className="truncate max-w-[200px]">{validator.name}</div>
                {validator.isVerified && (
                  <Verified
                    isGold={
                      validator.key ===
                      process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR
                    }
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
                {Number(validator.apy.toFixed(2))}%
              </div>
              <div className="py-2">
                <strong>Fee:</strong>{" "}
                {Number(validator.delegation_fee.toFixed(2))}%
              </div>
              <div className="py-2">
                <Link
                  href={`/validator/${validator.key}`}
                  className="flex items-center gap-x-1 underline"
                >
                  View More{" "}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ValidatorTable
