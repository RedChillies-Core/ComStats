import React, { useEffect, useState } from "react"
import { AiFillWallet, AiOutlineSwap } from "react-icons/ai"
import Button from "../button"
import Image from "next/image"
import { usePolkadot } from "@/context"
import { truncateWalletAddress } from "@/utils"

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
    <div
      className={`px-3 sticky top-0 z-50 transition-all duration-100 ease-in-out ${
        isScrolled ? "bg-white shadow-xl" : "bg-transparent"
      } sm:px-0`}
    >
      <div className="container flex justify-between items-center py-3">
        <div>
          {isScrolled ? (
            <button onClick={scrollToTop} className="cursor-pointer">
              <Image
                alt="blockchain"
                src="/Animated1.gif"
                height={50}
                width={50}
              />
            </button>
          ) : (
            <AiOutlineSwap size={26} />
          )}
        </div>
        {!isInitialized && <p>Initializing Wallet</p>}
        {isInitialized && (
          <div>
            {selectedAccount ? (
              <div className="relative flex items-center bg-white rounded-full shadow px-4 py-2">
                <button className="flex items-center cursor-pointer">
                  <AiFillWallet size={24} className="text-purple" />
                  <span className="ml-2 font-mono">
                    {truncateWalletAddress(selectedAccount.address)}
                  </span>
                </button>
              </div>
            ) : (
              <Button size="large" variant="primary" onClick={handleConnect}>
                <AiFillWallet size={18} />
                Connect Wallet
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
