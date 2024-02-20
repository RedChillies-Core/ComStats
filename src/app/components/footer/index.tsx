import React from "react"

interface FooterProps {
  copyrightText: string
}

const Footer: React.FC<FooterProps> = ({ copyrightText }) => {
  return (
    <footer className="bg-button text-white py-4 px-8">
      <div className="flex gap-2 justify-center flex-row items-center">
        {copyrightText}

        <a
          href="https://twitter.com/comstatsorg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
        >
          <img src="/twitter.svg" alt="Twitter" className="w-6 h-6" />
        </a>

        <a
          href="https://www.communeai.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
        >
          <img src="/web.svg" alt="CommuneAI" className="w-6 h-6" />
        </a>
      </div>
    </footer>
  )
}

export default Footer
