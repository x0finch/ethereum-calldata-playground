import { formatAbi } from "abitype"
import { Abi, formatUnits, parseAbi, parseAbiItem, parseUnits } from "viem"

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

export async function fetcher(url: string, options?: RequestInit) {
  const res = await fetch(url, options)

  function formatResponse(res: Response) {
    const isJson = res.headers.get("content-type")?.includes("application/json")
    if (isJson) {
      return res.json()
    }

    return res.text()
  }

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as ApplicationError

    error.info = await formatResponse(res)
    error.status = res.status

    throw error
  }

  return formatResponse(res)
}

export async function serverFetcher(url: string, options?: RequestInit) {
  if (url.startsWith("/")) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    url = `${baseUrl}${url}`
  }

  return fetcher(url, options)
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

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}

const HUMAN_READABLE_ABI_PATTERN = /\b\w+\(.*?\)\s/g

export function parseHumanReadableFunctions(abi: string) {
  const abiWithSpaces = `${abi} `
  const matches = abiWithSpaces.match(HUMAN_READABLE_ABI_PATTERN)

  if (!matches?.length) {
    return []
  }

  return matches
    .map((match) => match.trim())
    .filter((match) => !match.startsWith("event"))
    .map((match) => {
      if (match.startsWith("function")) {
        return match
      }

      return `function ${match}`
    })
}

export async function tryParseJsonlikeAbi(input: string) {
  const trimmedInput = input.trim()
  const isJsonArray = trimmedInput.startsWith("[") && trimmedInput.endsWith("]")
  if (!isJsonArray) {
    return null
  }

  const jsonlikeInput = JSON.parse(trimmedInput)

  if (!Array.isArray(jsonlikeInput)) {
    return null
  }

  const humanReadableAbi = formatAbi(jsonlikeInput)
  if (humanReadableAbi.length <= 0) {
    return null
  }

  return parseAbi(humanReadableAbi) as Abi
}

export async function tryParseHumanReadableAbi(input: string) {
  const functions = parseHumanReadableFunctions(input)

  if (!functions.length) {
    return null
  }

  const settled = await Promise.allSettled(functions.map(parseAbiItem))
  return settled
    .filter((item) => item.status === "fulfilled")
    .map((item) => item.value) as Abi
}
