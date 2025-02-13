import { useHistory } from "@/lib/hooks/use-history"
import {
  parseCallData,
  ParsedCalldata,
  SELECTOR_LENGTH,
} from "@/lib/parse-calldata"
import { fetcher } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { isValidElement, ReactNode, useEffect, useMemo, useState } from "react"
import {
  Abi,
  AbiFunction,
  encodeFunctionData,
  parseAbi,
  toFunctionSelector,
} from "viem"
import { FunctionDetail, FunctionDetailParam } from "./function-detail"
import { ParsingSkeleton } from "./parsing-skeleton"
import { UnwrappedMultiSend } from "./unwrapped-multi-send"

interface ContinueParsingProps {
  historyId: string
  calldata: string
  onCallDataChange?: (calldata: string) => void
  wrapName?: (name: string) => ReactNode
}

export function ContinueParsing({
  historyId,
  calldata: initCalldata,
  onCallDataChange,
  wrapName,
}: ContinueParsingProps) {
  const { history, applySignature } = useHistory()
  const historyItem = history[historyId]

  const [calldata, setCallData] = useState(initCalldata)
  const selector = calldata.slice(0, SELECTOR_LENGTH)
  const existingSignature = historyItem?.signatures[selector]

  const { data: signatures = [], isLoading } = useQuery({
    queryKey: ["selectors", selector],
    queryFn: ({ signal }) => fetcher(`/api/selectors/${selector}`, { signal }),
    enabled: !existingSignature,
  })
  const [selectedSignature, selectedAbi] = useMemo(() => {
    if (!existingSignature && !signatures.length) {
      return []
    }

    for (const signature of [existingSignature, ...signatures].filter(
      Boolean
    )) {
      const func = `function ${signature}`

      try {
        const abi = parseAbi([func]) as Abi
        return [signature, abi]
      } catch (error) {
        console.error(`Failed to parse signature ${signature}: `, error)
      }
    }

    return []
  }, [existingSignature, signatures])

  useEffect(() => {
    if (!selectedSignature) {
      return
    }

    try {
      const func = `function ${selectedSignature}`
      const selector = toFunctionSelector(func)
      applySignature(historyId, selector, selectedSignature)
    } catch (error) {
      console.error("Failed to apply signature: ", error, selectedSignature)
    }
  }, [selectedSignature])

  const detail = useMemo(() => {
    if (!selectedAbi) {
      return
    }

    try {
      return parseCallData(calldata, selectedAbi)
    } catch (error) {
      console.error("Failed to parse calldata: ", error, calldata)
    }
  }, [selectedAbi, calldata])

  const onParamsChange = (params: FunctionDetailParam[]) => {
    if (!selectedAbi || !onCallDataChange) {
      return
    }

    function flatArgs(params: FunctionDetailParam[]) {
      return params.map((param): any => {
        if (param.children && !isValidElement(param.children)) {
          return flatArgs(param.children as FunctionDetailParam[])
        }

        return param.value
      })
    }

    const args = flatArgs(params)

    const newData = encodeFunctionData({
      abi: selectedAbi,
      functionName: (selectedAbi[0] as AbiFunction).name,
      args,
    })

    setCallData(newData)
    onCallDataChange(newData)
  }

  const wrappedDetail = useMemo(() => {
    if (!detail) {
      return null
    }

    return {
      name: wrapName ? wrapName(detail.name) : detail.name,
      params: wrapParams(
        historyId,
        detail.params,
        onParamsChange,
        selector === "0x8d80ff0a" ? UnwrappedMultiSend : ContinueParsing
      ),
    }
  }, [detail, wrapName])

  if (isLoading) {
    return <ParsingSkeleton />
  }

  if (!wrappedDetail) {
    return null
  }

  return <FunctionDetail {...wrappedDetail} onParamsChange={onParamsChange} />
}

function wrapParams(
  historyId: string,
  params: ParsedCalldata["params"],
  onParamsChange: (params: FunctionDetailParam[]) => void,
  Component: React.ComponentType<ContinueParsingProps>
): FunctionDetailParam[] {
  return params.map((param) => {
    if (param.children) {
      const children = wrapParams(
        historyId,
        param.children,
        () => onParamsChange(params),
        ContinueParsing
      )
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
        <Component
          key={subSelector}
          historyId={historyId}
          calldata={param.value}
          onCallDataChange={(calldata) => {
            param.value = calldata
            onParamsChange(params)
          }}
        />
      ) : undefined,
    }
  })
}
