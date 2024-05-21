export function truncateWalletAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4,
): string {
  // Check if the address length is greater than the sum of startLength and endLength
  if (address.length > startLength + endLength) {
    // Extract the beginning and end of the address
    const start = address.slice(0, startLength)
    const end = address.slice(-endLength)
    // Return the truncated address
    return `${start}...${end}`
  }
  // If the address is not long enough to truncate, return it as is
  return address
}

export function formatTokenPrice({
  amount,
  precision = 2,
}: {
  amount: number
  precision?: number
}) {
  return Number(
    (amount > 0 ? amount / Math.pow(10, 9) : 0).toFixed(precision),
  ).toString()
}
// k if 1000
// M if 1000000
// B if 1000000000
// T if 1000000000000
// Q if 1000000000000000
// P if 1000000000000000000
// E if 1000000000000000000000
// Z if 1000000000000000000000000
// Y if 1000000000000000000000000000
// R if 1000000000000000000000000000000

export function convertNumberToLetter(num: number): number | string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2).replace(/\.0$/, "") + "G"
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.0$/, "") + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2).replace(/\.0$/, "") + "K"
  }
  return num
}
