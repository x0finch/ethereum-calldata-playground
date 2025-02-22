import {
  MultiSendTransaction,
  parseGnosisSafeMultiSend,
} from "@/lib/parse-calldata"
import { Badge } from "@shadcn/components/ui/badge"
import Link from "next/link"
import { ReactNode, useMemo } from "react"
import { formatEther } from "viem"
import { ContinueParsing } from "./continue-parsing"
import { SimpleTree } from "./function-detail"

export function UnwrappedMultiSend({
  historyId,
  calldata,
  onCallDataChange,
}: {
  historyId: string
  calldata: string
  onCallDataChange?: (calldata: string) => void
  wrapName?: (name: string) => ReactNode
}) {
  const transactions = useMemo(
    () => parseGnosisSafeMultiSend(calldata),
    [calldata]
  )

  if (transactions.length === 0) {
    return (
      <ContinueParsing
        historyId={historyId}
        calldata={calldata}
        onCallDataChange={onCallDataChange}
      />
    )
  }

  return (
    <SimpleTree parent={<div className="font-bold text-lg">transactions</div>}>
      {transactions.map((transaction, index) => (
        <ContinueParsing
          key={index}
          historyId={historyId}
          calldata={transaction.calldata}
          wrapName={(name) => <WrappedCall {...transaction} name={name} />}
        />
      ))}
    </SimpleTree>
  )
}

function WrappedCall({
  toAddress,
  name,
  value,
}: MultiSendTransaction & { name: string }) {
  const valueInEther = useMemo(() => {
    return formatEther(value)
  }, [value])

  return (
    <div className="flex items-baseline flex-wrap w-full max-w-full">
      <Link
        href={`https://blockscan.com/address/${toAddress}`}
        target="_blank"
        className="text-base font-base font-mono cursor-pointer hover:underline overflow-hidden text-ellipsis leading-none"
        onClick={(e) => e.stopPropagation()}
      >
        {toAddress}
      </Link>
      <span className="font-bold italic text-base underline underline-offset-2 leading-none mr-1">
        .{name}
      </span>
      <Badge>{valueInEther} Ether</Badge>
    </div>
  )
}
