import {
  MultiSendTransaction,
  parseGnosisSafeMultiSend,
} from "@/lib/parse-calldata"
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
    <SimpleTree parent={<div>transactions</div>}>
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
    <div className="flex items-center gap-1">
      <span className="text-gray-500">Call</span>
      <div>
        <Link
          href={`https://blockscan.com/address/${toAddress}`}
          target="_blank"
          className="text-blue-500 underline"
        >
          {toAddress.slice(0, 8)}...{toAddress.slice(-8)}
        </Link>
        .{name}
      </div>
      <span className="text-gray-500">with</span>
      <span>{valueInEther} ETH</span>
    </div>
  )
}
