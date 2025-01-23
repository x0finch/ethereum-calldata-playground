import useSWR from "swr"
import { ParsedFunction } from "./parsed-function"
import { METHOD_ID_LENGTH } from "@/lib/parse-calldata"
import { fetcher } from "@/lib/utils"
import { useMemo } from "react"
import {
  Abi,
  AbiFunction,
  AbiParameter,
  decodeFunctionData,
  getAbiItem,
  Hex,
  parseAbi,
} from "viem"
import { ParsingSkeleton } from "./parsing-skeleton"

interface ContinueParsingProps {
  data: string
  onDataChnage: (data: string) => void
}

export function ContinueParsing({ data, onDataChnage }: ContinueParsingProps) {
  const signature = data.slice(0, METHOD_ID_LENGTH)

  const { data: functions, isLoading } = useSWR<string[]>(
    `/api/signatures/${signature}`,
    fetcher
  )

  const parsedData = useMemo(
    () => parseCallData(data, functions),
    [data, functions]
  )

  if (isLoading) {
    return <ParsingSkeleton />
  }

  if (!functions?.length || !parsedData) {
    return null
  }

  return <ParsedFunction {...parsedData} />
}

function parseCallData(data: string, functions: string[] | undefined) {
  if (!functions?.length) {
    return null
  }

  const firstFunction = `function ${functions[0]}`
  const abi = parseAbi([firstFunction]) as Abi[]
  const parsed = decodeFunctionData({ abi, data: data as Hex })
  const abiItem = getAbiItem({ abi, name: parsed.functionName }) as AbiFunction

  return {
    name: parsed.functionName,
    params: abiItem.inputs.map(
      ({ name: nameOrEmpty, type, ...rest }, index) => {
        const name = nameOrEmpty ?? `${index}`
        const value = parsed.args?.[index]

        if (!Array.isArray(value)) {
          return { name, type, value: `${value}` }
        }

        return {
          name,
          type,
          value: "",
          children: value.map((v, index) => {
            const subType = type.startsWith("tuple")
              ? ((rest as any)["components"] as AbiParameter[])[index].type
              : type.replace("[]", "")
            const maybeIsFunction =
              subType === "bytes" &&
              typeof v === "string" &&
              v.startsWith("0x") &&
              v.length >= METHOD_ID_LENGTH
            const value = `${v}`

            return {
              name: `${index}`,
              type: subType,
              value,
              children: maybeIsFunction ? (
                <ContinueParsing data={value} onDataChnage={console.log} />
              ) : null,
            }
          }),
        }
      }
    ),
  }
}
