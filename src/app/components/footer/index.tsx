import React from "react"

interface FooterProps {
  copyrightText: string
}

const Footer: React.FC<FooterProps> = ({ copyrightText }) => {
  return (
    <footer className="bg-button text-white py-4 px-8">
      <div className="flex gap-2 justify-center flex-row items-center">
        {copyrightText}
      </div>
    </footer>
  )
}

export default Footer
