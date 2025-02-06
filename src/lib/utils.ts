import { formatUnits, parseUnits } from "viem"

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export interface ApplicationError extends Error {
  info: string
  status: number
}

export const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as ApplicationError

    error.info = await res.json()
    error.status = res.status

    throw error
  }

  return res.json()
}

export function timeAgo(timestamp: number) {
  const now = Date.now()
  const diffInSeconds = Math.floor((now - timestamp) / 1000)

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  }

  for (const interval in intervals) {
    const seconds = intervals[interval]
    const count = Math.floor(diffInSeconds / seconds)

    if (count >= 1) {
      return `${count} ${interval}${count > 1 ? "s" : ""} ago`
    }
  }

  return "Just now"
}

export const ETH_UNIT_DECIMALS = {
  wei: 0,
  gwei: 9,
  ether: 18,
} as const

export type EthUnit = keyof typeof ETH_UNIT_DECIMALS

export function transformEthUnit(value: string, from: EthUnit, to: EthUnit) {
  const valueInWei = parseUnits(value, ETH_UNIT_DECIMALS[from])
  return formatUnits(valueInWei, ETH_UNIT_DECIMALS[to])
}
