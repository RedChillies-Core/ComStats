"use client"

import React, { Fragment, useEffect, useState } from "react"
import { AiFillWallet, AiOutlineTransaction } from "react-icons/ai"
import Button from "../button"
import Image from "next/image"
import { usePolkadot } from "@/context"
import { truncateWalletAddress } from "@/utils"
import { FaBars, FaSpinner } from "react-icons/fa6"
import { GrDashboard } from "react-icons/gr"
import Link from "next/link"
import { FaCubesStacked } from "react-icons/fa6"
import { FaTimes, FaVoteYea } from "react-icons/fa"
import { CiCoins1 } from "react-icons/ci"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className="relative top-0 z-40 px-3 py-0 bg-white shadow-sm transition-all duration-100 ease-in-out sm:px-5">
      <div className="container flex items-center justify-between py-3">
        <Link href="/">
          <div>
            <Image
              alt="blockchain"
              src="/comstats.webp"
              height={50}
              width={50}
            />
          </div>
        </Link>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div
          className={`md:flex items-center gap-x-2 ${
            menuOpen
              ? "block absolute top-16 left-0 bg-gray-100 w-screen"
              : "hidden"
          } md:block`}
        >
          <a
            href="https://comsolbridge.com"
            target="_blank"
            className="text-base mx-3 font-medium flex items-center gap-x-2 cursor-pointer relative my-2 md:my-0"
          >
            <AiOutlineTransaction /> Comsol Bridge
          </a>
          <Link
            href="/subnets"
            className="text-base mx-3 font-medium flex items-center gap-x-2 cursor-pointer relative my-2 md:my-0"
          >
            <FaCubesStacked /> Subnets
          </Link>
          {isInitialized && selectedAccount ? (
            <Fragment>
              <Link
                href="/vote"
                className="  text-base mx-3 font-medium flex items-center gap-x-2 cursor-pointer relative my-2 md:my-0"
              >
                <FaVoteYea /> Voting{" "}
              </Link>
              <Link
                href="/portfolio"
                className="text-base mx-3 font-medium flex items-center gap-x-2 cursor-pointer relative my-2 md:my-0"
              >
                <GrDashboard /> Portfolio
              </Link>
              <Link
                href="/rich-list"
                className="text-base mx-3 font-medium flex items-center gap-x-2 cursor-pointer relative my-2 md:my-0"
              >
                <CiCoins1 /> Rich List
              </Link>
              <div className="relative flex items-center bg-white rounded-full shadow px-4 py-2 my-2 md:my-0">
                <button
                  className="flex items-center cursor-pointer"
                  onClick={handleConnect}
                >
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
                className="my-2 md:my-0"
              >
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
