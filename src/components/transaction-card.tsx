"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { Button } from "@shadcn/components/ui/button"
import { useToast } from "@shadcn/hooks/use-toast"
import copy from "copy-to-clipboard"
import { Share2, Undo2 } from "lucide-react"
import Link from "next/link"
import { ButtonGroup } from "./button-group"

export function TransactionCard({ id }: { id: string }) {
  const { toast } = useToast()
  const { history, updateCalldata } = useHistory()
  const historyItem = history[id]
  const context = historyItem?.context

  if (!context) {
    return null
  }

  const { from, to, hash } = context
  const isEdited = context.calldata !== historyItem.calldata

  const onItemClick = (value: string) => {
    if (value === "reset") {
      updateCalldata(id, context.calldata)
    } else if (value === "share") {
      const url = new URL(window.location.href)
      url.pathname = `/hashes/${hash}`
      copy(url.toString())
      toast({
        title: "Copied Share Link!",
      })
    }
  }

  return (
    <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow overflow-clip mb-4">
      <div className="flex flex-row items-center mb-4 flex-wrap gap-4">
        <Link
          href={`https://blockscan.com/tx/${hash}`}
          target="_blank"
          className="text-sm font-mono overflow-hidden text-ellipsis text-muted-foreground min-w-56 flex-1 cursor-pointer hover:underline"
        >
          {hash}
        </Link>
        <ButtonGroup onItemClick={onItemClick}>
          <Button value="reset" disabled={!isEdited}>
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button value="share">
            <Share2 className="w-4 h-4" />
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-1 mt-4">
        <div className="text-sm text-muted-foreground">FROM (Sender)</div>
        <Link
          href={`https://blockscan.com/address/${from}`}
          target="_blank"
          className="cursor-pointer w-min hover:underline"
        >
          {from}
        </Link>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <div className="text-sm text-muted-foreground">TO (Contract)</div>
        <Link
          href={`https://blockscan.com/address/${to}`}
          target="_blank"
          className="cursor-pointer w-min hover:underline"
        >
          {to}
        </Link>
      </div>
    </div>
  )
}
