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

interface ContinueParsingProps {
  data: string
  onDataChnage: (data: string) => void
}

export function ContinueParsing({ data, onDataChnage }: ContinueParsingProps) {
  const signature = data.slice(0, METHOD_ID_LENGTH)

  const { data: functions, isLoading: isFetching } = useSWR<string[]>(
    `/api/signatures/${signature}`,
    fetcher
  )

  const parsedData = useMemo(
    () => parseData(data, functions),
    [data, functions]
  )

  const isLoading = isFetching
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!functions?.length || !parsedData) {
    return null
  }

  return <ParsedFunction {...parsedData} />

  return (
    <ParsedFunction
      name="mint"
      params={[
        {
          name: "0",
          value: "",
          type: "tuple",
          children: [
            {
              name: "to",
              type: "address",
              value: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            },
            {
              name: "tokenId",
              type: "uint256",
              value: "1",
            },
            {
              name: "data",
              type: "bytes",
              value: "0x",
            },
            {
              name: "operator",
              type: "address",
              value: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            },
          ],
        },
      ]}
    />
  )
}

function parseData(data: string, functions: string[] | undefined) {
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
