"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { SELECTOR_LENGTH } from "@/lib/parse-calldata"
import { fetcher } from "@/lib/utils"
import { Badge } from "@shadcn/components/ui/badge"
import { Button } from "@shadcn/components/ui/button"
import { Card } from "@shadcn/components/ui/card"
import { useToast } from "@shadcn/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import copy from "copy-to-clipboard"
import { ArrowDown, Share2, Undo2 } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { formatEther } from "viem"
import { useSelectedHistoryItem } from "./selected-history-provider"

export function TransactionCard() {
  const { historyId, historyItem } = useSelectedHistoryItem()
  const { toast } = useToast()
  const { updateCalldata } = useHistory()

  const context = historyItem?.context
  const etherValue = useMemo(() => {
    try {
      return context?.value ? formatEther(BigInt(context.value)) : null
    } catch (error) {
      console.error("Failed to format ether value", error, context?.value)
      return null
    }
  }, [context?.value])

  const selector = context?.calldata.slice(0, SELECTOR_LENGTH)
  const existingSignature = selector ? historyItem?.signatures[selector] : null

  const { data: signatures = [], isLoading: isSelectorsLoading } = useQuery({
    queryKey: ["selectors", selector],
    queryFn: ({ signal }) => fetcher(`/api/selectors/${selector}`, { signal }),
    enabled: !existingSignature && !!selector,
  })

  const functionName = useMemo(() => {
    if (!existingSignature && signatures.length === 0) {
      return null
    }

    return (existingSignature || signatures[0]).slice(
      0,
      signatures[0].indexOf("(")
    )
  }, [existingSignature, signatures])

  if (!context) {
    return null
  }

  const { from, to, hash, calldata } = context
  const isEdited = calldata !== historyItem.calldata

  const onResetClick = () => {
    updateCalldata(historyId, context.calldata)
  }

  const onShareClick = () => {
    const url = new URL(window.location.href)
    url.pathname = `/hashes/${hash}`
    copy(url.toString())
    toast({
      title: "Copied Share Link!",
    })
  }

  return (
    <Card className="w-full bg-bw p-4 border-4 mb-8">
      <div className="flex flex-row items-center flex-wrap mb-4 gap-4">
        <Link
          href={`https://blockscan.com/tx/${hash}`}
          target="_blank"
          className="italic font-bold overflow-hidden text-ellipsis cursor-pointer hover:underline flex-1"
        >
          {hash}
        </Link>
        <div className="flex flex-row gap-2 w-min">
          <Button size="icon" onClick={onResetClick} disabled={!isEdited}>
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button size="icon" onClick={onShareClick}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="w-full border-t-4 border-border border-dotted mt-4 mb-8" />

      <div className="flex flex-col gap-2">
        <Link
          href={`https://blockscan.com/address/${from}`}
          target="_blank"
          className="font-bold cursor-pointer w-min hover:underline"
        >
          {from}
        </Link>
        <div className="w-min flex flex-row gap-2 items-center my-2 ml-[150px]">
          <ArrowDown className="w-4 h-4" />
          {etherValue && (
            <Badge className="whitespace-nowrap rounded-2xl">
              {etherValue} Ether
            </Badge>
          )}
        </div>
        <div className="max-w-full flex flex-row flex-wrap items-baseline">
          <Link
            href={`https://blockscan.com/address/${to}`}
            target="_blank"
            className="font-bold cursor-pointer w-min hover:underline"
          >
            {to}
          </Link>
          {functionName && (
            <div className="font-bold italic md:text-xl text-md underline underline-offset-2">
              .{functionName}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
