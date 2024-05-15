"use client";
import { useGetValidatorsQuery } from "@/store/api/statsApi";
import React, { useEffect, useMemo, useState } from "react";
import Verified from "../verified";
import { numberWithCommas } from "@/utils/numberWithCommas";
import { formatTokenPrice } from "@/utils";
import Link from "next/link";
import Button from "../button";
import { FaSearch } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { ValidatorType } from "@/types";

enum ValidatorFilterType {
  ALL,
  MINERS,
  VALIDATORS,
}
const ValidatorTable = () => {
  const { data: allValidatorsData, isLoading: fetchLoading } =
    useGetValidatorsQuery(undefined, {
      pollingInterval: 300000,
    });

  const [validatorFilter, setValidatorFilter] = useState<ValidatorFilterType>(
    ValidatorFilterType.ALL
  );
  const [validatorData, setValidatorData] = useState<ValidatorType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  function toggleAccordion(item: string): void {
    const content = document.getElementById(`content-${item}`);
    if (content) {
      if (content.classList.contains("hidden")) {
        content.classList.remove("hidden");
      } else {
        content.classList.add("hidden");
      }
    }
  }
  const [search, setSearch] = useState("");
  const options = [
    { value: ValidatorFilterType.ALL, label: "All" },
    { value: ValidatorFilterType.MINERS, label: "Miners" },
    { value: ValidatorFilterType.VALIDATORS, label: "Validators" },
  ];

  useEffect(()=> {
    if (allValidatorsData) {
      setIsLoading(true);
      setValidatorData([]);

      setTimeout(() => {
        setValidatorData(
          allValidatorsData
          ?.filter((val) =>
            String(val.key)
              .toLowerCase()
              .includes(search.toLowerCase()) || val.name.toLowerCase().includes(search.toLowerCase())
          )
          ?.filter((val) => {
            if (validatorFilter === ValidatorFilterType.ALL) {
              return val;
            } else if (validatorFilter === ValidatorFilterType.MINERS) {
              return val.type === "miner";
            } else {
              return val.type === "validator";
            }
          })
        );
        setIsLoading(false);
      }, 2000);
    }
  }, [
    allValidatorsData,
    fetchLoading,
    validatorFilter,
    search,
  ])

  const validatorLoading = useMemo(() => {
    return fetchLoading || isLoading;
  }, [isLoading, fetchLoading])

  return (
    <>
      <div className="mb-5 flex gap-x-5 py-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setValidatorFilter(opt.value)}
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
            onChange={(e) => setSearch(e.target.value)}
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
            <tr className="uppercase text-xs  text-left font-semibold bottom-shadow">
              <th className="py-4 pl-3">S.N</th>
              <th>Modules</th>
              <th>Stakers</th>
              <th>Stake</th>
              <th>EMISSION (COMAI per 100 blocks)</th>
              <th>Net APY</th>
              <th>Fee</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {validatorLoading &&
              new Array(10).fill(0).map((_, index) => (
                <tr key={index}>
                  <td className="py-6 pl-3 mx-3">
                    <Skeleton className="w-[40px]" />
                  </td>
                  <td>
                    <div className="">
                      <Skeleton className="w-[100px]" />
                    </div>
                  </td>
                  <td>
                    <Skeleton className="w-[40px]" />
                  </td>
                  <td>
                    <Skeleton className="w-[50px]" />
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
            {!validatorLoading &&
              validatorData &&
              validatorData
              //  ?.sort((a, b) => {
              //   return a.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR ? -1 : 1;
              //  })
                
                 ?.sort((a, b) => {
              return a.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR ? -1 : 1;
             })
                .sort((a, b) => {
                  //
                  if (a.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR) {
                    return -1;
                  } else if (
                    a.verified_type === "golden" &&
                    b.verified_type === "golden"
                  ) {
                    if (a.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR) {
                      return -1;
                    } else if (
                      b.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR
                    ) {
                      return 1;
                    } else if (a.stake > b.stake) {
                      return -1;
                    } else if (a.stake < b.stake) {
                      return 1;
                    }
                  } else if (
                    a.isVerified &&
                    a.verified_type === "golden" &&
                    b.isVerified
                  ) {
                    return -1;
                  } else if (
                    b.isVerified &&
                    b.verified_type === "golden" &&
                    a.isVerified
                  ) {
                    return 1;
                  } else if (
                    a.isVerified &&
                    a.verified_type === "golden" &&
                    !b.isVerified
                  ) {
                    return -1;
                  } else if (
                    b.isVerified &&
                    b.verified_type === "golden" &&
                    !a.isVerified
                  ) {
                    return 1;
                  } else if (a.isVerified && b.isVerified) {
                    if (a.stake > b.stake) {
                      return -1;
                    } else if (a.stake < b.stake) {
                      return 1;
                    }
                  } else if (a.isVerified && !b.isVerified) {
                    return -1;
                  } else if (!a.isVerified && b.isVerified) {
                    return 1;
                  } else if (a.stake > b.stake) {
                    return -1;
                  } else if (a.stake < b.stake) {
                    return 1;
                  }
                  return 0;
                })
                .map((validator, index, array) => (
                  <tr
                    className={`text-sm font-medium   ${
                      index === array.length - 1
                        ? ""
                        : "border-b-2 bottom-shadow"
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
                        formatTokenPrice({ amount: validator.stake })
                      )}{" "}
                      COMAI
                    </td>

                    <td>
                      {numberWithCommas(
                        formatTokenPrice({
                          amount: Number(validator.emission),
                        })
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
          {validatorData
            //  ?.sort((a, b) => {
            //   return a.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR ? -1 : 1;
            //  })
             ?.sort((a, b) => {
              return a.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR ? -1 : 1;
             })
            .sort((a, b) => {
              //
              if (a.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR) {
                return -1;
              } else if (
                a.verified_type === "golden" &&
                b.verified_type === "golden"
              ) {
                if (a.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR) {
                  return -1;
                } else if (
                  b.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR
                ) {
                  return 1;
                } else if (a.stake > b.stake) {
                  return -1;
                } else if (a.stake < b.stake) {
                  return 1;
                }
              } else if (
                a.isVerified &&
                a.verified_type === "golden" &&
                b.isVerified
              ) {
                return -1;
              } else if (
                b.isVerified &&
                b.verified_type === "golden" &&
                a.isVerified
              ) {
                return 1;
              } else if (
                a.isVerified &&
                a.verified_type === "golden" &&
                !b.isVerified
              ) {
                return -1;
              } else if (
                b.isVerified &&
                b.verified_type === "golden" &&
                !a.isVerified
              ) {
                return 1;
              } else if (a.isVerified && b.isVerified) {
                if (a.stake > b.stake) {
                  return -1;
                } else if (a.stake < b.stake) {
                  return 1;
                }
              } else if (a.isVerified && !b.isVerified) {
                return -1;
              } else if (!a.isVerified && b.isVerified) {
                return 1;
              } else if (a.stake > b.stake) {
                return -1;
              } else if (a.stake < b.stake) {
                return 1;
              }
              return 0;
            })
            .map((validator, index, array) => (
              <div
                key={validator.key}
                className={`py-4 ${
                  index === array.length - 1 ? "" : "border-b-2"
                }`}
                onClick={() => toggleAccordion(validator.name)}
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex gap-1 items-center">
                    <div className="truncate max-w-[200px]">
                      {validator.name}
                    </div>
                    {validator.isVerified && (
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
      </div>
    </>
  );
};

export default ValidatorTable;
