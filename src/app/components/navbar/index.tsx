"use client"

import React, { Fragment, useEffect, useState } from "react"
import { AiFillWallet, AiOutlineSwap } from "react-icons/ai"
import Button from "../button"
import Image from "next/image"
import { usePolkadot } from "@/context"
import { truncateWalletAddress } from "@/utils"
import { FaSpinner } from "react-icons/fa6"
import { GrDashboard } from "react-icons/gr"
import Link from "next/link"
import { FaCubesStacked } from "react-icons/fa6"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { isInitialized, handleConnect, selectedAccount } = usePolkadot()
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="px-3 sticky z-10 top-0  transition-all duration-100 ease-in-out py-0 bg-white shadow-sm sm:px-5">
      <div className="container flex justify-between items-center py-3">
        <Link href="/">
          <div>
            <Image
              alt="blockchain"
              src="/Animated1.gif"
              height={50}
              width={50}
            />
          </div>
        </Link>
        <div className="flex items-center gap-x-2">
          <Link href="/subnets">
            <div className="text-base mx-3 font-medium flex items-center gap-x-2 cursor-pointer relative">
              <FaCubesStacked /> Subnets
            </div>
          </Link>
          {isInitialized && selectedAccount ? (
            <Fragment>
              <Link href="/portfolio">
                <div className="text-base mx-3 font-medium flex items-center gap-x-2 cursor-pointer relative">
                  <GrDashboard /> Portfolio
                </div>
              </Link>

              <div className="relative flex items-center bg-white rounded-full shadow px-4 py-2">
                <button className="flex items-center cursor-pointer">
                  <AiFillWallet size={24} className="text-purple" />
                  <span className="ml-2 font-mono">
                    {truncateWalletAddress(selectedAccount.address)}
                  </span>
                </button>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Button
                size="large"
                variant="primary"
                onClick={handleConnect}
                isDisabled={!isInitialized}
              >
                {" "}
                {!isInitialized ? (
                  <FaSpinner className="spinner" />
                ) : (
                  <AiFillWallet size={18} />
                )}
                Connect Wallet
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
