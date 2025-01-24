import useSWR from "swr"
import { FunctionDetail, FunctionDetailProps } from "./function-detail"
import {
  METHOD_ID_LENGTH,
  parseCallData,
  ParsedCalldata,
} from "@/lib/parse-calldata"
import { fetcher } from "@/lib/utils"
import { useMemo } from "react"
import { Abi, parseAbi } from "viem"
import { ParsingSkeleton } from "./parsing-skeleton"

interface ContinueParsingProps {
  data: string
}

export function ContinueParsing({ data }: ContinueParsingProps) {
  const signature = data.slice(0, METHOD_ID_LENGTH)

  const { data: functions, isLoading } = useSWR<string[]>(
    `/api/signatures/${signature}`,
    fetcher
  )

  const [detail] = useMemo(() => {
    if (!functions?.length) {
      return [null, null]
    }

    try {
      const func = `function ${functions[0]}`
      const abi = parseAbi([func]) as Abi
      const detail = parseCallData(data, abi)

      return [detail, null]
    } catch (error) {
      return [null, error]
    }
  }, [data, functions])

  const wrappedDetail = useMemo(() => {
    if (!detail) {
      return null
    }

    return {
      ...detail,
      params: detail.params.map(wrapParam),
    }
  }, [detail])

  if (isLoading) {
    return <ParsingSkeleton />
  }

  if (!wrappedDetail) {
    return null
  }

  console.log("wrappedDetail: ", wrappedDetail)

  return <FunctionDetail {...wrappedDetail} />
}

function wrapParam(
  param: ParsedCalldata["params"][0]
): FunctionDetailProps["params"][0] {
  if (param.children) {
    const children = param.children.map(wrapParam)
    return { ...param, children }
  }

  const maybeIsSubCallData =
    param.type === "bytes" &&
    param.value.startsWith("0x") &&
    param.value.length > METHOD_ID_LENGTH

  const children = <ContinueParsing data={param.value} />
  return { ...param, children: maybeIsSubCallData ? children : undefined }
}
