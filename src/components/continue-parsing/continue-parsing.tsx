import {
  parseCallData,
  ParsedCalldata,
  SELECTOR_LENGTH,
} from "@/lib/parse-calldata"
import { fetcher } from "@/lib/utils"
import { isValidElement, useMemo, useState } from "react"
import useSWR from "swr"
import { Abi, encodeFunctionData, parseAbi } from "viem"
import { FunctionDetail, FunctionDetailParam } from "./function-detail"
import { ParsingSkeleton } from "./parsing-skeleton"

interface ContinueParsingProps {
  data: string
  onDataChange: (data: string) => void
}

export function ContinueParsing({
  data: initData,
  onDataChange,
}: ContinueParsingProps) {
  const selector = initData.slice(0, SELECTOR_LENGTH)
  const [data, setData] = useState(initData)

  const { data: functions, isLoading } = useSWR<string[]>(
    `/api/selectors/${selector}`,
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

  const onParamsChange = (params: FunctionDetailParam[]) => {
    function flatValues(params: FunctionDetailParam[]) {
      return params.map((param): any => {
        if (param.children && !isValidElement(param.children)) {
          return flatValues(param.children as FunctionDetailParam[])
        }

        return param.value
      })
    }

    const values = flatValues(params)
    const func = `function ${functions![0]}`
    const abi = parseAbi([func]) as Abi

    const newData = encodeFunctionData({
      abi,
      functionName: selector,
      args: values,
    })

    setData(newData)
    onDataChange(newData)
  }

  const wrappedDetail = useMemo(() => {
    if (!detail) {
      return null
    }

    return {
      ...detail,
      params: wrapParams(detail.params, onParamsChange),
    }
  }, [detail])

  if (isLoading) {
    return <ParsingSkeleton />
  }

  if (!wrappedDetail) {
    return null
  }

  return <FunctionDetail {...wrappedDetail} onParamsChange={onParamsChange} />
}

function wrapParams(
  params: ParsedCalldata["params"],
  onParamsChange: (params: FunctionDetailParam[]) => void
): FunctionDetailParam[] {
  return params.map((param) => {
    if (param.children) {
      const children = wrapParams(param.children, () => onParamsChange(params))
      return { ...param, children }
    }

    const maybeChildIsAlsoFunction =
      param.type === "bytes" &&
      param.value.startsWith("0x") &&
      param.value.length > SELECTOR_LENGTH

    const subSelector = param.value.slice(0, SELECTOR_LENGTH)

    return {
      ...param,
      children: maybeChildIsAlsoFunction ? (
        <ContinueParsing
          key={subSelector}
          data={param.value}
          onDataChange={(data) => {
            param.value = data
            onParamsChange(params)
          }}
        />
      ) : undefined,
    }
  })
}
