import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        button:
          "linear-gradient(-225deg, #AC32E4 0%, #7918F2 48%, #4801FF 100%)",
      },

      colors: {
        lightBg: "#fafafa",
        secondary: "#ffe9e3",
        ternary: "#c4c1e0",
        purple: "#7918F2",
        textPrimary: "#202223",
        textSecondary: "#6d7175",
        border: "#D5D8DB",
      },
      boxShadow: {
        card: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      },
    },
  },
  plugins: [],
}
export default config
